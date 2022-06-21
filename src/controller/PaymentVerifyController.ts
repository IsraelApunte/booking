/* eslint-disable prefer-const */
require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {APIGatewayProxyEvent, Context, Handler} from 'aws-lambda';
import {createLogContext, createResponse} from '../util/Utils';
import {PaymentVerifyService} from '../service/PaymentVerifyService';

export const initEvent: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    let result;
    result = await paymentVerifiy(context);
    return createResponse(200, result);
  } catch (error: any) {
    console.error(`Error controlado ${(error)}`);
    return createResponse(error.statusCode||500, error.context||{message: error.message});
  }
};

export const paymentVerifiy = async (context: Context) => {
  try {
    const paymentVerifiy = new PaymentVerifyService();
    return await paymentVerifiy.find();
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};
