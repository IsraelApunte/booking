import {BusinessRepository} from '../repository/BusinessRepository';
import {Business} from '../util/Database';

/**
 * Administration Business
 */
export class BusinessPublicService {
  /**
   * Creation business
   * @param {Business} entity
   */
  async create(entity: Business): Promise<Business | undefined> {
    try {
      const businessRepository = new BusinessRepository();
      return await businessRepository.createCustomer(entity);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
}
