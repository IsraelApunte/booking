import {MenuRepository} from '../repository/MenuRepository';
import {Authorization} from '../util/Utils';


/**
 * Administration Menu
 */
export class MenuService {
  /**
   * Find all with pagination
   * @param {authorizationParams} authorizationParams
   * @param {number} id
   */
  async getMenuRole(authorizationParams: Authorization): Promise<any> {
    try {
      const {ROLE_USER_BUSINESS, ROLE_USER_ALPELOTEO} = process.env;
      const menuRepository = new MenuRepository();
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await menuRepository.getMenuRoleByAlpeloteo(authorizationParams.email);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await menuRepository.getMenuRoleByBusiness(authorizationParams.email);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
