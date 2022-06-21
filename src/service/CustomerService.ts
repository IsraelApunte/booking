import {SearchFilter} from '../dto/SearchFilter';
import {CustomerRepository} from '../repository/CustomerRepository';
import {Customer} from '../util/Database';
import {Authorization} from '../util/Utils';
import {ICommonService} from './interface/ICommonService';

/**
 * Administration Customer
 */
export class CustomerService implements ICommonService<Customer> {
  /**
   * Creation Customer
   * @param {authorizationParams} authorizationParams
   * @param {Customer} entity
   */
  async create(authorizationParams: Authorization, entity: Customer): Promise<Customer> {
    try {
      const customerRepository= new CustomerRepository();
      return await customerRepository.create(entity);
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
      const customerRepository = new CustomerRepository();
      const {ROLE_USER_ALPELOTEO, ROLE_USER_BUSINESS} = process.env;
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await customerRepository.findAllByPaginates(searchFilter);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await customerRepository.findAllByBusinessPaginates(authorizationParams.email, searchFilter);
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
  async findByProfile(authorizationParams:Authorization): Promise<any> {
    try {
      const customerRepository = new CustomerRepository();
      const {ROLE_USER_CUSTOMER} = process.env;
      if (authorizationParams.group === ROLE_USER_CUSTOMER) {
        return await customerRepository.getOneByCustomerProfile(authorizationParams.email);
      } else {
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
      const customerRepository= new CustomerRepository();
      return await customerRepository.getOne(id);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Update Customer
   * @param {authorizationParams} authorizationParams
   * @param {Customer} entity
   */
  async update(authorizationParams: Authorization, entity: Customer) {
    try {
      const customerRepository= new CustomerRepository();
      return await customerRepository.update(Customer, entity);
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
