import {CommonRepository} from './CommonRepository';
import {BusinessHour, Location, Business, Product} from '../util/Database';
import {SearchFilter} from '../dto/SearchFilter';
import {Op} from 'sequelize';
/**
 * s
 */
export class LocationPublicRepository extends CommonRepository {
  /**
   * s
   * @param {number} id
   * @return {response} response
   */
  async getOnePublic(id: number) {
    let result;
    try {
      result = await Location.findByPk(id, {
        include: [BusinessHour,
          {
            model: Business,
            as: 'business',
          }],
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

  /**
   * s
   * @param {string} sportId
   * @param {SearchFilter} searchFilter
   * @return {string} result
   */
  async findAllBySportIdPaginates(sportId: number | null, searchFilter: SearchFilter) {
    let result;
    try {
      const {page, limit, filter} = searchFilter!;
      const offset = (page - 1) * limit;
      if (filter == null) {
        result = await Location.findAndCountAll({
          limit,
          offset,
          include: [
            {
              model: Business,
              as: 'business',
            },
            {
              model: Product,
              as: 'products',
              where: {
                sportId: sportId,
              },
            },
          ],
        });
      } else {
        result = await Location.findAndCountAll({
          limit,
          offset,
          include: [
            {
              model: Business,
              as: 'business',
              attributes: ['id', 'firstName', 'tradename'],
              where: {
                [Op.or]: [
                  {tradename: {[Op.iLike]: `%${filter}%`}},
                ],
              },
            },
            {
              model: Product,
              as: 'products',
              where: {
                sportId: sportId,
              },
            },
          ],
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

