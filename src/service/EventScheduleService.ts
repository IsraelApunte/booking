import {SearchFilter} from '../dto/SearchFilter';
import {Event} from '../util/Database';
import {EventScheduleRepository} from '../repository/EventScheduleRepository';
import {ICommonService} from './interface/ICommonService';
import {Authorization} from '../util/Utils';

/**
 * Administration EventSchedule
 */
export class EventScheduleService implements ICommonService<Event> {
  /**
   * Creation EventSchedules
   * @param {authorizationParams} authorizationParams
   * @param {EventSchedules} entity
   */
  async create(authorizationParams: Authorization, entity: Event): Promise<Event|undefined> {
    try {
      const eventSchedulesRepository = new EventScheduleRepository();
      const {ROLE_USER_BUSINESS, ROLE_USER_CUSTOMER, ROLE_USER_ALPELOTEO} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await eventSchedulesRepository.create(entity);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await eventSchedulesRepository.createByBusiness(authorizationParams.email, entity);
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
      const eventSchedulesRepository = new EventScheduleRepository();
      const {ROLE_USER_BUSINESS, ROLE_USER_CUSTOMER, ROLE_USER_ALPELOTEO} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await eventSchedulesRepository.findAllByPaginate(searchFilter);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await eventSchedulesRepository.findAllByBusinessPaginate(authorizationParams.email, searchFilter);
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
      const eventSchedulesRepository = new EventScheduleRepository();
      const {ROLE_USER_BUSINESS, ROLE_USER_CUSTOMER, ROLE_USER_ALPELOTEO} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await eventSchedulesRepository.findEventsByBusiness(id, searchFilter);
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
      const eventSchedulesRepository = new EventScheduleRepository();
      return await eventSchedulesRepository.getOne(id);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Update EventSchedules
   * @param {authorizationParams} authorizationParams
   * @param {EventSchedules} entity
   */
  async update(authorizationParams: Authorization, entity: Event) {
    try {
      const eventSchedulesRepository = new EventScheduleRepository();
      const {ROLE_USER_BUSINESS, ROLE_USER_CUSTOMER, ROLE_USER_ALPELOTEO} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await eventSchedulesRepository.update(entity);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await eventSchedulesRepository.updateByBusiness(authorizationParams.email, entity);
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
