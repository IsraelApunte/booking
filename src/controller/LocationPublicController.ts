require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {APIGatewayProxyEvent, Context, Handler} from 'aws-lambda';
import {SearchFilter} from '../dto/SearchFilter';
import {LocationPublicService} from '../service/LocationPublicService';
import {createLogContext, createResponse, getSearchFilter} from '../util/Utils';

export const initEvent: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let result;
  try {
    const {httpMethod, pathParameters, queryStringParameters, path} = event;
    if (httpMethod === 'GET') {
      if (pathParameters !== null && queryStringParameters === null) {
        const {id} = pathParameters!;
        result = await findById(parseInt(id!), context);
      }
      if (queryStringParameters !== null && path.includes('sports')) {
        const {id} = pathParameters!;
        const {page, limit, filter, sort, isAsc} = queryStringParameters!;
        const filters = getSearchFilter(page, limit, filter, sort, isAsc);
        result = await findPublicBySportId(parseInt(id!), filters, context);
      }
      console.log('resuil----------', result);
      return createResponse(200, result);
    } else {
      return createResponse(401, {message: 'Unauthorized'});
    }
  } catch (error: any) {
    console.error(`Error controlado ${error}`);
    return createResponse(error.statusCode || 500, error.context || {message: error.message});
  }
};


export const findPublicBySportId = async (sportId: number, searchFilter: SearchFilter, context: Context) => {
  try {
    const locationService = new LocationPublicService();
    return await locationService.findPublicBySportId(sportId, searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};
export const findById = async (id: number, context: Context) => {
  try {
    const locationService = new LocationPublicService();
    return await locationService.findPublicById(id);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};
