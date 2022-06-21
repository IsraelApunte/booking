import {Business, Customer, Menu, User} from '../util/Database';
import {CommonRepository} from './CommonRepository';
/**
 * s
 */
export class MenuRepository extends CommonRepository {
  /**
   * s
   *@param {string} email
   * @return {response} response
   */
  async getMenuRoleByBusiness(email:string) {
    let result;
    try {
      const searchBusiness = await Business.findOne({
        where: {email: email},
      });
      if (searchBusiness === null) {
        throw new Error(JSON.stringify({statusCode: 401, message: 'Unauthorizes'}));
      }
      const searchUser = await User.findOne({
        where: {email: searchBusiness.email},
      });
      result = Menu.findAll({
        where: {roleId: searchUser!.roleId},
      });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * s
   *@param {string} email
   * @return {response} response
   */
  async getMenuRoleByAlpeloteo(email:string) {
    let result;
    try {
      const searchCustomer = await Customer.findOne({
        where: {email: email},
      });
      if (searchCustomer === null) {
        throw new Error(JSON.stringify({statusCode: 401, message: 'Unauthorizes'}));
      }
      const searchUser = await User.findOne({
        where: {email: searchCustomer.email},
      });
      result = Menu.findAll({
        where: {roleId: searchUser!.roleId},
      });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
