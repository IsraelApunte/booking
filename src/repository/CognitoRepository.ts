
// import Customer from '../entity/Customer';
// import User from '../entity/User';
import {Database, User, Customer} from '../util/Database';
import {CommonRepository} from './CommonRepository';
/**
 * s
 */
export class CognitoRepository extends CommonRepository {
  /**
   * s
   * @param {object} object
   * @param {object} requestCognito
   * @return {response} response
   */
  async create(object: any) {
    const t = await Database.transaction();
    try {
      const response = await User.create(object, {transaction: t});

      const objectCustomer = {
        id: null,
        firstName: 'Consumidor',
        lastName: 'Final',
        identificationTypeId: 12,
        identificationNumber: '9999999999',
        birthday: '2020-01-13',
        mobileCodeId: 1001,
        mobile: '0999999999',
        phone: '9999999',
        email: object.email,
        isActive: true,
        address: 'NA',
        personTypeId: 61,
      };
      const searchCustomer = await Customer.findOne({
        where: {email: objectCustomer.email},
        transaction: t,
      });
      if (searchCustomer === null) {
        await Customer.create(objectCustomer,
            {transaction: t});
      } else {
        await Customer.update(searchCustomer, {
          where: {
            email: object.email,
          },
          transaction: t,
        });
      }
      await t.commit();
      return response;
    } catch (error) {
      console.error(error);
      await t.rollback();
      throw error;
    }
  }
  /**
   * s
   * @param {string} userNameId
   * @param {object} requestCognito
   * @return {response} response
   */
  async findUserExist(userNameId: string) {
    try {
      const searchUser = await User.findOne({
        where: {username: userNameId},
      });
      if (searchUser === null) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
