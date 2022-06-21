import {SearchFilter} from '../dto/SearchFilter';
import {BankAccountRepository} from '../repository/BankAccountRepository';
import {BankAccount} from '../util/Database';
import {Authorization} from '../util/Utils';
import {ICommonService} from './interface/ICommonService';

/**
 * Administration BankACcount
 */
export class BankAccountService implements ICommonService<BankAccount> {
  /**
   * Creation BankAccount
   * @param {authorizationParams} authorizationParams
   * @param {BankAccount} entity
   */
  async create(authorizationParams: Authorization, entity: BankAccount): Promise<BankAccount> {
    try {
      const bankAccountRepository = new BankAccountRepository();
      return await bankAccountRepository.create(entity);
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
      const bankAccountRepository = new BankAccountRepository();
      return await bankAccountRepository.findAllByPaginates(searchFilter);
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
  async findAlpeloteo(authorizationParams: Authorization, searchFilter: SearchFilter): Promise<any> {
    try {
      const bankAccountRepository = new BankAccountRepository();
      return await bankAccountRepository.findAlpeloteo(searchFilter);
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
      const bankAccountRepository = new BankAccountRepository();
      return await bankAccountRepository.getOne(id);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Update BankACcount
   * @param {authorizationParams} authorizationParams
   * @param {BankACcount} entity
   */
  async update(authorizationParams: Authorization, entity: BankAccount) {
    try {
      const bankAccountRepository = new BankAccountRepository();
      return await bankAccountRepository.update(BankAccount, entity);
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
