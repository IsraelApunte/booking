require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {APIGatewayProxyEvent, Context, Handler} from 'aws-lambda';
import {SearchFilter} from '../dto/SearchFilter';
import {CustomerService} from '../service/CustomerService';
import {Customer} from '../util/Database';
import {Authorization, createLogContext, createResponse, getAuthorization,
  getSearchFilter, validAJV} from '../util/Utils';
import * as customerSchema from '../validation/customer-schema.json';

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
        validAJV(customerSchema, requestBody);
        if (httpMethod === 'POST') {
          result = await create(authorizationParams, requestBody, context);
        } else {
          result = await update(authorizationParams, requestBody, context);
        }
      }
      if (httpMethod === 'GET' || httpMethod === 'DELETE') {
        const {pathParameters, queryStringParameters, path} = event;
        if (httpMethod === 'GET' && pathParameters !== null && !path.includes('profiles')) {
          const {id} = pathParameters!;
          result = await findById(authorizationParams, parseInt(id!), context);
        }
        if (httpMethod === 'GET' && queryStringParameters !== null && !path.includes('profiles')) {
          const {page, limit, filter, sort, isAsc} = queryStringParameters!;
          const filters = getSearchFilter(page, limit, filter, sort, isAsc);
          result = await find(authorizationParams, filters, context);
        }
        if (httpMethod === 'GET' && queryStringParameters === null && path.includes('profiles')) {
          result = await findByProfile(authorizationParams, context);
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
    return createResponse(error.statusCode||500, error.context||{message: error.message});
  }
};

export const create = async (authorizationParams: Authorization, body: Customer, context: Context) => {
  try {
    const customerService = new CustomerService();
    return await customerService.create(authorizationParams, body);
  } catch (error: any) {
    console.error('----->', error);
    if (error.message.includes('23505')) {
      const duplicateObject= JSON.parse(error.message);
      error.context = createLogContext(context, duplicateObject.detail, duplicateObject.code );
    } else {
      error.context = createLogContext(context, error.message);
    }
    throw error;
  }
};

export const find = async (authorizationParams: Authorization, searchFilter: SearchFilter, context: Context) => {
  try {
    const customerService = new CustomerService();
    return await customerService.find(authorizationParams, searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const findByProfile = async (authorizationParams:any, context: Context) => {
  try {
    const customerService = new CustomerService();
    return await customerService.findByProfile(authorizationParams);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const findById = async (authorizationParams: Authorization, id: number, context: Context) => {
  try {
    const customerService = new CustomerService();
    return await customerService.findById(authorizationParams, id);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const update = async (authorizationParams: Authorization, body: Customer, context: Context) => {
  try {
    const customerService = new CustomerService();
    return await customerService.update(authorizationParams, body);
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
