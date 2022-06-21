require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {Context, Handler} from 'aws-lambda';
import {CognitoService} from '../service/CognitoService';
import {createLogContext, createResponse} from '../util/Utils';
import * as AWS from 'aws-sdk';
AWS.config.update({region: process.env.REGION});

export const initEvent: Handler = async (event: any, context: Context) => {
  let result;
  try {
    console.log(JSON.stringify(event));
    const user = {id: null, username: event.userName, email: event.email, roleId: 3};
    result = await create(user, context);
    console.log(JSON.stringify(result));
    return createResponse(200, result);
  } catch (error: any) {
    console.error(`Error controlado ${error}`);
    return createResponse(error.statusCode || 500, error.context || {message: error.message});
  }
};

export const create = async (body: any, context: Context) => {
  try {
    const cognitoService = new CognitoService();
    return await cognitoService.create(body);
  } catch (error: any) {
    console.error('----->', error);
    error.context = createLogContext(context, error.message);
    throw error;
  }
};

