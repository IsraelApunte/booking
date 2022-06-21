import * as AWS from 'aws-sdk';
import {InvocationRequest} from 'aws-sdk/clients/lambda';

export const invokeLambda = async (functionName: string, requestHandler: string): Promise<Record<string, unknown>> => {
  try {
    const params: InvocationRequest = {
      FunctionName: functionName,
      Payload: requestHandler,
    };
    const lambda = new AWS.Lambda({region: 'us-east-1'});
    console.log('request invoke' + JSON.stringify(params));
    const data = await lambda.invoke(params).promise();
    console.log('response invoke' + JSON.stringify(data));
    if (data.FunctionError) {
      const error = JSON.parse((<string>data.Payload)).errorMessage;
      throw new Error(error);
    } else {
      const response = JSON.parse(<string>data.Payload);
      return response;
    }
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
