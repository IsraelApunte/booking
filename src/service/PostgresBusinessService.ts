import {SearchFilter} from '../dto/SearchFilter';
import {PostgresBusinessRepository} from '../repository/PostgresBusinessRepository';
import {Business} from '../util/Database';
import {IPostgresCommonService} from './interface/IPostgresCommonService';

/**
 * Administration business
 */
export class PostgresBusinessService implements IPostgresCommonService<Business> {
  /**
   * Creation business
   * @param {Business} entity
   */
  async create(entity: Business): Promise<Business | undefined> {
    try {
      const businessRepository = new PostgresBusinessRepository();
      return await businessRepository.create(entity);
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
      const businessRepository = new PostgresBusinessRepository();
      return await businessRepository.findAllByPaginates(searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find by id
   * @param {number} id
   */
  async getOne(id: number): Promise<any> {
    try {
      const businessRepository = new PostgresBusinessRepository();
      return await businessRepository.getOne(id);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find by id
   * @param {string} emailBusiness
   * @param {number} id
   */
  async getOneByBusiness(emailBusiness: string, id: number): Promise<any> {
    try {
      const businessRepository = new PostgresBusinessRepository();
      return await businessRepository.getOneByBusiness(emailBusiness, id);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find by profile
   * @param {string} email
   * @param {number} id
   */
  async getOneByAlpeloteoProfile(email: string): Promise<any> {
    try {
      const businessRepository = new PostgresBusinessRepository();
      return await businessRepository.getOneByAlpeloteoProfile(email);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find by profile
   * @param {string} emailBusiness
   * @param {number} id
   */
  async getOneByBusinessProfile(emailBusiness: string): Promise<any> {
    try {
      const businessRepository = new PostgresBusinessRepository();
      return await businessRepository.getOneByBusinessProfile(emailBusiness);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Update Business
   * @param {Business} entity
   */
  async update(entity: Business) {
    try {
      const businessRepository = new PostgresBusinessRepository();
      return await businessRepository.update(entity);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Update Business
   * @param {string} emailBusiness
   * @param {Business} entity
   */
  async updateByBusiness(emailBusiness: string, entity: Business) {
    try {
      const businessRepository = new PostgresBusinessRepository();
      return await businessRepository.updateByBusiness(emailBusiness, entity);
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
  /**
   * Find by id
   * @param {number} id
   */
  async findById(id: number): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
