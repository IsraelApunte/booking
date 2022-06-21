import {Op} from 'sequelize';
/**
 * s
 */
export class CommonRepository {
  /**
   * s
   * @param {model} model
   * @param {object} object
   * @return {response} response
   */
  async create(model: any, object: any) {
    let response;
    try {
      response = await model.create(object);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      // await sequelize.close();
    }
  }
  /**
   * s
   * @param {model} model
   * @param {object} object
   * @return {response} response
   */
  async update(model: any, object: any) {
    let response;
    try {
      const updatedObject = await model.update(object, {
        where: {
          id: object.id,
        },
      });
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
   * @param {model} model
   * @param {number} id
   * @return {response} response
   */
  async getOne(model: any, id: number) {
    let result;
    try {
      result = await model.findByPk(id);
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
   * @param {model} model
   * @param {string} field
   * @param {string} value
   * @return {response} response
   */
  async getOneByField(
      model: any,
      field: string,
      value: string) {
    try {
      const result = await model.findOne({[field]: value});
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  /**
   * s
   * @param {model} model
   * @param {string} fieldOrder
   * @return {string} fieldOrder
   */
  async getAllAndOrder(
      model: any,
      fieldOrder:string = 'name') {
    try {
      return model.findAll({
        where: {
          isActive: true,
        },
        order: [
          [fieldOrder, 'DESC'],
        ],
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  /**
   * s
   * @param {model} model
   * @param {filter} filter
   * @return {response} response
   */
  async findAllAndFilter(
      model: any,
      filter: string) {
    try {
      return model.findAll({
        where: {
          [Op.or]: [{
            name: {[Op.like]: filter},
          }],
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  /**
   * s
   * @param {model} model
   * @param {number} limit
   * @param {number} page
   * @return {response} response
   */
  async findAllByPaginate(
      model: any,
      limit: number,
      page: number) {
    let result;
    const offset = (page - 1) * limit;
    result = await model.findAndCountAll({
      limit, offset,
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
  };
  /**
   * s
   * @param {model} model
   * @param {object} object
   * @return {response} response
   */
  async findAll(
      model: any) {
    try {
      return model.findAll();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  /**
   * s
   * @param {model} model
   * @param {number} parentId
   * @return {response} response
   */
  async getAllByParentId(
      model: any,
      parentId: number) {
    try {
      return model.findAll({
        where: {
          parentId,
          isActive: true,
        },
        order: [
          ['name', 'ASC'],
        ],
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * s
   * @param {model} model
   * @param {object} object
   * @return {response} response
   */
  async getAllCount(
      model: any) {
    try {
      return model.count({
        where: {
          isActive: true,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}


