import {SearchFilter} from '../dto/SearchFilter';
import {SearchFilterBooking} from '../dto/SearchFilterBooking';
import {ProductPublicRepository} from '../repository/ProductPublicRepository';

/**
 * Administration Product
 */
export class ProductPublicService {
  /**
   * Find all with pagination
   * @param {number} locationId
   * @param {SearchFilter} searchFilter
   */
  async findByLocationId(
      locationId: number, searchFilter: SearchFilter): Promise<any> {
    try {
      const productRepository = new ProductPublicRepository();
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
      const productRepository = new ProductPublicRepository();
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
      const productRepository = new ProductPublicRepository();
      return await productRepository.getOneSchedules(id, searchFilter);
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
  async findSportByIdLocation( productId: number, locationId: number, searchFilter: SearchFilter): Promise<any> {
    try {
      const productRepository = new ProductPublicRepository();
      return await productRepository.findSportByIdLocationPaginates(productId, locationId, searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
}
