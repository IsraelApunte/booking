require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {APIGatewayProxyEvent, Context, Handler} from 'aws-lambda';
import {SearchFilter} from '../dto/SearchFilter';
import {BookingService} from '../service/BookingService';
import {Booking} from '../util/Database';
import {
  Authorization, createLogContext, createResponse, getAuthorization,
  getSearchFilter, validAJV,
} from '../util/Utils';
import * as bookingSchema from '../validation/booking-schema.json';

export const initEvent: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let result;
  try {
    const {ROLE_USER_BUSINESS, ROLE_USER_CUSTOMER, ROLE_USER_ALPELOTEO} = process.env;
    const authorizationParams: Authorization = getAuthorization(event.headers.Authorization ||
      event.headers.authorization!);
    if (authorizationParams.group === ROLE_USER_BUSINESS ||
      authorizationParams.group === ROLE_USER_CUSTOMER ||
      authorizationParams.group === ROLE_USER_ALPELOTEO) {
      const {httpMethod} = event;
      let requestBody = null;
      if (httpMethod === 'POST' || httpMethod === 'PUT') {
        const {body} = event;
        requestBody = JSON.parse(body!);
        validAJV(bookingSchema, requestBody);
        if (httpMethod === 'POST') {
          result = await create(authorizationParams, requestBody, context);
        }
        if (httpMethod === 'PUT') {
          const {path} = event;
          if (!path.includes('payments') && !path.includes('reschedules')) {
            result = await update(authorizationParams, requestBody, context);
          }
          if (path.includes('payments') && !path.includes('reschedules')) {
            result = await updatePayments(authorizationParams, requestBody, context);
          }
          if (!path.includes('payments') && path.includes('reschedules')) {
            result = await updateReschedules(authorizationParams, requestBody, context);
          }
        }
      }
      if (httpMethod === 'GET' || httpMethod === 'DELETE') {
        const {pathParameters, queryStringParameters, path} = event;
        if (httpMethod === 'GET' && pathParameters !== null && !path.includes('businesses') &&
          !path.includes('payments')) {
          const {id} = pathParameters!;
          result = await findById(authorizationParams, parseInt(id!), context);
        }
        if (httpMethod === 'GET' && queryStringParameters !== null && !path.includes('businesses') &&
          !path.includes('payments')) {
          const {page, limit, filter, sort, isAsc} = queryStringParameters!;
          const filters = getSearchFilter(page, limit, filter, sort, isAsc);
          result = await find(authorizationParams, filters, context);
        }
        if (httpMethod === 'GET' && queryStringParameters !== null && path.includes('businesses') &&
          !path.includes('payments')) {
          const {page, limit, filter, sort, isAsc, startDate, endDate} = queryStringParameters!;
          const filters = getSearchFilter(page, limit, filter, sort, isAsc, startDate, endDate);
          const {id} = pathParameters!;
          result = await findByIdBusiness(authorizationParams, parseInt(id!), filters, context);
        }
        if (httpMethod === 'GET' && queryStringParameters !== null && !path.includes('businesses') &&
          path.includes('payments')) {
          const {page, limit, filter, sort, isAsc, startDate, endDate, businessId} = queryStringParameters!;
          const filters = getSearchFilter(page, limit, filter, sort, isAsc, startDate, endDate, businessId);
          result = await findAllPaymentsByPaginates(authorizationParams, filters, context);
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
    console.error(`Error controlado ${JSON.stringify(error)}`);
    return createResponse(error.statusCode! || 500, error.context || {message: error.message});
  }
};


export const create = async (authorizationParams: Authorization, body: Booking, context: Context) => {
  try {
    const bookingService = new BookingService();
    return await bookingService.create(authorizationParams, body);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const find = async (authorizationParams: Authorization, searchFilter: SearchFilter, context: Context) => {
  try {
    const bookingService = new BookingService();
    return await bookingService.find(authorizationParams, searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};
export const findAllPaymentsByPaginates = async (authorizationParams: Authorization,
    searchFilter: SearchFilter, context: Context) => {
  try {
    const bookingService = new BookingService();
    return await bookingService.findAllPaymentsByPaginates(authorizationParams, searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};
export const findByIdBusiness = async (authorizationParams: Authorization, id: number, searchFilter: SearchFilter,
    context: Context) => {
  try {
    const bookingService = new BookingService();
    return await bookingService.findByIdBusiness(authorizationParams, id, searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const findById = async (authorizationParams: Authorization, id: number, context: Context) => {
  try {
    const bookingService = new BookingService();
    return await bookingService.findById(authorizationParams, id);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const update = async (authorizationParams: Authorization, body: Booking, context: Context) => {
  try {
    const bookingService = new BookingService();
    return await bookingService.update(authorizationParams, body);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const updatePayments = async (authorizationParams: Authorization, body: Booking[], context: Context) => {
  try {
    const bookingService = new BookingService();
    return await bookingService.updatePayments(authorizationParams, body);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const updateReschedules = async (authorizationParams: Authorization, body: Booking, context: Context) => {
  try {
    const bookingService = new BookingService();
    return await bookingService.updateReschedules(authorizationParams, body);
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
