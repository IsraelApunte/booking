require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {APIGatewayProxyEvent, Context, Handler} from 'aws-lambda';
import {SearchFilter} from '../dto/SearchFilter';
import {SearchFilterBooking} from '../dto/SearchFilterBooking';
import {ProductService} from '../service/ProductService';
import {Product} from '../util/Database';
import {
  Authorization, createLogContext, createResponse, getAuthorization,
  getSearchFilter, validAJV,
} from '../util/Utils';
import * as businessSchema from '../validation/business-schema.json';

export const initEvent: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let result;
  try {
    const {ROLE_USER_ALPELOTEO, ROLE_USER_BUSINESS, ROLE_USER_CUSTOMER} = process.env;
    const authorizationParams: Authorization = getAuthorization(event.headers.Authorization ||
      event.headers.authorization!);
    if (authorizationParams.group === ROLE_USER_ALPELOTEO ||
      authorizationParams.group === ROLE_USER_BUSINESS ||
      authorizationParams.group === ROLE_USER_CUSTOMER) {
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
        if (httpMethod === 'GET' && pathParameters !== null && !path.includes('sports') &&
         !path.includes('locations') && !path.includes('schedules/bookings')) {
          const {id} = pathParameters!;
          result = await findById(authorizationParams, parseInt(id!), context);
        }
        if (httpMethod === 'GET' && queryStringParameters !== null ) {
          const {page, limit, filter, sort, isAsc} = queryStringParameters!;
          const filters = getSearchFilter(page, limit, filter, sort, isAsc);
          if (path.includes('sports') && pathParameters !== null && !path.includes('locations') &&
          !path.includes('schedules/bookings')) {
            const {id} = pathParameters!;
            result = await findBySportId(authorizationParams, parseInt(id!), filters, context);
          } else {
            result = await find(authorizationParams, filters, context);
          }
          if (path.includes('sports') && pathParameters !== null && path.includes('locations') &&
          !path.includes('schedules/bookings')) {
            const {id, locationId} = pathParameters!;
            result = await findSportByIdLocation(authorizationParams, parseInt(id!),
                parseInt(locationId!), filters, context);
          }
          if (httpMethod === 'GET' && pathParameters !== null && !path.includes('locations') &&
          path.includes('schedules/bookings')) {
            const {id} = pathParameters!;
            const {queryStringParameters} = event;
            const {bookingDate} = queryStringParameters!;
            const filter: SearchFilterBooking= {
              bookingDate: bookingDate === undefined? null: bookingDate,
            };
            result = await findByIdSchedules(parseInt(id!), filter, context);
          }
        }
        if (httpMethod === 'DELETE' && pathParameters !== null) {
          const {id} = pathParameters!;
          result = await remove(authorizationParams, parseInt(id!), context);
        }
      }
      console.log('resul----------', result);
      return createResponse(200, result);
    } else {
      return createResponse(401, {message: 'Unauthorized'});
    }
  } catch (error: any) {
    console.error(`Error controlado ${error}`);
    return createResponse(error.statusCode || 500, error.context || {message: error.message});
  }
};


export const create = async (authorizationParams: Authorization,
    body: Product, context: Context) => {
  try {
    const productService = new ProductService();
    return await productService.create(authorizationParams, body);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const find = async (authorizationParams: Authorization,
    searchFilter: SearchFilter, context: Context) => {
  try {
    const productService = new ProductService();
    return await productService.find(authorizationParams, searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const findBySportId = async (authorizationParams: Authorization,
    sportId: number, searchFilter: SearchFilter, context: Context) => {
  try {
    const productService = new ProductService();
    return await productService.findBySportId(authorizationParams, sportId, searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const findSportByIdLocation = async (authorizationParams: Authorization,
    productId: number, locationId: number, searchFilter: SearchFilter, context: Context) => {
  try {
    const productService = new ProductService();
    return await productService.findSportByIdLocation(authorizationParams, productId, locationId, searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};
export const findById = async (authorizationParams: Authorization, id: number, context: Context) => {
  try {
    const productService = new ProductService();
    return await productService.findById(authorizationParams, id);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const findByIdSchedules = async (productId: number,
    searchFilter: SearchFilterBooking, context: Context) => {
  try {
    const productService = new ProductService();
    return await productService.findByIdSchedules(productId, searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const update = async (authorizationParams: Authorization, body: Product, context: Context) => {
  try {
    const productService = new ProductService();
    return await productService.update(authorizationParams, body);
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
