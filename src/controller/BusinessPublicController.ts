require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {APIGatewayProxyEvent, Context, Handler} from 'aws-lambda';
import {BusinessPublicService} from '../service/BusinessPublicService';
import {createLogContext, createResponse} from '../util/Utils';
import {Business} from '../util/Database';

export const initEvent: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let result;
  try {
    const {httpMethod} = event;
    if (httpMethod === 'POST') {
      const {body} = event;
      const requestBody = JSON.parse(body!);
      result = await create(requestBody, context);
    }
    return createResponse(200, result);
  } catch (error: any) {
    console.error(`Error controlado ${error}`);
    return createResponse(error.statusCode||500, error.context||{message: error.message});
  }
};

export const create = async (body: Business, context: Context) => {
  try {
    const businessService = new BusinessPublicService();
    return await businessService.create(body);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};
