import {Context} from 'aws-lambda';
import {create} from '../src/controller/AgentController';

const ENTITY = 'Person';

describe(`${ENTITY}`, () => {
  it('create', async () => {
    process.env.IS_OFFLINE = 'true';
    const agent = {
      'id': null,
      'businessName': 'ADRIANA TOAPANTA',
      'identificationTypeId': 12,
      'identificationNumber': '0604113010',
      'birthday': '1989-09-20',
      'mobile': '541356884',
      'phone': '31253534',
      'email': 'adry@gmail.com',
      'accountTypeId': 22,
      'accountNumber': '44151251541',
      'isActive': true,
      'bankAccounts': [
        {
          'accountTypeId': null,
          'businessId': null,
          'agentId': null,
          'bank': 'PICHINCHA',
          'accountNumber': '32103548478',
          'email': 'pichincha@gmail.com',
          'mobile': '265998936236',
          'businessName': 'BUSINESS1',
          'isActive': true,
        },
      ],
    };
    const context: Context = {
      functionName: 'test',
      callbackWaitsForEmptyEventLoop: false,
      functionVersion: '1.0',
      invokedFunctionArn: '',
      memoryLimitInMB: '',
      awsRequestId: '',
      logGroupName: '',
      logStreamName: '',
      getRemainingTimeInMillis: function(): number {
        throw new Error('Function not implemented.');
      },
      done: function(error?: Error, result?: any): void {
        throw new Error('Function not implemented.');
      },
      fail: function(error: string | Error): void {
        throw new Error('Function not implemented.');
      },
      succeed: function(messageOrObject: any): void {
        throw new Error('Function not implemented.');
      },
    };
    await create(agent, context);
    return expect(true).toEqual(true);
  });
//   it('get person by id', async () => {
//     const result = await crearPoliza(new Person('Byron', 'Guamanzara', 11, '1719363887001'));
//     const rest = {'message': 'Document created.'};
//     return expect(result).toStrictEqual(rest);
//   });
//   it('get all person', async () => {
//     const result = await crearPoliza(new Person('Byron', 'Guamanzara', 11, '1719363887001'));
//     const rest = {'message': 'Document created.'};
//     return expect(result).toStrictEqual(rest);
//   });
});
