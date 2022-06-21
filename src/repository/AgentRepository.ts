import {Op} from 'sequelize';
import {SearchFilter} from '../dto/SearchFilter';
import {Agent, BankAccount, Catalog, Database} from '../util/Database';
import {CommonRepository} from './CommonRepository';

/**
 * s
 */
export class AgentRepository extends CommonRepository {
  /**
   * s
   * @param {object} object
   * @return {response} response
   */
  async create(object: Agent) {
    let response;
    try {
      response = await Agent.create(object, {
        include: BankAccount,
      });
      return response;
    } catch (error: any) {
      console.error(error);
      if (error.parent && error.parent.code && error.parent.code === '23505') {
        throw new Error(JSON.stringify({code: parseInt(error.parent.code), detail: error.parent.detail}));
      }
      throw error;
    }
  }

  /**
   * s
   * @param {number} id
   * @return {response} response
   */
  async getOne(id: number) {
    let result;
    try {
      result = await Agent.findByPk(id, {
        include: [
          {
            model: Catalog,
            required: true,
            as: 'mobileCode',
            attributes: ['id', 'name'],
          },
          {
            model: Catalog,
            required: true,
            as: 'identificationType',
            attributes: ['id', 'name'],
          },
          {
            model: BankAccount,
            required: true,
            as: 'bankAccounts',
          },
        ],
      });
      if (!result) {
        result = await Agent.findByPk(id, {
          include: [
            {
              model: Catalog,
              required: true,
              as: 'mobileCode',
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
      }
      if (!result) {
        result = {message: `Document ${id} Not Found.`, statusCode: 404};
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * s
   * @param {object} object
   * @return {response} response
   */
  async update(object: any) {
    const t = await Database.transaction();
    let response;
    try {
      const updatedObject = await Agent.update(object, {
        where: {
          id: object.id,
        },
        transaction: t,
      });
      const bankAccounts = object.bankAccounts;
      await BankAccount.destroy({
        where: {
          agentId: object.id,
        },
        transaction: t,
      });

      for (const bankAccount of bankAccounts) {
        bankAccount.agentId = object.id;
        await BankAccount.create(bankAccount, {
          transaction: t,
        });
      }
      await t.commit();
      response = !updatedObject ?
        {message: 'Document can\'t be updated.', statusCode: 500} :
        {message: 'Document updated.'};
      return response;
    } catch (error) {
      console.error(error);
      await t.rollback();
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
      const {page, limit, filter} = searchFilter!;
      const offset = (page - 1) * limit;
      if (filter == null) {
        result = await Agent.findAndCountAll({
          limit, offset,
        });
      } else {
        result = await Agent.findAndCountAll({
          limit,
          offset,
          where: {
            [Op.or]: [
              {firstName: {[Op.iLike]: `%${filter}%`}},
              {lastName: {[Op.iLike]: `%${filter}%`}},
              {identificationNumber: {[Op.iLike]: `%${filter}%`}},
              {mobile: {[Op.iLike]: `%${filter}%`}},
              {email: {[Op.iLike]: `%${filter}%`}},
            ],
          },
        });
      }
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
}

