/* eslint-disable no-unused-vars */

import {CommonRepository} from './CommonRepository';
import {SearchFilter} from '../dto/SearchFilter';
import {S3Request} from '../schemas/S3Request';
import {invokeLambda} from './LambdaRepository';
import {LambdaRequest} from '../schemas/LambdaRequest';
import {Business, Role, User} from '../util/Database';
import {saveImages} from '../util/S3Service';
// import 'cross-fetch/polyfill';
// import AmazonCognitoIdentity from 'amazon-cognito-identity-js';
// import {
//   CognitoUserPool,
//   CognitoUserAttribute,
//   CognitoUser,
// } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';
import {SESRequest} from '../schemas/SESRequest';
import {sendEmailC} from '../util/SESService';
AWS.config.update({region: process.env.REGION});
const BUSINESS_FOLDER_NAME = 'business';
const ENTITY_NAME = 'business';

/**
 * s
 */
export class BusinessRepository extends CommonRepository {
  /**
   *
   * @param {string} email
   * @return {object} test
   */
  async signUp(email: string) {
    try {
      const val = Math.floor(1000 + Math.random() * 9000);
      const params = {
        UserPoolId: process.env.USER_POOL_ID!, /* required */
        Username: email,
        DesiredDeliveryMediums: ['EMAIL'],
        TemporaryPassword: `Alpeloteo${val}`,
        UserAttributes: [
          {
            Name: 'email', /* required */
            Value: email,
          },
          {
            Name: 'email_verified', /* required */
            Value: 'true',
          },
        ],
      };
      const cognitoidentityserviceprovider =
        new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});
      const createuser = await cognitoidentityserviceprovider.adminCreateUser(params).promise();
      const paramsAddToGroup = {
        UserPoolId: process.env.USER_POOL_ID!,
        Username: createuser.User?.Username!,
        GroupName: process.env.ROLE_USER_BUSINESS!,
      };
      await cognitoidentityserviceprovider.adminAddUserToGroup(paramsAddToGroup).promise();
      return createuser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   *
   * @param {string} email
   * @return {object} test
   */
  async deleteUser(email: string) {
    try {
      const params = {
        UserPoolId: process.env.USER_POOL_ID!, /* required */
        Username: email,
        UserAttributes: [
          {
            Name: 'email', /* required */
            Value: email,
          },
          {
            Name: 'email_verified', /* required */
            Value: 'true',
          },
        ],
      };

      const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});
      const deleteBusiness = await cognitoidentityserviceprovider.adminDeleteUser(params).promise();
      return deleteBusiness;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * s
   * @param {object} object
   * @return {response} response
   */
  async create(object: Business): Promise<Business> {
    let response: any;
    try {
      const logoImage = object.logo;
      if (logoImage !== null && logoImage.includes('base64')) {
        const s3Request: S3Request = {
          name: new Date().getTime().toString(),
          image: logoImage,
          folderName: BUSINESS_FOLDER_NAME,
          bucketName: process.env.BUCKET_PUBLIC_NAME!,
        };
        const result = await saveImages(s3Request);
        object.logo = result;
      }
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: object,
          operation: 'create',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp.body)}`);
        }
        response = invokeLambdaResp.body;
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * s
   * @param {object} object
   * @return {response} response
   */
  async createAlpeloteo(object: Business): Promise<Business> {
    let response: any;
    try {
      response = await this.create(object);
      const signUpResult= await this.signUp(object.email);
      await User.create({
        id: null,
        username: signUpResult.User?.Username!,
        email: object.email,
        roleId: parseInt(process.env.ROLE_USER_BUSINESS_ID!),
      });
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * s
   * @param {object} object
   * @return {response} response
   */
  async createCustomer(object: Business): Promise<Business> {
    let response: any;
    try {
      const searchUser= await User.findOne({where: {email: object.email},
        include: [{model: Role, as: 'role'}]});
      if (object.email === searchUser?.email) {
        const role = searchUser.role.name;
        throw new Error(`You are registered as a ${role}` );
      }
      response = await this.create(object);
      // envio de email notificando el registro de una nueva Franquicia
      const ecTime = new Date().toLocaleString('es-EC', {
        timeZone: 'America/Guayaquil',
      });
      const emailRequest: SESRequest = {
        from: `alpeloteo.com <${process.env.MAILING_FROM}>`,
        to: [`${process.env.MAILING_NOTIFICATION_TO_TWO}`],
        documentNumber: null,
        subject: `Nueva Franquicia Registrada`,
        emissionDate: ecTime.toLocaleString(),
        attachments: null,
        html: `Se ha registrado un nuevo dueño de Cancha:${response.firstName} ${response.lastName}
        Nombre Comercial: ${response.tradename} 
        Número de Identificación #: ${response.identificationNumber}`,
      };
      await sendEmailC(emailRequest);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * s
   * @param {number} id
   * @return {response} response
   */
  async getOne(id: number) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {id},
          operation: 'getOne',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        result = invokeLambdaResp.body;
      }
      if (!result) {
        result = {message: `Document ${id} Not Found.`, statusCode: 404};
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * s
   * @param {object} object
   * @return {response} response
   */
  async update(object: any) {
    let response:any;
    try {
      // copia de objeto
      const newJsonObject = Object.assign({}, object);
      const logoImage = object.logo;
      if (logoImage !== null && logoImage.includes('base64')) {
        const s3Request: S3Request = {
          name: new Date().getTime().toString(),
          image: logoImage,
          folderName: BUSINESS_FOLDER_NAME,
          bucketName: process.env.BUCKET_PUBLIC_NAME!,
        };
        const result = await saveImages(s3Request);
        object.logo = result;
      }
      object.logo = logoImage;
      object.emailWasSent=true;

      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: object,
          operation: 'update',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        response = invokeLambdaResp.body;
      }
      // Se actualiza el storeId y se envia el email con USER y PASSWORD
      if (newJsonObject.emailWasSent===false && newJsonObject.storeId !== null ) {
        const signUpResult= await this.signUp(object.email);
        await User.create({
          id: null,
          username: signUpResult.User?.Username!,
          email: object.email,
          roleId: parseInt(process.env.ROLE_USER_BUSINESS_ID!),
        });
      }
      response = !response ?
        {message: 'Document can\'t be updated.', statusCode: 500} :
        {message: 'Document updated.'};
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * s
   * @param {string} emailBusiness
   * @param {object} object
   * @return {response} response
   */
  async updateByBusiness(emailBusiness: string, object: Business) {
    let response;
    try {
      const logoImage = object.logo;
      if (logoImage !== null && logoImage.includes('base64')) {
        const s3Request: S3Request = {
          name: new Date().getTime().toString(),
          image: logoImage,
          folderName: BUSINESS_FOLDER_NAME,
          bucketName: process.env.BUCKET_PUBLIC_NAME!,
        };
        const result = await saveImages(s3Request);
        object.logo = result;
      }
      object.logo = logoImage;
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {email: emailBusiness, object},
          operation: 'updateByBusiness',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        response = invokeLambdaResp.body;
      }
      response = !response ?
        {message: 'Document can\'t be updated.', statusCode: 500} :
        {message: 'Document updated.'};
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * s
   * @param {string} emailBusiness
   * @param {number} id
   * @return {response} response
   */
  async getOneByBusiness(emailBusiness: string, id: number) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {email: emailBusiness, id},
          operation: 'getOneByBusiness',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        result = invokeLambdaResp.body;
      }
      if (!result) {
        result = {message: `Document ${id} Not Found.`, statusCode: 404};
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * s
   * @param {string} emailAlpeloteo
   * @param {number} id
   * @return {response} response
   */
  async getOneByAlpeloteoProfile(emailAlpeloteo: string) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {email: emailAlpeloteo},
          operation: 'getOneByAlpeloteoProfile',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        result = invokeLambdaResp.body;
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * s
   * @param {string} emailBusiness
   * @param {number} id
   * @return {response} response
   */
  async getOneByBusinessProfile(emailBusiness: string) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {email: emailBusiness},
          operation: 'getOneByBusinessProfile',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        result = invokeLambdaResp.body;
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find Business by paginates
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllByPaginates(searchFilter: SearchFilter) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {searchFilter},
          operation: 'findAllByPaginates',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        result = invokeLambdaResp.body;
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
