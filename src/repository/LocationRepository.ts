import {CommonRepository} from './CommonRepository';
import {BusinessHour, Location, Database, Business, Product, BookingSequence} from '../util/Database';
import {SearchFilter} from '../dto/SearchFilter';
import {Op} from 'sequelize';
/**
 * s
 */
export class LocationRepository extends CommonRepository {
  /**
     * s
     * @param {object} object
     * @return {response} response
     */
  async create(object: Location) {
    let response;
    const t = await Database.transaction();
    try {
      if (object.businessHours) {
        object.businessHours.map((resp: any) => {
          delete resp.id;
        });
      }
      response = await Location.create(object, {
        include: BusinessHour,
      });
      const searchBookingSequence = await BookingSequence.findByPk(object.id);
      let orderNumber: number;
      if (searchBookingSequence && searchBookingSequence.id) {
        orderNumber = searchBookingSequence.bookingNumber + 1;
        await BookingSequence.update({bookingNumber: orderNumber}, {
          where: {
            id: object.id,
          },
          transaction: t,
        });
      } else {
        orderNumber = 0;
        const searchSequence = {
          bookingNumber: orderNumber,
          locationId: response.id,
        };
        await BookingSequence.create(searchSequence, {
          transaction: t,
        });
      }
      t.commit();
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
  async createByBusiness(emailBusiness: string, object: Location) {
    let response;
    const t = await Database.transaction();
    try {
      if (object.businessHours) {
        object.businessHours.map((resp: any) => {
          delete resp.id;
        });
      }
      const searchBusiness = await Business.findOne({
        where: {email: emailBusiness},
        transaction: t,
      });
      if (searchBusiness !== null) {
        object.businessId = searchBusiness.id;
      }
      response = await Location.create(object, {
        include: BusinessHour,
        transaction: t,
      });

      const searchBookingSequence = await BookingSequence.findByPk(object.id);
      let orderNumber: number;
      if (searchBookingSequence && searchBookingSequence.id) {
        orderNumber = searchBookingSequence.bookingNumber + 1;
        await BookingSequence.update({bookingNumber: orderNumber}, {
          where: {
            id: object.id,
          },
          transaction: t,
        });
      } else {
        orderNumber = 0;
        const searchSequence = {
          bookingNumber: orderNumber,
          locationId: response.id,
        };
        await BookingSequence.create(searchSequence, {
          transaction: t,
        });
      }
      t.commit();
      return response;
    } catch (error) {
      console.error(error);
      t.rollback();
      throw error;
    }
  }
  /**
   * Update Location, Bussines Hours
   * @param {object} object
   * @return {response} response
   */
  async update(object: Location) {
    let response;
    const t = await Database.transaction();
    try {
      const updatedObject = await Location.update(object, {
        where: {
          id: object.id,
        },
        transaction: t,
      });
      const businessHours = object.businessHours;
      await BusinessHour.destroy({
        where: {
          locationId: object.id,
        },
        transaction: t,
      });
      if (businessHours !== undefined) {
        for (const businessHour of businessHours) {
          businessHour.locationId = object.id;
          await BusinessHour.create(businessHour, {
            transaction: t,
          });
        }
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
   * Update Location, Bussines Hours
   * @param {string} emailBusiness
   * @param {object} object
   * @return {response} response
   */
  async updateByBusiness(emailBusiness: string, object: Location) {
    let response;
    const t = await Database.transaction();
    try {
      const searchBusiness = await Business.findOne({
        where: {email: emailBusiness},
        transaction: t,
      });
      if (searchBusiness !== null) {
        object.businessId = searchBusiness?.id;
      }
      const updatedObject = await Location.update(object, {
        where: {
          id: object.id,
        },
        transaction: t,
      });
      const businessHours = object.businessHours;
      await BusinessHour.destroy({
        where: {
          locationId: object.id,
        },
        transaction: t,
      });
      if (businessHours !== undefined) {
        for (const businessHour of businessHours) {
          businessHour.locationId = object.id;
          await BusinessHour.create(businessHour, {
            transaction: t,
          });
        }
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
   * @param {number} id
   * @return {response} response
   */
  async getOne(id: number) {
    let result;
    try {
      result = await Location.findByPk(id, {
        include: BusinessHour,
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
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllByPaginate(searchFilter: SearchFilter) {
    let result;
    try {
      const {page, limit, filter} = searchFilter!;
      const offset = (page - 1) * limit;
      if (filter == null) {
        result = await Location.findAndCountAll({
          limit, offset,
          include: [
            {
              model: Business,
              as: 'business',
              attributes: ['tradename'],
            }],
        });
      } else {
        result = await Location.findAndCountAll({
          limit,
          offset,
          include: [
            {
              model: Business,
              required: true,
              as: 'business',
              attributes: ['tradename'],
              where: {
                [Op.or]: [{tradename: {[Op.iLike]: `%${filter}%`}}],
              },
            }],
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

  /**
   * s
   * @param {string} emailBusiness
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllByBusinessPaginate(emailBusiness: string, searchFilter: SearchFilter) {
    let result;
    try {
      const searchBusiness = await Business.findOne({
        where: {email: emailBusiness},
      });
      const {page, limit, filter} = searchFilter!;
      const offset = (page - 1) * limit;
      if (filter == null) {
        result = await Location.findAndCountAll({
          limit, offset,
          where: {businessId: searchBusiness?.id},
        });
      } else {
        result = await Location.findAndCountAll({
          limit,
          offset,
          where: {
            businessId: searchBusiness?.id,
            [Op.or]: [
              {sector: {[Op.iLike]: `%${filter}%`}},
              {address: {[Op.iLike]: `%${filter}%`}},
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
  /**
   * s
   * @param {string} sportId
   * @param {SearchFilter} searchFilter
   * @return {string} result
   */
  async findAllBySportIdPaginates(sportId: number | null, searchFilter: SearchFilter) {
    let result;
    try {
      const {page, limit} = searchFilter!;
      const offset = (page - 1) * limit;
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
   * @param{number}id
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findLocationByBusiness(id: number, searchFilter: SearchFilter) {
    let result;
    try {
      const {page, limit, filter} = searchFilter!;
      const offset = (page - 1) * limit;
      if (filter == null) {
        result = await Location.findAndCountAll({
          limit, offset,
          where: {
            businessId: id,
          },
        });
      } else {
        result = await Location.findAndCountAll({
          limit,
          offset,
          where: {
            businessId: id,
            [Op.or]: [
              {firstName: {[Op.iLike]: `%${filter}%`}},
              {tradename: {[Op.iLike]: `%${filter}%`}},
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

