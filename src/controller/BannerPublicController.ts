require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {APIGatewayProxyEvent, Context, Handler} from 'aws-lambda';
import {SearchFilter} from '../dto/SearchFilter';
import {BannerPublicService} from '../service/BannerPublicService';
import {createLogContext, createResponse, getSearchFilter} from '../util/Utils';

export const initEvent: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let result;
  try {
    const {httpMethod, queryStringParameters} = event;
    if (httpMethod === 'GET' && queryStringParameters !== null) {
      const {page, limit, filter, sort, isAsc} = queryStringParameters!;
      const filters = getSearchFilter(page, limit, filter, sort, isAsc);
      result = await find( filters, context);
      return createResponse(200, result);
    } else {
      return createResponse(401, {message: 'Unauthorized'});
    }
  } catch (error: any) {
    console.error(`Error controlado ${error}`);
    return createResponse(error.statusCode || 500, error.context || {message: error.message});
  }
};

export const find = async (searchFilter: SearchFilter, context: Context) => {
  try {
    const bannerService = new BannerPublicService();
    return await bannerService.findPublic(searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};
