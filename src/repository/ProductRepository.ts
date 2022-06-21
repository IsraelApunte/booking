import {CommonRepository} from './CommonRepository';
import {SearchFilter} from '../dto/SearchFilter';
import {SearchFilterBooking} from '../dto/SearchFilterBooking';
import {S3Request} from '../schemas/S3Request';
import {invokeLambda} from './LambdaRepository';
import {LambdaRequest} from '../schemas/LambdaRequest';
import {Product} from '../util/Database';
import {saveImages} from '../util/S3Service';
const PRODUCT_FOLDER_NAME = 'product';
const ENTITY_NAME = 'product';
/**
 * s
 */
export class ProductRepository extends CommonRepository {
  /**
   * s
   * @param {object} object
   * @return {response} response
   */
  async create(object: Product): Promise<Product> {
    let response;
    try {
      const galleries = object.galleries;
      if (galleries.length > 0) {
        for (const element of galleries) {
          // const imagesLocation = await saveImages(new Date().getTime(), [element.image], 'products');
          const image = element.image;
          if (image !== null && image.includes('base64')) {
            const s3Request: S3Request = {
              name: new Date().getTime().toString(),
              image: image,
              folderName: PRODUCT_FOLDER_NAME,
              bucketName: process.env.BUCKET_PUBLIC_NAME!,
            };
            const result = await saveImages(s3Request);
            element.image = result;
          }
        }
        object.galleries = galleries;
        if (process.env.IS_OFFLINE == 'true') {
          console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
        } else {
          const lambdaRequest: LambdaRequest = {
            entityName: ENTITY_NAME,
            body: object,
            operation: 'create',
          };
          const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
              JSON.stringify(lambdaRequest));
          if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
            throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
          }
          response = invokeLambdaResp.body;
        }
      }
      return <Product>response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
* s
* @param {number} id
* @return {response} response
*/
  async getOne(id: number) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {id},
          operation: 'getOne',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        result = invokeLambdaResp.body;
      }
      if (!result) {
        result = {message: `Document ${id} Not Found.`, statusCode: 404};
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
* s
* @param {number} id
* @param {SearchFilter} searchFilter
* @return {response} response
*/
  async getOneSchedules(id: number, searchFilter: SearchFilterBooking) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {id, searchFilter},
          operation: 'getOneSchedules',
        };
        console.log(JSON.stringify(lambdaRequest));
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {id, searchFilter},
          operation: 'getOneSchedules',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        result = invokeLambdaResp.body;
      }
      if (!result) {
        result = {message: `Document ${id} Not Found.`, statusCode: 404};
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
* s
* @param {object} object
* @return {response} response
*/
  async update(object: Product) {
    let result;
    try {
      const galleries = object.galleries;
      if (galleries.length > 0) {
        for (const element of galleries) {
          element.productId = object.id;
          // const imagesLocation = await saveImages(new Date().getTime(), [gallery.image], 'products');
          const image = element.image;
          if (image !== null && image.includes('base64')) {
            const s3Request: S3Request = {
              name: new Date().getTime().toString(),
              image: element.image,
              folderName: PRODUCT_FOLDER_NAME,
              bucketName: process.env.BUCKET_PUBLIC_NAME!,
            };
            const result = await saveImages(s3Request);
            element.image = result;
          }
        }
        object.galleries = galleries;
        if (process.env.IS_OFFLINE == 'true') {
          console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
        } else {
          const lambdaRequest: LambdaRequest = {
            entityName: ENTITY_NAME,
            body: object,
            operation: 'update',
          };
          const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
              JSON.stringify(lambdaRequest));
          if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
            throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
          }
          result = invokeLambdaResp.body;
        }
      }
      result = !result ?
        {message: 'Document can\'t be updated.', statusCode: 500} :
        {message: 'Document updated.'};
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * s
   * @param {SearchFilter} searchFilter
   * @return {number} sportId
   */
  async findAllByPaginates(searchFilter: SearchFilter) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {searchFilter},
          operation: 'findAllByPaginates',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        result = invokeLambdaResp.body;
      }
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  /**
   * s
   * @param {string} emailBusiness
   * @param {SearchFilter} searchFilter
   * @return {number} sportId
   */
  async findAllByBusinessPaginates(emailBusiness: string, searchFilter: SearchFilter) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {email: emailBusiness, searchFilter},
          operation: 'findAllByBusinessPaginates',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        result = invokeLambdaResp.body;
      }
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  /**
   * s
   * @param {string} sportId
   * @param {SearchFilter} searchFilter
   * @return {string} result
   */
  async findAllBySportIdPaginates(sportId: number | null, searchFilter: SearchFilter) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {id: sportId, searchFilter},
          operation: 'findAllBySportIdPaginates',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        result = invokeLambdaResp.body;
      }
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  /**
   * s
   * @param {string} emailBusiness
   * @param {string} sportId
   * @param {SearchFilter} searchFilter
   * @return {string} result
   */
  async findAllBySportIdAndBusinessPaginates(emailBusiness: string,
      sportId: number | null, searchFilter: SearchFilter) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {email: emailBusiness, id: sportId, searchFilter},
          operation: 'findAllBySportIdAndBusinessPaginates',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        result = invokeLambdaResp.body;
      }
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  /**
   * s
   * @param {string} productId
   * @param {string} locationId
   * @param {SearchFilter} searchFilter
   * @return {string} result
   */
  async findSportByIdLocationPaginates(productId:number|null, locationId: number | null, searchFilter: SearchFilter) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {productId: productId, locationId: locationId, searchFilter},
          operation: 'findSportByIdLocationPaginates',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        result = invokeLambdaResp.body;
      }
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  /**
   * s
   * @param {string} emailBusiness
   * @param {string} productId
   * @param {string} locationId
   * @param {SearchFilter} searchFilter
   * @return {string} result
   */
  async findSportByIdLocationBusinessPaginates(emailBusiness: string, productId:number|null,
      locationId: number | null, searchFilter: SearchFilter) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {email: emailBusiness, productId: productId, locationId: locationId, searchFilter},
          operation: 'findSportByIdLocationBusinessPaginates',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        result = invokeLambdaResp.body;
      }
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  /**
   * s
   * @param {string} locationId
   * @param {SearchFilter} searchFilter
   * @return {string} result
   */
  async findAllByLocationIdPaginates(locationId: number | null, searchFilter: SearchFilter) {
    let result;
    try {
      if (process.env.IS_OFFLINE == 'true') {
        console.info('IS_OFFLINE' + process.env.IS_OFFLINE);
      } else {
        const lambdaRequest: LambdaRequest = {
          entityName: ENTITY_NAME,
          body: {id: locationId, searchFilter},
          operation: 'findAllByLocationIdPaginates',
        };
        const invokeLambdaResp = await invokeLambda(process.env.LAMBDA_POSTGRES!,
            JSON.stringify(lambdaRequest));
        if (typeof invokeLambdaResp !== 'undefined' && invokeLambdaResp.statusCode !== 200) {
          throw new Error(`${JSON.stringify(invokeLambdaResp)}`);
        }
        result = invokeLambdaResp.body;
      }
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
