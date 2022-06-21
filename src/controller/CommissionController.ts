require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {APIGatewayProxyEvent, Context, Handler} from 'aws-lambda';
import {createResponse} from '../util/Utils';

export const initEvent: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let result;
  try {
    result = {percentagePayphoneCommission: parseInt(process.env.PERCENTAGE_PAYPHONE_COMMISSION!)};
    return createResponse(200, result);
  } catch (error: any) {
    console.error(`Error controlado ${error}`);
    return createResponse(error.statusCode||500, error.context||{message: error.message});
  }
};
