import {SearchFilter} from '../dto/SearchFilter';
import {BookingRepository} from '../repository/BookingRepository';
import {Booking} from '../util/Database';
import {Authorization} from '../util/Utils';
import {ICommonService} from './interface/ICommonService';
/**
 * Administration Booking
 */
export class BookingService implements ICommonService<Booking> {
  /**
   * Creation Booking
   * @param {authorizationParams} authorizationParams
   * @param {Booking} entity
   */
  async create(authorizationParams: Authorization, entity: Booking): Promise<Booking | undefined> {
    try {
      let result;
      entity.emissionDate = new Date().toISOString();
      const bookingRepository = new BookingRepository();
      const {ROLE_USER_BUSINESS, ROLE_USER_CUSTOMER, ROLE_USER_ALPELOTEO} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO ) {
        result = await bookingRepository.createAlpeloteo(null, entity);
      }
      if (authorizationParams.group === ROLE_USER_CUSTOMER) {
        result = await bookingRepository.createCustomer(entity);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        result = await bookingRepository.createBusiness(authorizationParams.email, entity);
      }
      return result;
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
      const bookingRepository = new BookingRepository();
      const {ROLE_USER_BUSINESS, ROLE_USER_CUSTOMER, ROLE_USER_ALPELOTEO} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await bookingRepository.findAllByPaginates(searchFilter);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await bookingRepository.findAllByBusinessPaginates(authorizationParams.email, searchFilter);
      }
      if (authorizationParams.group === ROLE_USER_CUSTOMER) {
        return await bookingRepository.findAllByCustomerPaginates(authorizationParams.email, searchFilter);
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
  async findAllPaymentsByPaginates(authorizationParams: Authorization, searchFilter: SearchFilter): Promise<any> {
    try {
      const bookingRepository = new BookingRepository();
      const {ROLE_USER_BUSINESS, ROLE_USER_CUSTOMER, ROLE_USER_ALPELOTEO} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await bookingRepository.findAllPaymentsByPaginates(searchFilter);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await bookingRepository.findAllPaymentsByPaginates(searchFilter);
      }
      if (authorizationParams.group === ROLE_USER_CUSTOMER) {
        throw new Error(JSON.stringify({statusCode: 500}));
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find all with pagination
   * @param {authorizationParams} authorizationParams
   * @param {number}id
   * @param {SearchFilter} searchFilter
   */
  async findByIdBusiness(authorizationParams: Authorization, id: number, searchFilter: SearchFilter): Promise<any> {
    try {
      const bookingRepository = new BookingRepository();
      const {ROLE_USER_BUSINESS, ROLE_USER_CUSTOMER, ROLE_USER_ALPELOTEO} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await bookingRepository.findByIdBusiness(id, searchFilter);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS ||authorizationParams.group === ROLE_USER_CUSTOMER ) {
        throw new Error(JSON.stringify({statusCode: 500}));
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
      const bookingRepository = new BookingRepository();
      return await bookingRepository.getOne(id);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Update Booking
   * @param {authorizationParams} authorizationParams
   * @param {Booking} entity
   */
  async update(authorizationParams: Authorization, entity: Booking) {
    try {
      const bookingRepository = new BookingRepository();
      const {ROLE_USER_BUSINESS, ROLE_USER_CUSTOMER, ROLE_USER_ALPELOTEO} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await bookingRepository.updateAlpeloteo(entity);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS||
         authorizationParams.group === ROLE_USER_CUSTOMER) {
        return await bookingRepository.update(entity);
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Update Booking
   * @param {authorizationParams} authorizationParams
   * @param {Booking} entity
   */
  async updatePayments(authorizationParams: Authorization, entity: Booking[]) {
    try {
      const bookingRepository = new BookingRepository();
      const {ROLE_USER_ALPELOTEO} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await bookingRepository.updatePayments(entity);
      } else {
        throw new Error(JSON.stringify({statusCode: 500}));
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Update Booking
   * @param {authorizationParams} authorizationParams
   * @param {Booking} entity
   */
  async updateReschedules(authorizationParams: Authorization, entity: Booking) {
    try {
      entity.emissionDate = new Date().toISOString();
      const bookingRepository = new BookingRepository();
      const {ROLE_USER_CUSTOMER} = process.env;
      if (authorizationParams.group === ROLE_USER_CUSTOMER) {
        return await bookingRepository.updateReschedules(entity);
      } else {
        throw new Error(JSON.stringify({statusCode: 500}));
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
