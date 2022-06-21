import {Op} from 'sequelize';
import {SearchFilter} from '../dto/SearchFilter';
import {Banner} from '../util/Database';
import {CommonRepository} from './CommonRepository';
/**
 * s
 */
export class BannerPublicRepository extends CommonRepository {
  /**
   * Find All By Paginates Banners
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllByPaginates(searchFilter: SearchFilter) {
    let result;
    try {
      const {page, limit, filter} = searchFilter!;
      const offset = (page - 1) * limit;
      if (filter == null) {
        result = await Banner.findAndCountAll({
          limit,
          offset,
        });
      } else {
        result = await Banner.findAndCountAll({
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
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
