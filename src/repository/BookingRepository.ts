import {EmailRepository} from './EmailRepository';
import {CommonRepository} from './CommonRepository';
import {getOptions, MethodEnum} from '../util/Utils';
import {SearchFilter} from '../dto/SearchFilter';
import {invokeLambda} from './LambdaRepository';
import {S3Request} from '../schemas/S3Request';
import {SESRequest} from '../schemas/SESRequest';
import {LambdaRequest} from '../schemas/LambdaRequest';
import {Booking, Business, Catalog, Customer, Location} from '../util/Database';
import {saveImages} from '../util/S3Service';
import {sendEmailC} from '../util/SESService';
import {HttpRepositoryImpl} from './HttpRepositoryImpl';
import {RequestOptions} from 'https';
const BOOKING_FOLDER_NAME = 'booking';
const ENTITY_NAME = 'booking';
const email= new EmailRepository();
// const fs = require('fs');

/**
 * s
 */
export class BookingRepository extends CommonRepository {
  /**
   * Generate Booking
   * @param {string} emailBusiness
   * @param {Booking} object
   */
  async createAlpeloteo(emailBusiness: string | null, object: Booking) {
    let response: any;
    try {
      // validar si existe el usuario en payphone cuando es por pago por PayPhone
      if (object.paymentMethodId != 71 && object.paymentMethodId != null) {
        const {PAYPHONE_PAGO_HOST, PAYPHONE_PAGO_AUTH} = process.env;
        // create path
        const numero = object.mobile;
        const region = '593';
        const path = `/api/Users/${numero}/region/${region}`;
        // create headers
        const token = PAYPHONE_PAGO_AUTH;
        const authorizationBearer = `Bearer ${token}`;
        const serviceAuthorization: HeadersInit = {
          'Content-Type': 'application/json',
          'Authorization': authorizationBearer,
        };
        // create options
        const serviceOptions: RequestOptions = getOptions(
            PAYPHONE_PAGO_HOST,
            path,
            MethodEnum.GET,
            serviceAuthorization,
        );
        // call service validar usuario payphone
        const httpRepository = new HttpRepositoryImpl();
        const resultCallService = await httpRepository.callService(serviceOptions, null);
        console.log('Validación Usuario', resultCallService);
        // call service enviar transacción a payphone
        const result= await this.callPayphone(object);
        if (result.transactionId!== null) {
          const resultransactionId = result.transactionId;
          object.transactionId = resultransactionId;
        }
      }
      const paymentImage = object.paymentImage;
      if (paymentImage !== null && paymentImage.includes('base64')) {
        const s3Request: S3Request = {
          name: new Date().getTime().toString(),
          image: paymentImage,
          folderName: BOOKING_FOLDER_NAME,
          bucketName: process.env.BUCKET_PUBLIC_NAME!,
        };
        const result = await saveImages(s3Request);
        object.paymentImage = result;
      }
      const lambdaRequest: LambdaRequest = {
        entityName: ENTITY_NAME,
        body: {email: emailBusiness, object},
        operation: 'create',
      };
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        response = invokeLambdaResp.body;
      }
      return response;
    } catch (error) {
      console.error( error);
      throw error;
    }
  }

  /**
   * Service pago Payphone
   * @param {object} object
   */
  async callPayphone(object:any ) {
    let response: any;
    try {
      const {PAYPHONE_PAGO_HOST, PAYPHONE_PAGO_PATH, PAYPHONE_PAGO_AUTH} = process.env;
      // create headers
      const token = PAYPHONE_PAGO_AUTH;
      const authorizationBearer = `Bearer ${token}`;
      const serviceAuthorization: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': authorizationBearer,
      };
      // create options
      const serviceOptions: RequestOptions = getOptions(
          PAYPHONE_PAGO_HOST,
          PAYPHONE_PAGO_PATH,
          MethodEnum.POST,
          serviceAuthorization,
      );
      // generar ClientTransactionId
      const clientTranst = Math.floor(1000 + Math.random() * 9000);
      const searchCustomer = await Customer.findOne({
        where: {id: object.customerId},
        include: [{model: Catalog, as: 'mobileCode', attributes: ['code']}],
      });

      const searchLocation = await Location.findOne({
        where: {id: object.locationId},
        include: [{model: Business, as: 'business'}],
      });

      const bodyRequest = {
        phoneNumber: object?.mobile,
        countryCode: searchCustomer!.mobileCode.code,
        clientUserId: object?.customerId,
        amount: ((object!.total) * 100).toFixed(),
        amountWithTax: 0,
        amountWithoutTax: ((object!.subtotal) * 100).toFixed(),
        tax: 0,
        service: ((object!.payphoneCommission) * 100).toFixed(),
        tip: 0,
        clientTransactionId: `CUSTOMER${clientTranst}`,
        storeId: searchLocation!.business?.storeId,
        currency: 'USD',
      };
      // call service
      const httpRepository = new HttpRepositoryImpl();
      response = await httpRepository.callService(serviceOptions, JSON.stringify(bodyRequest));
      console.log('Envió de la transacción', response);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Service consulta estado de transactionId Payphone
   * @param {object} searchBooking
   * @param {object} searchLocation
   */
  async consultStatusTransaction(searchBooking: any, searchLocation: any) {
    // consulta el estado de la transaction
    const {PAYPHONE_PAGO_HOST, PAYPHONE_PAGO_AUTH} = process.env;
    // create path
    const transactionIdVerify= searchBooking.transactionId;
    const path = `/api/Sale/${transactionIdVerify}`;
    // create headers
    const token = PAYPHONE_PAGO_AUTH;
    const authorizationBearer = `Bearer ${token}`;
    const serviceAuthorization: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': authorizationBearer,
    };
    // create options
    const serviceOptions: RequestOptions = getOptions(
        PAYPHONE_PAGO_HOST,
        path,
        MethodEnum.GET,
        serviceAuthorization,
    );
    // call service
    const httpRepository = new HttpRepositoryImpl();
    const resultCallService = await httpRepository.callService(serviceOptions, null);
    const statusPaymentPayphone= resultCallService.transactionStatus;
    console.log('Estado de transaction ***', statusPaymentPayphone);
  }
  /**
   * Generate Booking
   * @param {Booking} object
   */
  async createCustomer(object: Booking) {
    let response: any;

    try {
      response = await this.createAlpeloteo(null, object);
      const searchBooking = response.searchBooking;
      // envio de email si es payphone desde web
      if (response.searchBooking.sourceApp === 'CUSTOMER' && response.searchBooking.statusId === 33) {
        await email.sendEmailBookingPayphone(searchBooking);
      }
      const ecTime = new Date(searchBooking.emissionDate).toLocaleString('es-EC', {
        timeZone: 'America/Guayaquil',
      });
      const emailRequest: SESRequest = {
        from: `alpeloteo.com <${process.env.MAILING_FROM}>`,
        to: [`${process.env.MAILING_NOTIFICATION_TO}`],
        documentNumber: searchBooking.bookingNumber || '',
        subject: `${searchBooking.location.business.tradename} 
        - Verificación de reserva #${searchBooking.bookingNumber}`,
        emissionDate: ecTime.toLocaleString(),
        attachments: null,
        html: `Empresa: 
        ${searchBooking.location.business.firstName} ${searchBooking.location.business.lastName} 
        - ${searchBooking.location.business.tradename}
        Localidad: ${searchBooking.location.sector} 
        Reserva #: ${searchBooking.bookingNumber}`,
      };
      await sendEmailC(emailRequest);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Generate Booking
   * @param {string} emailBusiness
   * @param {Booking} object
   */
  async createBusiness(emailBusiness: string | null, object: Booking) {
    let response: any;
    try {
      response = await this.createAlpeloteo(emailBusiness, object);
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
          body: {id: id},
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
  async updateAlpeloteo(object: Booking) {
    let response: any;
    try {
      const logoPaymentImage = object.paymentImage;
      if (logoPaymentImage !== null && logoPaymentImage.includes('base64')) {
        const s3Request: S3Request = {
          name: new Date().getTime().toString(),
          image: logoPaymentImage,
          folderName: BOOKING_FOLDER_NAME,
          bucketName: process.env.BUCKET_PUBLIC_NAME!,
        };
        const result = await saveImages(s3Request);
        object.paymentImage = result;
      }
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
      console.log(object.statusId);
      if (response.searchBooking.emailWasSent === false && response.searchBooking.statusId === 33 ) {
        // si es reservado enviar correo al customer y dueño de cancha
        const searchBooking = response.searchBooking;
        await email.sendEmailBooking(searchBooking);
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
  * @param {object} object
  * @return {response} response
  */
  async update(object: Booking) {
    let response;
    try {
      const logoPaymentImage = object.paymentImage;
      if (logoPaymentImage !== null && logoPaymentImage.includes('base64')) {
        const s3Request: S3Request = {
          name: new Date().getTime().toString(),
          image: logoPaymentImage,
          folderName: BOOKING_FOLDER_NAME,
          bucketName: process.env.BUCKET_PUBLIC_NAME!,
        };
        const result = await saveImages(s3Request);
        object.paymentImage = result;
      }
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
      response = !response ?
        {message: 'Document can\'t be updated.', statusCode: 500} :
        {message: 'Document updated.'};
      return response;
    } catch (error) {
      console.error(error);
      // await t.rollback();
      throw error;
    }
  }
  /**
  * s
  * @param {object} object
  * @return {response} response
  */
  async updatePayments(object: Booking[]) {
    let response;
    try {
      object.forEach((resp) => {
        resp.isPaid = true;
        resp.paymentDate = new Date().toISOString();
        return resp;
      });
      const lambdaRequest: LambdaRequest = {
        entityName: ENTITY_NAME,
        body: object,
        operation: 'updatePayments',
      };
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
        console.log(JSON.stringify(lambdaRequest));
      } else {
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
      // await t.rollback();
      throw error;
    }
  }

  /**
  * s
  * @param {object} object
  * @return {response} response
  */
  async updateReschedules(object: Booking ) {
    let response: any;
    try {
      if (object.statusId===33) {
        if (process.env.IS_OFFLINE == 'true') {
          console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
        } else {
          const lambdaRequest: LambdaRequest = {
            entityName: ENTITY_NAME,
            body: object,
            operation: 'updateReschedules',
          };
          const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
              JSON.stringify(lambdaRequest));
          if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
            throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
          }
          response = invokeLambdaResp.body;
        }
        if (response.searchBooking.reschedule === true && response.searchBooking.statusId === 33) {
          // si es reservado enviar al correo comprobante
          const searchBooking = response.searchBooking;
          await email.sendEmailBooking(searchBooking);
        }
      } else {
        throw new Error('No puede Reagendar su pago no esta completado');
      }
      response = !response ?
        {message: 'Document can\'t be updated.', statusCode: 500} :
        {message: 'Document updated.'};
      return response;
    } catch (error) {
      console.error(error);
      // await t.rollback();
      throw error;
    }
  }

  /**
   * s
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllByPaginates(searchFilter: SearchFilter) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {searchFilter},
          operation: 'findAllByPaginates',
        };
        console.log(JSON.stringify(lambdaRequest));
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
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllPaymentsByPaginates(searchFilter: SearchFilter) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {searchFilter},
          operation: 'findAllPaymentsByPaginates',
        };
        console.log(JSON.stringify(lambdaRequest));
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {searchFilter},
          operation: 'findAllPaymentsByPaginates',
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
   * @param {string} emailCustomer
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllByBusinessPaginates(emailCustomer: string, searchFilter: SearchFilter) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {email: emailCustomer, searchFilter},
          operation: 'findAllByBusinessPaginates',
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
   * @param {string} emailCustomer
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllByCustomerPaginates(emailCustomer: string, searchFilter: SearchFilter) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {email: emailCustomer, searchFilter},
          operation: 'findAllByCustomerPaginates',
        };
        console.log(JSON.stringify(lambdaRequest));
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {email: emailCustomer, searchFilter},
          operation: 'findAllByCustomerPaginates',
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
   * @param {number} idBusiness
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findByIdBusiness(idBusiness: number, searchFilter: SearchFilter) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {id: idBusiness, searchFilter},
          operation: 'findByIdBusiness',
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
