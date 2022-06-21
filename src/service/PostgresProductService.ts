import {SearchFilter} from '../dto/SearchFilter';
import {Product} from '../util/Database';
import {SearchFilterBooking} from '../dto/SearchFilterBooking';
import {PostgresProductRepository} from '../repository/PostgresProductRepository';
import {IPostgresCommonService} from './interface/IPostgresCommonService';

/**
 * Administration Product
 */
export class PostgresProductService implements IPostgresCommonService<Product> {
  /**
   * Creation Product
   * @param {Product} entity
   */
  async create(entity: Product): Promise<Product | null> {
    try {
      const productRepository = new PostgresProductRepository();
      return await productRepository.create(entity);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find all with pagination
   * @param {SearchFilter} searchFilter
   */
  async find(searchFilter: SearchFilter): Promise<any> {
    try {
      const productRepository = new PostgresProductRepository();
      return await productRepository.findAllByPaginates(searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find all with pagination
   * @param {string} emailBusiness
   * @param {SearchFilter} searchFilter
   */
  async findAllByBusinessPaginates(emailBusiness: string, searchFilter: SearchFilter): Promise<any> {
    try {
      const productRepository = new PostgresProductRepository();
      return await productRepository.findAllByBusinessPaginates(emailBusiness, searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find all with pagination
   * @param {number} sportId
   * @param {SearchFilter} searchFilter
   */
  async findAllBySportIdPaginates(sportId: number, searchFilter: SearchFilter): Promise<any> {
    try {
      const productRepository = new PostgresProductRepository();
      return await productRepository.findAllBySportIdPaginates(sportId, searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find all with pagination
   * @param {string} emailBusiness
   * @param {number} sportId
   * @param {SearchFilter} searchFilter
   */
  async findAllBySportIdAndBusinessPaginates(emailBusiness: string,
      sportId: number, searchFilter: SearchFilter): Promise<any> {
    try {
      const productRepository = new PostgresProductRepository();
      return await productRepository.findAllBySportIdAndBusinessPaginates(emailBusiness, sportId, searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find all with pagination
   * @param {number} productId
   * @param {number} locationId
   * @param {SearchFilter} searchFilter
   */
  async findSportByIdLocationPaginates(productId:number, locationId: number, searchFilter: SearchFilter): Promise<any> {
    try {
      const productRepository = new PostgresProductRepository();
      return await productRepository.findSportByIdLocationPaginates(productId, locationId, searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find all with pagination
   * @param {string} emailBusiness
   * @param {number} productId
   * @param {number} locationId
   * @param {SearchFilter} searchFilter
   */
  async findSportByIdLocationBusinessPaginates(emailBusiness: string,
      productId:number, locationId: number, searchFilter: SearchFilter): Promise<any> {
    try {
      const productRepository = new PostgresProductRepository();
      return await productRepository.findSportByIdLocationBusinessPaginates(emailBusiness, productId,
          locationId, searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find all with pagination
   * @param {number} locationId
   * @param {SearchFilter} searchFilter
   */
  async findAllByLocationIdPaginates(locationId: number,
      searchFilter: SearchFilter): Promise<any> {
    try {
      const productRepository = new PostgresProductRepository();
      return await productRepository.findAllByLocationIdPaginates(locationId, searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find by id
   * @param {number} id
   */
  async findById(id: number): Promise<any> {
    try {
      const productRepository = new PostgresProductRepository();
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
  async getOneSchedules(id: number, searchFilter: SearchFilterBooking): Promise<any> {
    try {
      const productRepository = new PostgresProductRepository();
      return await productRepository.getOneSchedules(id, searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Update Product
   * @param {Product} entity
   */
  async update(entity: Product) {
    try {
      const productRepository = new PostgresProductRepository();
      return await productRepository.update(entity);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Delete
   * @param {number} id
   */
  async remove(id: number) {
    throw new Error('Method not implemented.');
  }
}
