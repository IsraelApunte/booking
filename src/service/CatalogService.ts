import {SearchFilter} from '../dto/SearchFilter';
import {CatalogRepository} from '../repository/CatalogRepository';
import {Catalog} from '../util/Database';
import {Authorization} from '../util/Utils';
import {ICommonService} from './interface/ICommonService';

/**
 * Administration Catalog
 */
export class CatalogService implements ICommonService<Catalog> {
  /**
   * Creation Catalog
   * @param {any} authorizationParams
   * @param {Catalog} entity
   */
  async create(authorizationParams: Authorization, entity: Catalog): Promise<Catalog|undefined> {
    try {
      const {ROLE_USER_ALPELOTEO, ROLE_USER_BUSINESS} = process.env;
      const catalogRepository = new CatalogRepository();
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await catalogRepository.create(Catalog, entity);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        throw new Error(JSON.stringify({statusCode: 401}));
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find all with pagination
   * @param {any} authorizationParams
   * @param {SearchFilter} searchFilter
   */
  async find(authorizationParams: Authorization, searchFilter: SearchFilter): Promise<any> {
    try {
      const catalogRepository = new CatalogRepository();
      return await catalogRepository.findAllByPaginates(searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find by id
   * @param {any} authorizationParams
   * @param {number} id
   */
  async findById(authorizationParams: Authorization, id: number): Promise<any> {
    try {
      const catalogRepository = new CatalogRepository();
      return await catalogRepository.getOne(Catalog, id);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find by id
   * @param {any} authorizationParams
   * @param {number} parentId
   * @param {SearchFilter} searchFilter
   */
  async findByParentId(authorizationParams: Authorization|null, parentId: number,
      searchFilter: SearchFilter): Promise<any> {
    try {
      const catalogRepository = new CatalogRepository();
      return await catalogRepository.findAllByParentIdPaginates(parentId, searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Update Catalog
   * @param {any} authorizationParams
   * @param {Catalog} entity
   */
  async update(authorizationParams: Authorization, entity: Catalog) {
    try {
      const {ROLE_USER_ALPELOTEO, ROLE_USER_BUSINESS} = process.env;
      const catalogRepository = new CatalogRepository();
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await catalogRepository.update(Catalog, entity);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        throw new Error(JSON.stringify({statusCode: 401}));
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Delete
   * @param {any} authorizationParams
   * @param {number} id
   */
  async remove(authorizationParams: Authorization, id: number) {
    throw new Error('Method not implemented.');
  }
}
