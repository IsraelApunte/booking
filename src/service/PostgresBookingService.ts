/* eslint-disable valid-jsdoc */
import {SearchFilter} from '../dto/SearchFilter';
import {PostgresBookingRepository} from '../repository/PostgresBookingRepository';
import {Booking} from '../util/Database';
import {IPostgresCommonService} from './interface/IPostgresCommonService';
/**
 * Administration Booking
 */
export class PostgresBookingService implements IPostgresCommonService<Booking> {
  /**
   * Creation Booking
   * @param {authorizationParams} authorizationParams
   * @param {Booking} entity
   */
  async create(entity: Booking): Promise<any> {
    try {
      const bookingRepository = new PostgresBookingRepository();
      return await bookingRepository.create(entity);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Creation Booking
   * @param {authorizationParams} authorizationParams
   * @param {Booking} entity
   */
  async createByBusiness(emailBusiness: string, entity: Booking): Promise<any> {
    try {
      const bookingRepository = new PostgresBookingRepository();
      return await bookingRepository.createByBusiness(emailBusiness, entity);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find all with pagination
   * @param {authorizationParams} authorizationParams
   * @param {number} id
   */
  async findAllByPaginates(authorizationParams: any, searchFilter: SearchFilter): Promise<any> {
    try {
      const bookingRepository = new PostgresBookingRepository();
      return await bookingRepository.findAllByPaginates(searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find all with pagination
   * @param {authorizationParams} authorizationParams
   * @param {number} id
   */
  async findAllPaymentsByPaginates(searchFilter: SearchFilter): Promise<any> {
    try {
      const bookingRepository = new PostgresBookingRepository();
      return await bookingRepository.findAllPaymentsByPaginates(searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find all with pagination
   * @param {authorizationParams} authorizationParams
   * @param {number} id
   */
  async findAllByBusinessPaginates(emailBusiness: string, searchFilter: SearchFilter): Promise<any> {
    try {
      const bookingRepository = new PostgresBookingRepository();
      return await bookingRepository.findAllByBusinessPaginates(emailBusiness, searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find all with pagination
   * @param {authorizationParams} authorizationParams
   * @param {number} id
   */
  async findAllByCustomerPaginates(emailCustomer: string, searchFilter: SearchFilter): Promise<any> {
    try {
      const bookingRepository = new PostgresBookingRepository();
      return await bookingRepository.findAllByCustomerPaginates(emailCustomer, searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find all with pagination
   * @param {authorizationParams} authorizationParams
   * @param {number} id
   */
  async findByIdBusiness(id: number, searchFilter: SearchFilter): Promise<any> {
    try {
      const bookingRepository = new PostgresBookingRepository();
      return await bookingRepository.findByIdBusiness(id, searchFilter);
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
  async findById(id: number): Promise<any> {
    try {
      const bookingRepository = new PostgresBookingRepository();
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
  async update(entity: Booking) {
    try {
      const bookingRepository = new PostgresBookingRepository();
      return await bookingRepository.update(entity);
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
  async updatePayments(entity: Booking[]) {
    try {
      const bookingRepository = new PostgresBookingRepository();
      return await bookingRepository.updatePayments(entity);
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
  async updateReschedules(entity: Booking) {
    try {
      const bookingRepository = new PostgresBookingRepository();
      return await bookingRepository.update(entity);
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
   * Find all with pagination
   * @param {SearchFilter} searchFilter
   */
  async find(searchFilter: SearchFilter): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
