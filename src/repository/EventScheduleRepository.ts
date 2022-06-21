import {CommonRepository} from './CommonRepository';
import {Event, Database, Business, Location, Product, EventSchedule, BusinessHour} from '../util/Database';
import {SearchFilter} from '../dto/SearchFilter';
import {Op} from 'sequelize';
/**
 * s
 */
export class EventScheduleRepository extends CommonRepository {
  /**
     * Create Event Schedules
     * @param {object} object
     * @return {response} response
     */
  async create(object: Event) {
    let response;
    const t = await Database.transaction();
    try {
      if (object.eventSchedules) {
        object.eventSchedules.map((resp: any) => {
          delete resp.id;
        });
      }

      const searchBusinessHours = await BusinessHour.findAll({
        where: {
          locationId: object.locationId,
          isActive: true,
        },
        transaction: t,
      });
      console.log(searchBusinessHours);

      response = await Event.create(object, {
        include: EventSchedule,
        transaction: t,
      });
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
  async createByBusiness(emailBusiness: string, object: Event) {
    let response;
    const t = await Database.transaction();
    try {
      if (object.eventSchedules) {
        object.eventSchedules.map((resp: any) => {
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
      response = await Event.create(object, {
        include: EventSchedule,
        transaction: t,
      });

      t.commit();
      return response;
    } catch (error) {
      console.error(error);
      t.rollback();
      throw error;
    }
  }
  /**
   * Update Events, Bussines Hours
   * @param {object} object
   * @return {response} response
   */
  async update(object: Event) {
    let response;
    const t = await Database.transaction();
    try {
      const updatedObject = await Event.update(object, {
        where: {
          id: object.id,
        },
        transaction: t,
      });
      const eventSchedules = object.eventSchedules;
      await EventSchedule.destroy({
        where: {
          eventId: object.id,
        },
        transaction: t,
      });
      if (eventSchedules !== undefined) {
        for (const eventSchedule of eventSchedules) {
          eventSchedule.eventId = object.id;
          await EventSchedule.create(eventSchedule, {
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
   * Update Events, Bussines Hours
   * @param {string} emailBusiness
   * @param {object} object
   * @return {response} response
   */
  async updateByBusiness(emailBusiness: string, object: Event) {
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
      const updatedObject = await Event.update(object, {
        where: {
          id: object.id,
        },
        transaction: t,
      });
      const eventSchedules = object.eventSchedules;
      await EventSchedule.destroy({
        where: {
          eventId: object.id,
        },
        transaction: t,
      });
      if (eventSchedules !== undefined) {
        for (const eventSchedule of eventSchedules) {
          eventSchedule.eventId = object.id;
          await EventSchedule.create(eventSchedule, {
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
      result = await Event.findByPk(id, {
        include: EventSchedule,
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
      result = await Event.findByPk(id, {
        include: [EventSchedule,
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
        result = await Event.findAndCountAll({
          limit, offset,
          include: [
            {
              model: Business,
              as: 'business',
              attributes: ['tradename'],
            },
            {
              model: Location,
              as: 'location',
              attributes: ['sector'],
            },
            {
              model: Product,
              as: 'product',
              attributes: ['sku'],
            }],
        });
      } else {
        result = await Event.findAndCountAll({
          limit,
          offset,
          include: [
            {
              model: Business,
              as: 'business',
              attributes: ['tradename'],
            },
            {
              model: Location,
              as: 'location',
              attributes: ['sector'],
            },
            {
              model: Product,
              as: 'product',
              attributes: ['sku'],
            }],
          where: {
            [Op.or]: [{name: {[Op.iLike]: `%${filter}%`}}],
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
        result = await Event.findAndCountAll({
          limit, offset,
          include: [
            {
              model: Location,
              as: 'location',
              attributes: ['sector'],
            },
            {
              model: Product,
              as: 'product',
              attributes: ['sku'],
            }],
          where: {businessId: searchBusiness?.id},
        });
      } else {
        result = await Event.findAndCountAll({
          limit,
          offset,
          include: [
            {
              model: Location,
              as: 'location',
              attributes: ['sector'],
            },
            {
              model: Product,
              as: 'product',
              attributes: ['sku'],
            }],
          where: {
            businessId: searchBusiness?.id,
            [Op.or]: [
              {name: {[Op.iLike]: `%${filter}%`}},
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
   * @param{number}id
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findEventsByBusiness(id: number, searchFilter: SearchFilter) {
    let result;
    try {
      const {page, limit, filter} = searchFilter!;
      const offset = (page - 1) * limit;
      if (filter == null) {
        result = await Event.findAndCountAll({
          limit, offset,
          where: {
            businessId: id,
          },
        });
      } else {
        result = await Event.findAndCountAll({
          limit,
          offset,
          where: {
            businessId: id,
            [Op.or]: [
              {name: {[Op.iLike]: `%${filter}%`}},
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

