require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {APIGatewayProxyEvent, Context, Handler} from 'aws-lambda';
import {SearchFilter} from '../dto/SearchFilter';
import {LocationService} from '../service/LocationService';
import {Location} from '../util/Database';
import {Authorization, createLogContext, createResponse, getAuthorization,
  getSearchFilter, validAJV} from '../util/Utils';
import * as businessSchema from '../validation/business-schema.json';

export const initEvent: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let result;
  try {
    const {ROLE_USER_BUSINESS, ROLE_USER_CUSTOMER, ROLE_USER_ALPELOTEO} = process.env;
    const authorizationParams: Authorization = getAuthorization(event.headers.Authorization||
      event.headers.authorization!);
    if (authorizationParams.group === ROLE_USER_BUSINESS ||
      authorizationParams.group === ROLE_USER_CUSTOMER ||
      authorizationParams.group === ROLE_USER_ALPELOTEO) {
      const {httpMethod} = event;
      let requestBody = null;
      if (httpMethod === 'POST' || httpMethod === 'PUT') {
        const {body} = event;
        requestBody = JSON.parse(body!);
        validAJV(businessSchema, requestBody);
        if (httpMethod === 'POST') {
          result = await create(authorizationParams, requestBody, context);
        } else {
          result = await update(authorizationParams, requestBody, context);
        }
      }
      if (httpMethod === 'GET' || httpMethod === 'DELETE') {
        const {pathParameters, queryStringParameters, path} = event;
        if (httpMethod === 'GET' && pathParameters !== null && !path.includes('businesses')) {
          const {id} = pathParameters!;
          result = await findById(authorizationParams, parseInt(id!), context);
        }
        if (httpMethod === 'GET' && queryStringParameters !== null && !path.includes('businesses')) {
          const {page, limit, filter, sort, isAsc} = queryStringParameters!;
          const filters = getSearchFilter(page, limit, filter, sort, isAsc);
          result = await find(authorizationParams, filters, context);
        }
        if (httpMethod === 'GET' && queryStringParameters !== null && path.includes('businesses')) {
          const {page, limit, filter, sort, isAsc} = queryStringParameters!;
          const filters = getSearchFilter(page, limit, filter, sort, isAsc);
          const {id} = pathParameters!;
          result = await findBusiness(authorizationParams, parseInt(id!), filters, context);
        }
        if (httpMethod === 'DELETE' && pathParameters !== null) {
          const {id} = pathParameters!;
          result = await remove(authorizationParams, parseInt(id!), context);
        }
      }
      return createResponse(200, result);
    } else {
      return createResponse(401, {message: 'Unauthorized'});
    }
  } catch (error: any) {
    console.error(`Error controlado ${error}`);
    return createResponse(error.statusCode || 500, error.context || {message: error.message});
  }
};


export const create = async (authorizationParams: Authorization, body: Location, context: Context) => {
  try {
    const locationService = new LocationService();
    return await locationService.create(authorizationParams, body);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const find = async (authorizationParams: Authorization, searchFilter: SearchFilter, context: Context) => {
  try {
    const locationService = new LocationService();
    return await locationService.find(authorizationParams, searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};
export const findBusiness = async (authorizationParams: Authorization, id: number,
    searchFilter: SearchFilter, context: Context) => {
  try {
    const locationService = new LocationService();
    return await locationService.findBusiness(authorizationParams, id, searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const findById = async (authorizationParams: Authorization, id: number, context: Context) => {
  try {
    const locationService = new LocationService();
    return await locationService.findById(authorizationParams, id);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const update = async (authorizationParams: Authorization, body: any, context: Context) => {
  try {
    const locationService = new LocationService();
    return await locationService.update(authorizationParams, body);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const remove = async (authorizationParams: Authorization, id: number, context: Context) => {
  try {
    // const photoServiceImpl = new PhotoServiceImpl();
    // return photoServiceImpl.remove(authorizationParams, id);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};
