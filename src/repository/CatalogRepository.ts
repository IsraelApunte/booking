import {Op} from 'sequelize';
import {SearchFilter} from '../dto/SearchFilter';
import {Catalog} from '../util/Database';
import {CommonRepository} from './CommonRepository';
/**
 * s
 */
export class CatalogRepository extends CommonRepository {
  /**
   * Create
   * @param {object} object
   * @return {response} response
   */
  async creates(object: Catalog) {
    let response;
    try {
      response = await Catalog.create(object);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find All By Paginates Catalogs
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllByPaginates(searchFilter: SearchFilter) {
    let result;
    const {page, limit, filter} = searchFilter!;
    const offset = (page - 1) * limit;
    if (filter==null) {
      result = await Catalog.findAndCountAll({
        limit,
        offset,
        where: {
          parentId: null,
        },
      });
    } else {
      result= await Catalog.findAndCountAll({
        limit,
        offset,
        where: {
          name: {[Op.iLike]: `%${filter}%`},
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

  /**
   * Find All By Paginates Catalogs
   * @param {number} parentId
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllByParentIdPaginates(parentId: number, searchFilter: SearchFilter) {
    let result;
    const {page, limit, filter} = searchFilter!;
    const offset = (page - 1) * limit;
    if (filter==null) {
      result = await Catalog.findAndCountAll({
        limit,
        offset,
        where: {
          parentId: parentId,
        },
      });
    } else {
      result= await Catalog.findAndCountAll({
        limit,
        offset,
        where: {
          parentId: parentId,
          name: {[Op.iLike]: `%${filter}%`},
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

