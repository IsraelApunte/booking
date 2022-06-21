import {SearchFilter} from '../dto/SearchFilter';
import {BannerRepository} from '../repository/BannerRepository';
import {Banner} from '../util/Database';
import {Authorization} from '../util/Utils';
import {ICommonService} from './interface/ICommonService';

/**
 * Administration Banner
 */
export class BannerService implements ICommonService<Banner> {
  /**
   * Creation Banner
   * @param {authorizationParams} authorizationParams
   * @param {Banner} entity
   */
  async create(authorizationParams: Authorization, entity: Banner): Promise<Banner> {
    try {
      const bannerRepository = new BannerRepository();
      return await bannerRepository.create(entity);
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
  async find(authorizationParams: Authorization|null, searchFilter: SearchFilter): Promise<any> {
    try {
      const bannerRepository = new BannerRepository();
      return await bannerRepository.findAllByPaginates(searchFilter);
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
  async findById(authorizationParams: Authorization, id: number): Promise<any> {
    try {
      const bannerRepository = new BannerRepository();
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
      const bannerRepository = new BannerRepository();
      return await bannerRepository.getAllByParentId(Banner, parentId);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Update Banner
   * @param {authorizationParams} authorizationParams
   * @param {Banner} entity
   */
  async update(authorizationParams: Authorization, entity: Banner) {
    try {
      const bannerRepository = new BannerRepository();
      return await bannerRepository.update(entity);
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
