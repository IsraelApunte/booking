import {SearchFilter} from '../dto/SearchFilter';
import {S3Request} from '../schemas/S3Request';
import {LambdaRequest} from '../schemas/LambdaRequest';
import {CommonRepository} from './CommonRepository';
import {invokeLambda} from './LambdaRepository';
import {Banner} from '../util/Database';
import {saveImages} from '../util/S3Service';
const BANNER_FOLDER_NAME = 'banner';
const ENTITY_NAME = 'banner';
/**
 * s
 */
export class BannerRepository extends CommonRepository {
  /**
   * Create
   * @param {object} object
   * @return {response} response
   */
  async create(object: Banner): Promise<Banner> {
    let response;
    try {
      const imageDesktop = object.imageDesktop;
      if (imageDesktop !== null && imageDesktop.includes('base64')) {
        // const DesktopI = await saveImages(new Date().getTime(), [imageDesktop], BANNER_FOLDER_NAME);
        const s3RequestDesktop: S3Request = {
          name: new Date().getTime().toString(),
          image: imageDesktop,
          folderName: BANNER_FOLDER_NAME,
          bucketName: process.env.BUCKET_PUBLIC_NAME!,
        };
        const result = await saveImages(s3RequestDesktop);
        object.imageDesktop = result;
      }
      const imageTablet = object.imageTablet;
      if (imageTablet !== null && imageTablet.includes('base64')) {
        // const TabletI = await saveImages(new Date().getTime(), [imageTablet], BANNER_FOLDER_NAME);
        const s3RequestTablet: S3Request = {
          name: new Date().getTime().toString(),
          image: imageTablet,
          folderName: BANNER_FOLDER_NAME,
          bucketName: process.env.BUCKET_PUBLIC_NAME!,
        };
        const result = await saveImages(s3RequestTablet);
        object.imageTablet = result;
      }
      const imageMobile = object.imageMobile;
      if (imageMobile !== null && imageMobile.includes('base64')) {
        // const MobileI = await saveImages(new Date().getTime(), [imageMobile], BANNER_FOLDER_NAME);
        const s3RequestMobile: S3Request = {
          name: new Date().getTime().toString(),
          image: imageMobile,
          folderName: BANNER_FOLDER_NAME,
          bucketName: process.env.BUCKET_PUBLIC_NAME!,
        };
        const result = await saveImages(s3RequestMobile);
        object.imageMobile = result;
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
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        response = invokeLambdaResp.body;
      }
      return <Banner>response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find All By Paginates Banners
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
  /**
   * s
   * @param {object} object
   * @return {response} response
   */
  async update(object: Banner) {
    let response;
    try {
      const imageDesktop = object.imageDesktop;
      if (imageDesktop !== null && imageDesktop.includes('base64')) {
        // const DesktopI = await saveImages(new Date().getTime(), [imageDesktop], BANNER_FOLDER_NAME);
        const s3RequestDesktop: S3Request = {
          name: new Date().getTime().toString(),
          image: imageDesktop,
          folderName: BANNER_FOLDER_NAME,
          bucketName: process.env.BUCKET_PUBLIC_NAME!,
        };
        const result = await saveImages(s3RequestDesktop);
        object.imageDesktop = result;
      }
      const imageTablet = object.imageTablet;
      if (imageTablet !== null && imageTablet.includes('base64')) {
        // const TabletI = await saveImages(new Date().getTime(), [imageTablet], BANNER_FOLDER_NAME);
        const s3RequestTablet: S3Request = {
          name: new Date().getTime().toString(),
          image: imageTablet,
          folderName: BANNER_FOLDER_NAME,
          bucketName: process.env.BUCKET_PUBLIC_NAME!,
        };
        const result = await saveImages(s3RequestTablet);
        object.imageTablet = result;
      }
      const imageMobile = object.imageMobile;
      if (imageMobile !== null && imageMobile.includes('base64')) {
        // const MobileI = await saveImages(new Date().getTime(), [imageMobile], BANNER_FOLDER_NAME);
        const s3RequestMobile: S3Request = {
          name: new Date().getTime().toString(),
          image: imageMobile,
          folderName: BANNER_FOLDER_NAME,
          bucketName: process.env.BUCKET_PUBLIC_NAME!,
        };
        const result = await saveImages(s3RequestMobile);
        object.imageMobile = result;
      }
      let result;
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
        result = invokeLambdaResp.body;
      }
      response = !result?
          {message: 'Document can\'t be updated.', statusCode: 500} :
          {message: 'Document updated.'};
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

