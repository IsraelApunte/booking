import {SearchFilter} from '../dto/SearchFilter';
import {PostgresBannerRepository} from '../repository/PostgresBannerRepository';
import {Banner} from '../util/Database';
import {Authorization} from '../util/Utils';
import {IPostgresCommonService} from './interface/IPostgresCommonService';

/**
 * Administration Banner
 */
export class PostgresBannerService implements IPostgresCommonService<Banner> {
  /**
   * Creation Banner
   * @param {Banner} entity
   */
  async create(entity: Banner): Promise<Banner> {
    try {
      const bannerRepository = new PostgresBannerRepository();
      return await bannerRepository.create(entity);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find all with pagination
   * @param {SearchFilter} searchFilter
   */
  async find( searchFilter: SearchFilter): Promise<any> {
    try {
      const bannerRepository = new PostgresBannerRepository();
      return await bannerRepository.findAllByPaginates(searchFilter);
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
      const bannerRepository = new PostgresBannerRepository();
      return await bannerRepository.getOne(Banner, id);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find by id
   * @param {authorizationParams} authorizationParams
   * @param {number} parentId
   */
  async findByParentId(authorizationParams: Authorization, parentId: number): Promise<any> {
    try {
      const bannerRepository = new PostgresBannerRepository();
      return await bannerRepository.getAllByParentId(Banner, parentId);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Update Banner
   * @param {Banner} entity
   */
  async update( entity: Banner) {
    try {
      const bannerRepository = new PostgresBannerRepository();
      return await bannerRepository.update(entity);
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
