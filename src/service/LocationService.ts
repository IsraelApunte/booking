import {SearchFilter} from '../dto/SearchFilter';
import {Location} from '../util/Database';
import {LocationRepository} from '../repository/LocationRepository';
import {ICommonService} from './interface/ICommonService';
import {Authorization} from '../util/Utils';

/**
 * Administration Location
 */
export class LocationService implements ICommonService<Location> {
  /**
   * Creation Location
   * @param {authorizationParams} authorizationParams
   * @param {Location} entity
   */
  async create(authorizationParams: Authorization, entity: Location): Promise<Location|undefined> {
    try {
      const locationRepository = new LocationRepository();
      const {ROLE_USER_BUSINESS, ROLE_USER_CUSTOMER, ROLE_USER_ALPELOTEO} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await locationRepository.create(entity);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await locationRepository.createByBusiness(authorizationParams.email, entity);
      }
      if (authorizationParams.group === ROLE_USER_CUSTOMER) {
        throw new Error(JSON.stringify({statusCode: 401}));
      }
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
      const locationRepository = new LocationRepository();
      const {ROLE_USER_BUSINESS, ROLE_USER_CUSTOMER, ROLE_USER_ALPELOTEO} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await locationRepository.findAllByPaginate(searchFilter);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await locationRepository.findAllByBusinessPaginate(authorizationParams.email, searchFilter);
      }
      if (authorizationParams.group === ROLE_USER_CUSTOMER) {
        throw new Error(JSON.stringify({statusCode: 401}));
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * findBusiness all with pagination
   * @param {authorizationParams} authorizationParams
   * @param {number}id
   * @param {SearchFilter} searchFilter
   */
  async findBusiness(authorizationParams: Authorization, id:number, searchFilter: SearchFilter): Promise<any> {
    try {
      const locationRepository = new LocationRepository();
      const {ROLE_USER_BUSINESS, ROLE_USER_CUSTOMER, ROLE_USER_ALPELOTEO} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await locationRepository.findLocationByBusiness(id, searchFilter);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        throw new Error(JSON.stringify({statusCode: 401}));
      }
      if (authorizationParams.group === ROLE_USER_CUSTOMER) {
        throw new Error(JSON.stringify({statusCode: 401}));
      }
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
      const locationRepository = new LocationRepository();
      return await locationRepository.getOne(id);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Update Location
   * @param {authorizationParams} authorizationParams
   * @param {Location} entity
   */
  async update(authorizationParams: Authorization, entity: Location) {
    try {
      const locationRepository = new LocationRepository();
      const {ROLE_USER_BUSINESS, ROLE_USER_CUSTOMER, ROLE_USER_ALPELOTEO} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await locationRepository.update(entity);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await locationRepository.updateByBusiness(authorizationParams.email, entity);
      }
      if (authorizationParams.group === ROLE_USER_CUSTOMER) {
        throw new Error(JSON.stringify({statusCode: 401}));
      }
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
