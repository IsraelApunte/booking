require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {APIGatewayProxyEvent, Context, Handler} from 'aws-lambda';
import {LambdaRequest} from '../schemas/LambdaRequest';
import {PostgresBannerService} from '../service/PostgresBannerService';
import {PostgresBookingService} from '../service/PostgresBookingService';
import {PostgresBusinessService} from '../service/PostgresBusinessService';
import {PostgresProductService} from '../service/PostgresProductService';
import {PostgresPaymentVerifyService} from '../service/PostgresPaymentVerifyService';
import {Banner, Booking, Business, Product} from '../util/Database';
import {createLogContext, createResponseLambda} from '../util/Utils';

export const initEvent: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    console.log(JSON.stringify(event));
    const lambdaRequest = event as unknown as LambdaRequest;
    const entityName = lambdaRequest.entityName;
    const objectEntity = lambdaRequest.body;
    const {id, productId, locationId, searchFilter, email, object} = objectEntity;
    const operation = lambdaRequest.operation;
    let result;
    switch (entityName) {
      case 'banner':
        switch (operation) {
          case 'create':
            const postgresBannerService = new PostgresBannerService();
            result = await postgresBannerService.create(<Banner>objectEntity);
            break;
          case 'findAllByPaginates':
            const postgresBannerFindService = new PostgresBannerService();
            result = await postgresBannerFindService.find(searchFilter);
            break;
          case 'update':
            const postgresBannerUpdateService = new PostgresBannerService();
            result = await postgresBannerUpdateService.update(<Banner>objectEntity);
            break;
          default:
            throw new Error(JSON.stringify({statusCode: 500}));
        }
        break;
      case 'booking':
        switch (operation) {
          case 'create':
            const postgresBookingService = new PostgresBookingService();
            result = email === null || email === undefined ?
              await postgresBookingService.create(<Booking>object) :
              await postgresBookingService.createByBusiness(email, <Booking>object);
            break;
          case 'getOne':
            const postgresBookingGetOneService = new PostgresBookingService();
            result = await postgresBookingGetOneService.findById(id);
            break;
          case 'update':
            const postgresBookingUpdateService = new PostgresBookingService();
            result = await postgresBookingUpdateService.update(<Booking>objectEntity);
            break;
          case 'updatePayments':
            const postgresBookingUpdateService1 = new PostgresBookingService();
            result = await postgresBookingUpdateService1.updatePayments(<Booking[]>objectEntity);
            break;
          case 'updatePaymentsVerifyApproved':
            const postgresBookingUpdatePaymentService = new PostgresPaymentVerifyService();
            result = await postgresBookingUpdatePaymentService.updatePaymentsVerifyApproved(<number[]>objectEntity);
            break;
          case 'updatePaymentsVerifyCanceled':
            const postgresBookingUpdatePaymentService1 = new PostgresPaymentVerifyService();
            result = await postgresBookingUpdatePaymentService1.updatePaymentsVerifyCanceled(<number[]>objectEntity);
            break;
          case 'updateReschedules':
            const postgresBookingUpdateService2 = new PostgresBookingService();
            result = await postgresBookingUpdateService2.updateReschedules(<Booking>objectEntity);
            break;
          case 'findPaymentVerify':
            const postgresBookingFindPaymentVerify = new PostgresPaymentVerifyService();
            result = await postgresBookingFindPaymentVerify.findPaymentVerify();
            break;
          case 'findAllByPaginates':
            const postgresBookingFindService = new PostgresBookingService();
            result = await postgresBookingFindService.findAllByPaginates(null, searchFilter);
            break;
          case 'findAllPaymentsByPaginates':
            const postgresBookingFindService1 = new PostgresBookingService();
            result = await postgresBookingFindService1.findAllPaymentsByPaginates(searchFilter);
            break;
          case 'findAllByBusinessPaginates':
            const postgresBookingFindBusinessService = new PostgresBookingService();
            result = await postgresBookingFindBusinessService.findAllByBusinessPaginates(email, searchFilter);
            break;
          case 'findAllByCustomerPaginates':
            const postgresBookingFindCustomerService = new PostgresBookingService();
            result = await postgresBookingFindCustomerService.findAllByCustomerPaginates(email, searchFilter);
            break;
          case 'findByIdBusiness':
            const postgresBookingFindByIdBusiness= new PostgresBookingService();
            result = await postgresBookingFindByIdBusiness.findByIdBusiness(id, searchFilter);
            break;
          default:
            throw new Error(JSON.stringify({statusCode: 500}));
        }
        break;
      case 'business':
        switch (operation) {
          case 'create':
            try {
              const postgresBusinessService = new PostgresBusinessService();
              result = await postgresBusinessService.create(<Business>objectEntity);
            } catch (error: any) {
              console.error('----->', error);
              if (error.message.includes('23505')) {
                const duplicateObject = JSON.parse(error.message);
                error.context = createLogContext(context, duplicateObject.detail, duplicateObject.code);
              } else {
                error.context = createLogContext(context, error.message);
              }
              throw error;
            }
            break;
          case 'getOne':
            const postgresBusinessGetOneService = new PostgresBusinessService();
            result = await postgresBusinessGetOneService.getOne(id);
            break;
          case 'update':
            const postgresBusinessUpdateService = new PostgresBusinessService();
            result = await postgresBusinessUpdateService.update(<Business>objectEntity);
            break;
          case 'updateByBusiness':
            const postgresUpdateBusinessService = new PostgresBusinessService();
            result = await postgresUpdateBusinessService.updateByBusiness(email, <Business>object);
            break;
          case 'getOneByBusiness':
            const postgresGetOneBusinessService = new PostgresBusinessService();
            result = await postgresGetOneBusinessService.getOneByBusiness(email, id);
            break;
          case 'getOneByAlpeloteoProfile':
            const postgresGetOneAlpeloteoService = new PostgresBusinessService();
            result = await postgresGetOneAlpeloteoService.getOneByAlpeloteoProfile(email);
            break;
          case 'getOneByBusinessProfile':
            const postgresGetOneBusinessProfileService = new PostgresBusinessService();
            result = await postgresGetOneBusinessProfileService.getOneByBusinessProfile(email);
            break;
          case 'findAllByPaginates':
            const postgresBusinessFindService = new PostgresBusinessService();
            result = await postgresBusinessFindService.find(searchFilter);
            break;
          default:
            throw new Error(JSON.stringify({statusCode: 500}));
        }
        break;
      case 'product':
        switch (operation) {
          case 'create':
            const postgresProductService = new PostgresProductService();
            result = await postgresProductService.create(<Product>objectEntity);
            break;
          case 'getOne':
            const postgresProductGetOneService = new PostgresProductService();
            result = await postgresProductGetOneService.findById(id);
            break;
          case 'getOneSchedules':
            const postgresProductGetOneSchedulesService = new PostgresProductService();
            result = await postgresProductGetOneSchedulesService.getOneSchedules(id, searchFilter);
            break;
          case 'update':
            const postgresProductUpdateService = new PostgresProductService();
            result = await postgresProductUpdateService.update(<Product>objectEntity);
            break;
          case 'findAllByPaginates':
            const postgresProductFindService = new PostgresProductService();
            result = await postgresProductFindService.find(searchFilter);
            break;
          case 'findAllByBusinessPaginates':
            const postgresProductFindService1 = new PostgresProductService();
            result = await postgresProductFindService1.findAllByBusinessPaginates(email, searchFilter);
            break;
          case 'findAllBySportIdPaginates':
            const postgresProductFindSportService = new PostgresProductService();
            result = await postgresProductFindSportService.findAllBySportIdPaginates(id, searchFilter);
            break;
          case 'findAllBySportIdAndBusinessPaginates':
            const postgresProductFindSportService1 = new PostgresProductService();
            result = await postgresProductFindSportService1.findAllBySportIdAndBusinessPaginates(email,
                id, searchFilter);
            break;
          case 'findSportByIdLocationPaginates':
            const postgresProductFindSportLocationService = new PostgresProductService();
            result = await postgresProductFindSportLocationService.findSportByIdLocationPaginates(productId,
                locationId, searchFilter);
            break;
          case 'findSportByIdLocationBusinessPaginates':
            const postgresProductFindSportLocationBService = new PostgresProductService();
            result = await postgresProductFindSportLocationBService.findSportByIdLocationBusinessPaginates(email,
                productId, locationId, searchFilter);
            break;
          case 'findAllByLocationIdPaginates':
            const postgresProductFindLocationService = new PostgresProductService();
            result = await postgresProductFindLocationService.findAllByLocationIdPaginates(id, searchFilter);
            break;
        }
        break;
      default:
        throw new Error(JSON.stringify({statusCode: 500}));
    }
    return createResponseLambda(200, result);
  } catch (error: any) {
    console.error(`Error controlado ${error}`);
    return createResponseLambda(error.statusCode || 500, error.context || {message: error.message});
  }
};


