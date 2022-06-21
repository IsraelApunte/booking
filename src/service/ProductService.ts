import {SearchFilter} from '../dto/SearchFilter';
import {Product} from '../util/Database';
import {ProductRepository} from '../repository/ProductRepository';
import {ICommonService} from './interface/ICommonService';
import {SearchFilterBooking} from '../dto/SearchFilterBooking';
import {Authorization} from '../util/Utils';

/**
 * Administration Product
 */
export class ProductService implements ICommonService<Product> {
  /**
   * Creation Product
   * @param {authorizationParams} authorizationParams
   * @param {Product} entity
   */
  async create(authorizationParams: Authorization, entity: Product): Promise<Product> {
    try {
      const productRepository = new ProductRepository();
      return await productRepository.create(entity);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find all with pagination
   * @param {authorizationParams} authorizationParams
   * @param {SearchFilter} searchFilter
   */
  async find(authorizationParams: Authorization, searchFilter: SearchFilter): Promise<any> {
    try {
      const {ROLE_USER_ALPELOTEO, ROLE_USER_BUSINESS} = process.env;
      const productRepository = new ProductRepository();
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await productRepository.findAllByPaginates(searchFilter);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await productRepository.findAllByBusinessPaginates(authorizationParams.email, searchFilter);
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find all with pagination
   * @param {authorizationParams} authorizationParams
   * @param {number} sportId
   * @param {SearchFilter} searchFilter
   */
  async findBySportId(authorizationParams: Authorization, sportId: number, searchFilter: SearchFilter): Promise<any> {
    try {
      const {ROLE_USER_ALPELOTEO, ROLE_USER_BUSINESS} = process.env;
      const productRepository = new ProductRepository();
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await productRepository.findAllBySportIdPaginates(sportId, searchFilter);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await productRepository.findAllBySportIdAndBusinessPaginates(authorizationParams.email,
            sportId, searchFilter);
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find all with pagination
   * @param {authorizationParams} authorizationParams
   * @param {number} productId
   * @param {number} locationId
   * @param {SearchFilter} searchFilter
   */
  async findSportByIdLocation(authorizationParams: Authorization, productId: number, locationId: number,
      searchFilter: SearchFilter): Promise<any> {
    try {
      const {ROLE_USER_ALPELOTEO, ROLE_USER_BUSINESS} = process.env;
      const productRepository = new ProductRepository();
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await productRepository.findSportByIdLocationPaginates(productId, locationId, searchFilter);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await productRepository.findSportByIdLocationBusinessPaginates(authorizationParams.email,
            productId, locationId, searchFilter);
      }
      console.log('************', productRepository.findSportByIdLocationPaginates);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find all with pagination
   * @param {authorizationParams} authorizationParams
   * @param {number} locationId
   * @param {SearchFilter} searchFilter
   */
  async findByLocationId(authorizationParams: Authorization|null,
      locationId: number, searchFilter: SearchFilter): Promise<any> {
    try {
      const productRepository = new ProductRepository();
      return await productRepository.findAllByLocationIdPaginates(locationId, searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find by id
   * @param {authorizationParams} authorizationParams
   * @param {number} id
   */
  async findById(authorizationParams: Authorization|null, id: number): Promise<any> {
    try {
      const productRepository = new ProductRepository();
      return await productRepository.getOne(id);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find by id
   * @param {number} id
   * @param {SearchFilterBooking} searchFilter
   */
  async findByIdSchedules( id: number, searchFilter: SearchFilterBooking): Promise<any> {
    try {
      const productRepository = new ProductRepository();
      return await productRepository.getOneSchedules(id, searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Update Product
   * @param {authorizationParams} authorizationParams
   * @param {Product} entity
   */
  async update(authorizationParams: Authorization, entity: Product) {
    try {
      const productRepository = new ProductRepository();
      return await productRepository.update(entity);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Delete
   * @param {authorizationParams} authorizationParams
   * @param {number} id
   */
  async remove(authorizationParams: Authorization, id: number) {
    throw new Error('Method not implemented.');
  }
}
