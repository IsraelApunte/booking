require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {APIGatewayProxyEvent, Context, Handler} from 'aws-lambda';
import {SearchFilterDashboard} from '../dto/SearchFilterDashboard';
import {DashboardService} from '../service/DashboardService';
import {Authorization, createLogContext, createResponse, getAuthorization,
  getSearchFilterDashboard} from '../util/Utils';


export const initEvent: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let result;
  try {
    const {ROLE_USER_BUSINESS, ROLE_USER_ALPELOTEO} = process.env;
    const authorizationParams: Authorization = getAuthorization(event.headers.Authorization||
      event.headers.authorization!);
    if (authorizationParams.group === ROLE_USER_ALPELOTEO ||
        authorizationParams.group === ROLE_USER_BUSINESS) {
      const {queryStringParameters} = event;
      const {startDate, endDate} = queryStringParameters!;
      const filters= getSearchFilterDashboard(startDate, endDate);
      result = await getQuantityBooking(authorizationParams, filters, context);
      return createResponse(200, result);
    } else {
      return createResponse(401, {message: 'Unauthorized'});
    }
  } catch (error: any) {
    console.error(`Error controlado ${error}`);
    return createResponse(error.statusCode||500, error.context||{message: error.message});
  }
};

export const getQuantityBooking = async (authorizationParams: Authorization,
    searchFilter: SearchFilterDashboard, context: Context) => {
  try {
    const dashboardService = new DashboardService();
    return await dashboardService.getQuantityBooking(authorizationParams, searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};


