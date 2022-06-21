
import {CommonRepository} from './CommonRepository';
import {BankAccount, Catalog} from '../util/Database';
import {SearchFilter} from '../dto/SearchFilter';

/**
 * s
 */
export class BankAccountRepository extends CommonRepository {
  /**
   * s
   * @param {object} object
   * @return {response} response
   */
  async create(object: BankAccount) {
    let response;
    try {
      response = await BankAccount.create(object);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * s
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllByPaginates(searchFilter: SearchFilter) {
    let result;
    try {
      const {page, limit} = searchFilter!;
      const offset = (page - 1) * limit;
      result = await BankAccount.findAndCountAll({
        limit, offset,
        include: [
          {
            model: Catalog,
            required: true,
            as: 'accountType',
            attributes: ['id', 'name'],
          },
          {
            model: Catalog,
            required: true,
            as: 'identificationType',
            attributes: ['id', 'name'],
          },
        ],
      });
      result = {
        totalDocs: result.count,
        perPage: limit,
        page,
        to: offset + result.rows.length,
        totalPages: Math.ceil(result.count / limit),
        from: offset,
        data: result.rows,
      };
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * s
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAlpeloteo(searchFilter: SearchFilter) {
    let result;
    try {
      const {page, limit} = searchFilter!;
      const offset = (page - 1) * limit;
      result = await BankAccount.findAndCountAll({
        limit, offset,
        where: {
          businessId: 1,
        },
        include: [
          {
            model: Catalog,
            required: true,
            as: 'accountType',
            attributes: ['id', 'name'],
          },
          {
            model: Catalog,
            required: true,
            as: 'identificationType',
            attributes: ['id', 'name'],
          },
          {
            model: Catalog,
            required: true,
            as: 'mobileCode',
            attributes: ['id', 'name', 'code'],
          },
          {
            model: Catalog,
            required: true,
            as: 'bankName',
            attributes: ['id', 'name'],
          },
        ],
      });
      result = {
        totalDocs: result.count,
        perPage: limit,
        page,
        to: offset + result.rows.length,
        totalPages: Math.ceil(result.count / limit),
        from: offset,
        data: result.rows,
      };
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * s
   * @param {number} id
   * @return {response} response
   */
  async getOne(id: number) {
    let result;
    try {
      result = await BankAccount.findByPk(id, {
        include: [
          {
            model: Catalog,
            required: true,
            as: 'accountType',
            attributes: ['id', 'name'],
          },
          {
            model: Catalog,
            required: true,
            as: 'identificationType',
            attributes: ['id', 'name'],
          },
        ],
      });
      if (!result) {
        result = {message: `Document ${id} Not Found.`, statusCode: 404};
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

