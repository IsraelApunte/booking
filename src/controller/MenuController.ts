require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {APIGatewayProxyEvent, Context, Handler} from 'aws-lambda';
import {MenuService} from '../service/MenuService';
import {Authorization, createLogContext, createResponse, getAuthorization} from '../util/Utils';

export const initEvent: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let result;
  try {
    const {ROLE_USER_ALPELOTEO, ROLE_USER_BUSINESS} = process.env;
    const authorizationParams: Authorization = getAuthorization(event.headers.Authorization||
      event.headers.authorization!);
    if (authorizationParams.group === ROLE_USER_ALPELOTEO ||
        authorizationParams.group === ROLE_USER_BUSINESS) {
      result = await getMenuByRole(authorizationParams, context);
      return createResponse(200, result);
    } else {
      return createResponse(401, {message: 'Unauthorized'});
    }
  } catch (error: any) {
    console.error(`Error controlado ${error}`);
    return createResponse(error.statusCode||500, error.context||{message: error.message});
  }
};

export const getMenuByRole = async (authorizationParams: Authorization, context: Context) => {
  try {
    const menuService = new MenuService();
    return await menuService.getMenuRole(authorizationParams);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};


