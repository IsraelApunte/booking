require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {APIGatewayProxyEvent, Context, Handler} from 'aws-lambda';
import {SearchFilter} from '../dto/SearchFilter';
import {SearchFilterBooking} from '../dto/SearchFilterBooking';
import {ProductPublicService} from '../service/ProductPublicService';
import {createLogContext, createResponse, getSearchFilter} from '../util/Utils';

export const initEvent: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let result;
  try {
    const {httpMethod} = event;
    if (httpMethod === 'GET') {
      const {pathParameters, queryStringParameters, path} = event;
      const {id} = pathParameters!;
      if (queryStringParameters !== null && path.includes('locations') && !path.includes('schedules/bookings/public')) {
        const {page, limit, filter, sort, isAsc} = queryStringParameters!;
        const filters = getSearchFilter(page, limit, filter, sort, isAsc);
        result = await findByLocationId(parseInt(id!), filters, context);
      } else {
        result = await findById(parseInt(id!), context);
      }
      if (httpMethod === 'GET' && pathParameters !== null && path.includes('schedules/bookings/public')) {
        const {id} = pathParameters!;
        const {queryStringParameters} = event;
        const {bookingDate} = queryStringParameters!;
        const filter: SearchFilterBooking= {
          bookingDate: bookingDate === undefined? null: bookingDate,
        };
        result = await findByIdSchedules(parseInt(id!), filter, context);
      }
      if (httpMethod === 'GET' && pathParameters !== null && path.includes('sports') && path.includes('locations') &&
          !path.includes('schedules/bookings/public')) {
        const {id, locationId} = pathParameters!;
        const {page, limit, filter, sort, isAsc} = queryStringParameters!;
        const filters = getSearchFilter(page, limit, filter, sort, isAsc);
        result = await findSportByIdLocation( parseInt(id!), parseInt(locationId!), filters, context);
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


export const findById = async (id: number, context: Context) => {
  try {
    const productService = new ProductPublicService();
    return await productService.findById(id);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const findByLocationId = async (locationId: number, searchFilter: SearchFilter, context: Context) => {
  try {
    const productService = new ProductPublicService();
    return await productService.findByLocationId(locationId, searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const findByIdSchedules = async (productId: number,
    searchFilter: SearchFilterBooking, context: Context) => {
  try {
    const productService = new ProductPublicService();
    return await productService.findByIdSchedules(productId, searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

export const findSportByIdLocation = async (productId: number, locationId: number,
    searchFilter: SearchFilter, context: Context) => {
  try {
    const productService = new ProductPublicService();
    return await productService.findSportByIdLocation( productId, locationId, searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};
