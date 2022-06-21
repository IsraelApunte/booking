import {CommonRepository} from './CommonRepository';
import {invokeLambda} from './LambdaRepository';
import {LambdaRequest} from '../schemas/LambdaRequest';
import {getOptions, MethodEnum} from '../util/Utils';
import {RequestOptions} from 'https';
import {HttpRepositoryImpl} from './HttpRepositoryImpl';
import {EmailRepository} from './EmailRepository';
const ENTITY_NAME = 'booking';

/**
 * s
 */
export class PaymentVerifyRepository extends CommonRepository {
  /**
   * s
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllPaymentVerify() {
    let result: any;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {},
          operation: 'findPaymentVerify',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        result = invokeLambdaResp.body;
      }
      const listTransactionCanceled = [];
      const listTransactionApproved = [];
      if (result !== null && result.length > 0) {
        for (const booking of result) {
          const transactionIdVerify = booking.transactionId;
          // consulta el estado de la transaction
          const {PAYPHONE_PAGO_HOST, PAYPHONE_PAGO_AUTH} = process.env;
          // create path
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
          if (resultCallService.transactionStatus=='Approved') {
            const sendEmail= new EmailRepository();
            const searchBooking= booking;
            await sendEmail.sendEmailBookingPayphone(searchBooking);
            listTransactionApproved.push(booking.id);
          }
          if (resultCallService.transactionStatus=='Canceled') {
            listTransactionCanceled.push(booking.id);
          }
        }
      }
      console.log('lista transtion Approved', listTransactionApproved );
      console.log('lista transtion Canceled', listTransactionCanceled );
      await this.updatePaymentsVerifyApproved(listTransactionApproved);
      await this.updatePaymentsVerifyCanceled(listTransactionCanceled);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
  * s
  * @param {object} bookingIds
  * @return {response} response
  */
  async updatePaymentsVerifyApproved(bookingIds: number []) {
    let response: any;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: bookingIds,
          operation: 'updatePaymentsVerifyApproved',
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
  * @param {object} bookingIds
  * @return {response} response
  */
  async updatePaymentsVerifyCanceled(bookingIds: number []) {
    let response;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: bookingIds,
          operation: 'updatePaymentsVerifyCanceled',
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
}


