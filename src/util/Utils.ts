require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {APIGatewayProxyResult, Context} from 'aws-lambda';
import {RequestOptions} from 'https';
import {BuildOptions, Model} from 'sequelize/types';
import {readFileSync} from 'fs';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
// import Ajv from 'ajv';
// const ajv = new Ajv({allErrors: true});

export const createResponse = (status: number, body: any): APIGatewayProxyResult => {
  try {
    if (body.statusCode) {
      status = parseInt(body.statusCode);
      delete body.statusCode;
    };
    const headers: HeadersInit = {
      'Access-Control-Allow-Origin': '*',
    };
    const response: APIGatewayProxyResult = {
      body: JSON.stringify(body),
      headers: headers,
      statusCode: status,
    };
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createResponseLambda = (status: number, body: any): APIGatewayProxyResult => {
  try {
    if (body.statusCode) {
      status = parseInt(body.statusCode);
      delete body.statusCode;
    };
    const headers: HeadersInit = {
      'Access-Control-Allow-Origin': '*',
    };
    const response: APIGatewayProxyResult = {
      body: body,
      headers: headers,
      statusCode: status,
    };
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createLogContext = (context: Context, message: string, code:number|null=null) => {
  if (code===null) {
    return {
      message: message,
      function: context.functionName,
      request: context.logStreamName,
    };
  } else {
    return {
      code: code,
      message: message,
      function: context.functionName,
      request: context.logStreamName,
    };
  }
};


/**
 * s
 * @param {string} host
 * @param {string} path
 * @param {MethodEnum} method
 * @param {string} headers
 * @return {RequestOptions}
 */
export const getOptions = (host?: string, path?: string, method?: any, headers?: any): RequestOptions => {
  return {
    host: host,
    path: path,
    method: method,
    headers: headers,
    port: 443,
  };
};

export enum MethodEnum{
  POST = 'POST',
  GET = 'GET',
};

/**
 * s
 * @param {string} str
 * @return {string} string
 */
export const removeAccents = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
};

export const readTemplate = () => {
  try {
    return readFileSync(
        'src/templates/order-email-template.html', 'utf8');
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const readTemplatePayphone = () => {
  try {
    return readFileSync(
        'src/templates/order-email-template-payphone.html', 'utf8');
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export type ModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): Model;
}

export interface Common {
  id?: string;
  isActive: boolean;
  name: string;
}
export interface Response {
  statusCode: number;
  body?: Record<string, string>
};
export interface File {
  file: Buffer;
  name: string;
}
export interface FileS3 {
  Location: string;
}
export interface Authorization {
  username: string,
  group: string,
  email: string,
}
/**
 * getAuthorization
 * @param {authorization} authorization
 * @return {authorization}
 */
export const getAuthorization = (authorization: string) => {
  try {
    const decoded: any = jwt_decode(authorization);
    return <Authorization>{
      username: decoded['cognito:username'],
      group: decoded['cognito:groups'][0],
      email: decoded.email,
    };
  } catch (error: any) {
    error.statusCode = 401;
    console.error(error);
    throw error;
  }
};

/**
 * Format error responses
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
export const ajvErrorResponse = (schemaErrors: any) => {
  const errors = schemaErrors.map((error: any) => {
    return {
      path: error.instancePath,
      message: error.message,
      type: error.params.type,
    };
  });
  return JSON.stringify({
    status: 'failed',
    errors: errors,
  });
};


export const validAJV = (businessSchema: any, requestBody: any) => {
  try {
    const jsonResponseHeaders = {
      'Content-Type': 'application/json',
    };
    const valid = true; // || ajv.validate(businessSchema, requestBody);
    // console.log(ajv.errors);
    // if (!valid) {
    //   console.error('Validation Failed');
    //   return {
    //     statusCode: 400,
    //     headers: jsonResponseHeaders,
    //     body: ajvErrorResponse(ajv.errors),
    //   };
    // }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSearchFilter = (page?: string, limit?:string, filter?:string, sort?:string, isAsc?:string,
    startDate?:string, endDate?:string, businessId?:string) => {
  return {
    page: parseInt(page!),
    limit: parseInt(limit!),
    filter: filter === undefined? null: filter,
    sort: sort === undefined? null: sort,
    isAsc: isAsc === 'true'? true: isAsc === 'false'? false: null,
    startDate: startDate === undefined? null: startDate,
    endDate: endDate === undefined? null: endDate,
    businessId: parseInt(businessId!),
  };
};

export const getSearchFilterDashboard = (startDate?:string, endDate?:string) => {
  return {
    startDate: startDate === undefined? null: startDate,
    endDate: endDate === undefined? null: endDate,
  };
};
/**
 * 5
 * @param {string} value
 * @param {string} length
 * @return {string} g
 */
export const addPadLeft = (value: string, length: number): string => {
  return value.toString().length < length ? addPadLeft('0' + value, length) : value;
};

export const getHourFromTime = (timeAsString:string) => {
  return parseInt(timeAsString.split(':')[0]);
};
