import {SearchFilter} from '../dto/SearchFilter';
import {BusinessRepository} from '../repository/BusinessRepository';
import {Business} from '../util/Database';
import {Authorization} from '../util/Utils';
import {ICommonService} from './interface/ICommonService';

/**
 * Administration business
 */
export class BusinessService implements ICommonService<Business> {
  /**
   * Creation business
   * @param {any} authorizationParams
   * @param {Business} entity
   */
  async create(authorizationParams: Authorization, entity: Business): Promise<Business | undefined> {
    try {
      const {ROLE_USER_ALPELOTEO, ROLE_USER_BUSINESS} = process.env;
      const businessRepository = new BusinessRepository();
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await businessRepository.createAlpeloteo(entity);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        // return createResponse(401, {message: 'Unauthorized'});
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
      const {ROLE_USER_ALPELOTEO, ROLE_USER_BUSINESS} = process.env;
      const businessRepository = new BusinessRepository();
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await businessRepository.findAllByPaginates(searchFilter);
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
   * Find by id
   * @param {any} authorizationParams
   * @param {number} id
   */
  async findById(authorizationParams: Authorization, id: number): Promise<any> {
    try {
      const businessRepository = new BusinessRepository();
      const {ROLE_USER_ALPELOTEO, ROLE_USER_BUSINESS} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await businessRepository.getOne(id);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await businessRepository.getOneByBusiness(authorizationParams.email, id);
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find by profile
   * @param {any} authorizationParams
   * @param {number} id
   */
  async findByProfile(authorizationParams: Authorization): Promise<any> {
    try {
      const businessRepository = new BusinessRepository();
      const {ROLE_USER_ALPELOTEO, ROLE_USER_BUSINESS} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await businessRepository.getOneByAlpeloteoProfile(authorizationParams.email);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await businessRepository.getOneByBusinessProfile(authorizationParams.email);
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Update Business
   * @param {any} authorizationParams
   * @param {Business} entity
   */
  async update(authorizationParams: Authorization, entity: Business) {
    try {
      const {ROLE_USER_ALPELOTEO, ROLE_USER_BUSINESS} = process.env;
      const businessRepository = new BusinessRepository();
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await businessRepository.update(entity);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await businessRepository.updateByBusiness(authorizationParams.email, entity);
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
