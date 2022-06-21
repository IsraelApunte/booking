require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {APIGatewayProxyEvent, Context, Handler} from 'aws-lambda';
import {SearchFilter} from '../dto/SearchFilter';
import {BankAccountService} from '../service/BankAccountService';
import {Authorization, createLogContext, createResponse, getAuthorization, getSearchFilter} from '../util/Utils';

export const initEvent: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let result;
  try {
    const {ROLE_USER_CUSTOMER} = process.env;
    const authorizationParams: Authorization = getAuthorization(event.headers.Authorization||
      event.headers.authorization!);
    if (authorizationParams.group === ROLE_USER_CUSTOMER) {
      const {httpMethod, queryStringParameters} = event;
      if (httpMethod === 'GET' && queryStringParameters !== null) {
        const {page, limit, filter, sort, isAsc} = queryStringParameters!;
        const filters = getSearchFilter(page, limit, filter, sort, isAsc);
        result = await findAlpeloteo(authorizationParams, filters, context);
        return createResponse(200, result);
      }
    } else {
      return createResponse(401, {message: 'Unauthorized'});
    }
  } catch (error: any) {
    console.error(`Error controlado ${error}`);
    return createResponse(error.statusCode || 500, error.context || {message: error.message});
  }
};


export const findAlpeloteo = async (authorizationParams: Authorization,
    searchFilter: SearchFilter, context: Context) => {
  try {
    const bankAccountService = new BankAccountService();
    return await bankAccountService.findAlpeloteo(authorizationParams, searchFilter);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};
