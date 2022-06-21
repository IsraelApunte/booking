
import {Op} from 'sequelize';
import {CommonRepository} from './CommonRepository';
import {Agent, BankAccount, Business, Catalog, Database} from '../util/Database';
import {SearchFilter} from '../dto/SearchFilter';
/**
 * s
 */
export class PostgresBusinessRepository extends CommonRepository {
  /**
   * s
   * @param {object} object
   * @return {response} response
   */
  async create(object: Business) {
    const t = await Database.transaction();
    let response;
    try {
      if (object.bankAccounts) {
        object.bankAccounts.map((resp: any) => {
          delete resp.id;
        });
      }
      response = await Business.create(object, {
        include: BankAccount,
        transaction: t,
      });
      t.commit();
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
      result = await Business.findByPk(id, {
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
            model: Catalog,
            required: true,
            as: 'province',
            attributes: ['id', 'name'],
          },
          {
            model: Catalog,
            required: true,
            as: 'city',
            attributes: ['id', 'name'],
          },
          {
            model: BankAccount,
            required: true,
            as: 'bankAccounts',
          },
          {
            model: Agent,
            required: true,
            as: 'agent',
          },
        ],
      });
      if (!result) {
        result = await Business.findByPk(id, {
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
              model: Catalog,
              required: true,
              as: 'province',
              attributes: ['id', 'name'],
            },
            {
              model: Catalog,
              required: true,
              as: 'city',
              attributes: ['id', 'name'],
            },
            {
              model: BankAccount,
              required: true,
              as: 'bankAccounts',
            },
          ],
        });
      }
      if (!result) {
        result = await Business.findByPk(id, {
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
              model: Catalog,
              required: true,
              as: 'province',
              attributes: ['id', 'name'],
            },
            {
              model: Catalog,
              required: true,
              as: 'city',
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
  async update(object: Business) {
    const t = await Database.transaction();
    let response;
    try {
      const updatedObject = await Business.update(object, {
        where: {
          id: object.id,
        },
        transaction: t,
      });
      const bankAccounts = object.bankAccounts;
      await BankAccount.destroy({
        where: {
          businessId: object.id,
        },
        transaction: t,
      });
      for (const bankAccount of bankAccounts) {
        bankAccount.businessId = object.id;
        await BankAccount.create(bankAccount, {
          transaction: t,
        });
      }
      // await User.create({
      //   id: null,
      //   username: object.username,
      //   email: object.email,
      //   roleId: parseInt(process.env.ROLE_USER_BUSINESS_ID!),
      // }, {
      //   transaction: t,
      // });
      await t.commit();
      response = !updatedObject ?
        {message: 'Document can\'t be updated.', statusCode: 500} :
        {message: 'Document updated.'};
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * s
   * @param {string} emailBusiness
   * @param {object} object
   * @return {response} response
   */
  async updateByBusiness(emailBusiness: string, object: Business) {
    const t = await Database.transaction();
    let response;
    try {
      const searchBusiness = await Business.findOne({
        where: {email: emailBusiness},
        transaction: t,
      });
      if (searchBusiness!.id !== object.id) {
        throw new Error('searchBusiness error diferente');
      }
      const updatedObject = await Business.update(object, {
        where: {
          id: object.id,
        },
        transaction: t,
      });
      const bankAccounts = object.bankAccounts;
      await BankAccount.destroy({
        where: {
          businessId: object.id,
        },
        transaction: t,
      });
      for (const bankAccount of bankAccounts) {
        bankAccount.businessId = object.id;
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
      throw error;
    }
  }
  /**
   * s
   * @param {string} emailBusiness
   * @param {number} id
   * @return {response} response
   */
  async getOneByBusiness(emailBusiness: string, id: number) {
    let result;
    try {
      result = await Business.findOne({
        where: {
          id: id,
          email: emailBusiness,
        },
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
          {
            model: Agent,
            required: true,
            as: 'agent',
          },
        ],
      });
      if (!result) {
        result = await Business.findOne({
          where: {
            id: id,
            email: emailBusiness,
          },
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
              model: Catalog,
              required: true,
              as: 'province',
              attributes: ['id', 'name'],
            },
            {
              model: Catalog,
              required: true,
              as: 'city',
              attributes: ['id', 'name'],
            },
            {
              model: BankAccount,
              required: true,
              as: 'bankAccounts',
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
   * @param {string} emailAlpeloteo
   * @param {number} id
   * @return {response} response
   */
  async getOneByAlpeloteoProfile(emailAlpeloteo: string) {
    let result;
    try {
      result = await Business.findOne({
        where: {
          email: emailAlpeloteo,
        },
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
            model: Catalog,
            required: true,
            as: 'province',
            attributes: ['id', 'name'],
          },
          {
            model: Catalog,
            required: true,
            as: 'city',
            attributes: ['id', 'name'],
          },
          {
            model: BankAccount,
            required: true,
            as: 'bankAccounts',
          },
          {
            model: Agent,
            required: true,
            as: 'agent',
          },
        ],
      });
      if (!result) {
        result = await Business.findOne({
          where: {
            email: emailAlpeloteo,
          },
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
              model: Catalog,
              required: true,
              as: 'province',
              attributes: ['id', 'name'],
            },
            {
              model: Catalog,
              required: true,
              as: 'city',
              attributes: ['id', 'name'],
            },
            {
              model: BankAccount,
              required: true,
              as: 'bankAccounts',
            },
          ],
        });
      }
      if (!result) {
        result = await Business.findOne({
          where: {
            email: emailAlpeloteo,
          },
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
              model: Catalog,
              required: true,
              as: 'province',
              attributes: ['id', 'name'],
            },
            {
              model: Catalog,
              required: true,
              as: 'city',
              attributes: ['id', 'name'],
            },
          ],
        });
      }
      if (!result) {
        result = {message: `Document ${emailAlpeloteo} Not Found.`, statusCode: 404};
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * s
   * @param {string} emailBusiness
   * @param {number} id
   * @return {response} response
   */
  async getOneByBusinessProfile(emailBusiness: string) {
    let result;
    try {
      result = await Business.findOne({
        where: {
          email: emailBusiness,
        },
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
            model: Catalog,
            required: true,
            as: 'province',
            attributes: ['id', 'name'],
          },
          {
            model: Catalog,
            required: true,
            as: 'city',
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
        result = await Business.findOne({
          where: {
            email: emailBusiness,
          },
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
              model: Catalog,
              required: true,
              as: 'province',
              attributes: ['id', 'name'],
            },
            {
              model: Catalog,
              required: true,
              as: 'city',
              attributes: ['id', 'name'],
            },
          ],
        });
      }
      if (!result) {
        result = {message: `Document ${emailBusiness} Not Found.`, statusCode: 404};
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find Business by paginates
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllByPaginates(searchFilter: SearchFilter) {
    let result;
    const {page, limit, filter} = searchFilter!;
    const offset = (page - 1) * limit;
    if (filter == null) {
      result = await Business.findAndCountAll({
        limit, offset, include: [
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
        where: {
          isActive: true,
        },
      });
    } else {
      result = await Business.findAndCountAll({
        limit,
        offset,
        where: {
          isActive: true,
          [Op.or]: [
            {tradename: {[Op.iLike]: `%${filter}%`}},
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
  };
}

