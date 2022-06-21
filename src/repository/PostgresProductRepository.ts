import {Op} from 'sequelize';
import {CommonRepository} from './CommonRepository';
import {
  Gallery, Catalog, Location, Product,
  BusinessHour, Booking, BookingDetail, Business, Event, EventSchedule} from '../util/Database';
import {SearchFilter} from '../dto/SearchFilter';
import {SearchFilterBooking} from '../dto/SearchFilterBooking';
import {getHourFromTime} from '../util/Utils';

/**
 * s
 */
export class PostgresProductRepository extends CommonRepository {
  /**
   * s
   * @param {object} object
   * @return {response} response
   */
  async create(object: Product) {
    let response;
    try {
      response = await Product.create(object, {
        include: Gallery,
      });
      return response;
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
  async getOne(id: number) {
    let result;
    try {
      result = await Product.findByPk(id, {
        include: Gallery,
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
* @param {SearchFilter} searchFilter
* @return {response} response
*/
  async getOneSchedules(id: number, searchFilter: SearchFilterBooking) {
    let result;
    const dateReservation = `${searchFilter.bookingDate}`;
    try {
      result = await Product.findByPk(id);
      const searchBusinessHour = await BusinessHour.findAll(
          {
            where: {
              locationId: result!.locationId,
              isActive: true,
            },
            attributes: [
              'id', 'day', 'startTime', 'endTime',
            ],
          },
      );
      const searchBookings = await BookingDetail.findAll(
          {
            where: {
              reservationDate: dateReservation,
              productId: result!.id,
            },
            attributes: ['startTime', 'endTime'],
            include: [
              {
                model: Booking,
                where: {
                  statusId: {[Op.not]: 32}, // CANCELADO
                  locationId: result!.locationId,
                },
                attributes: [],
              },
            ],
          },
      );
      const searchEvent = await Event.findAll(
          {
            where: {
              locationId: result!.locationId,
              startDate: {[Op.lte]: dateReservation},
              endDate: {[Op.gte]: dateReservation},
            },
          },
      );
      const events = searchEvent.map(((resp) => resp.id));
      const searchEventSchedules = await EventSchedule.findAll(
          {
            where: {eventId: events},
          },
      );

      const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
      const d = new Date(dateReservation);
      const dayName = days[d.getDay()];
      const filterBusinessHour = searchBusinessHour.filter((businessHour) => businessHour.day === dayName);
      const collectionBusinessHourMobile = [];
      if (filterBusinessHour.length > 0) {
        const startTimeBusinesHour = getHourFromTime(filterBusinessHour[0].getDataValue('startTime'));
        const endTimeBusinesHour = getHourFromTime(filterBusinessHour[0].getDataValue('endTime'));
        const rangeBusinessHour: number = endTimeBusinesHour - startTimeBusinesHour;
        for (let i = 0; i < rangeBusinessHour; i++) {
          const setTimeValue: number = startTimeBusinesHour + i;
          let setTimeTemp: string = setTimeValue.toString();
          if (setTimeTemp.length === 1) {
            setTimeTemp = `0${setTimeValue}`;
          }
          collectionBusinessHourMobile.push({
            time: `${setTimeTemp}:00`,
            value: `${setTimeValue}`,
            isReserved: true,
          });
        }
      }
      const collectionBookingReserved = [];
      if (searchBookings !== null && searchBookings.length > 0) {
        for (const booking of searchBookings) {
          const startTimeBooking = getHourFromTime(booking.startTime);
          const endTimeBooking = getHourFromTime(booking.endTime);
          const rangeBooking: number = endTimeBooking - startTimeBooking;
          if (rangeBooking === 1) {
            collectionBookingReserved.push({
              startTime: `${booking.startTime.slice(0, 5)}`,
              endTime: `${booking.endTime.slice(0, 5)}`,
            });
          } else {
            for (let i = 0; i < rangeBooking; i++) {
              collectionBookingReserved.push({
                startTime: `${startTimeBooking + i}:00`,
                endTime: `${startTimeBooking + i + 1}:00`,
              });
            }
          }
        }
      }
      const filterEventDay= searchEventSchedules.filter((dayEvent) => dayEvent.day === dayName);
      if (filterEventDay !== null && filterEventDay.length > 0) {
        for (const event of filterEventDay) {
          const startTimeEvent = getHourFromTime(event.startTime);
          const endTimeEvent = getHourFromTime(event.endTime);
          const rangeEvent: number = endTimeEvent - startTimeEvent;
          if (rangeEvent === 1) {
            collectionBookingReserved.push({
              startTime: `${event.startTime.slice(0, 5)}`,
              endTime: `${event.endTime.slice(0, 5)}`,
            });
          } else {
            for (let i = 0; i < rangeEvent; i++) {
              const startTemp= `${startTimeEvent + i}`;
              const endTemp=`${startTimeEvent + i + 1}`;
              collectionBookingReserved.push({
                startTime: `${startTemp.length==1?`0${startTemp}`:startTemp}:00`,
                endTime: `${endTemp.length==1?`0${endTemp}`:endTemp}:00`,
              });
            }
          }
        }
      }

      for (const businessHour of collectionBusinessHourMobile) {
        const responseFilter = collectionBookingReserved.filter(
            (resultBooking) => businessHour.time === resultBooking.startTime);
        if (responseFilter.length > 0) {
          businessHour.isReserved = true;
        } else {
          businessHour.isReserved = false;
        }
      }
      let returnedTarget: any = Object.assign(result?.toJSON(), {schedules: [], bookings: [], bookingsMobile: []});
      returnedTarget.schedules = searchBusinessHour || [];
      returnedTarget.bookings = searchBookings && collectionBookingReserved || [];
      returnedTarget.bookingsMobile = collectionBusinessHourMobile || [];
      if (!result) {
        returnedTarget = {message: `Document ${id} Not Found.`, statusCode: 404};
      }
      return returnedTarget;
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
  async update(object: Product) {
    let response;
    try {
      const updatedObject = await Product.update(object, {
        where: {id: object.id},
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
   * @param {SearchFilter} searchFilter
   * @return {number} sportId
   */
  async findAllByPaginates(searchFilter: SearchFilter) {
    let result;
    try {
      const {page, limit, filter} = searchFilter!;
      const offset = (page - 1) * limit;
      if (filter == null) {
        result = await Product.findAndCountAll({
          limit, offset,
          include: [
            {
              model: Catalog,
              required: true,
              as: 'sport',
              attributes: ['id', 'name'],
            },
            {
              model: Location,
              required: true,
              as: 'location',
              attributes: ['id', 'sector'],
              include: [{
                model: Business,
                as: 'business',
                attributes: ['id', 'firstName', 'lastName', 'tradename'],

              },
              ],
            },
          ],
        });
      } else {
        result = await Product.findAndCountAll({
          limit,
          offset,
          where: {
            [Op.or]: [
              {sku: {[Op.iLike]: `%${filter}%`}},
            ],
          },
          include: [
            {
              model: Catalog,
              required: true,
              as: 'sport',
              attributes: ['id', 'name'],
              // where: {
              //   [Op.or]: [
              //     {name: {[Op.iLike]: `%${filter}%`}},
              //   ],
              // },
            },
            {
              model: Location,
              required: true,
              as: 'location',
              attributes: ['id', 'sector'],
              // where: {
              //   [Op.or]: [
              //     {sector: {[Op.iLike]: `%${filter}%`}},
              //   ],
              // },
              include: [{
                model: Business,
                required: true,
                as: 'business',
                attributes: ['id', 'firstName', 'lastName', 'tradename'],
                // where: {
                //   [Op.or]: [
                //     {tradename: {[Op.iLike]: `%${filter}%`}},
                //   ],
                // },
              },
              ],
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
      console.log(error);
      throw error;
    }
  };
  /**
   * s
   * @param {string} emailBusiness
   * @param {SearchFilter} searchFilter
   * @return {number} sportId
   */
  async findAllByBusinessPaginates(emailBusiness: string, searchFilter: SearchFilter) {
    let result;
    try {
      const searchBusiness = await Business.findOne({
        where: {email: emailBusiness},
      });
      const {page, limit, filter} = searchFilter!;
      const offset = (page - 1) * limit;
      if (filter == null) {
        result = await Product.findAndCountAll({
          limit, offset,
          include: [
            {
              model: Catalog,
              required: true,
              as: 'sport',
              attributes: ['id', 'name'],
            },
            {
              model: Location,
              required: true,
              as: 'location',
              where: {businessId: searchBusiness?.id},
              attributes: ['id', 'sector'],
              include: [{
                model: Business,
                as: 'business',
                attributes: ['id', 'firstName', 'lastName'],

              },
              ],
            },
          ],
        });
      } else {
        result = await Product.findAndCountAll({
          limit,
          offset,
          where: {
            [Op.or]: [
              {sku: {[Op.iLike]: `%${filter}%`}},
            ],
          },
          include: [
            {
              model: Catalog,
              required: false,
              as: 'sport',
              attributes: ['id', 'name'],
              where: {
                [Op.or]: [
                  {name: {[Op.iLike]: `%${filter}%`}},
                ],
              },
            },
            {
              model: Location,
              required: false,
              as: 'location',
              where: {
                businessId: searchBusiness?.id,
                [Op.or]: [
                  {sector: {[Op.iLike]: `%${filter}%`}},
                ],
              },
              attributes: ['id', 'sector'],
              include: [{
                model: Business,
                as: 'business',
                required: false,
                attributes: ['id', 'firstName', 'lastName', 'tradename'],
                where: {
                  [Op.or]: [
                    {tradename: {[Op.iLike]: `%${filter}%`}},
                  ],
                },
              },
              ],
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
      console.log(error);
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
      result = await Product.findAndCountAll({
        limit,
        offset,
        where: {sportId: sportId},
        include: [
          {
            model: Location,
            required: true,
            as: 'location',
            attributes: ['id', 'sector'],
          },
          {
            model: Catalog,
            required: true,
            as: 'sport',
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
      console.log(error);
      throw error;
    }
  };

  /**
   * s
   * @param {string} emailBusiness
   * @param {string} sportId
   * @param {SearchFilter} searchFilter
   * @return {string} result
   */
  async findAllBySportIdAndBusinessPaginates(emailBusiness: string,
      sportId: number | null, searchFilter: SearchFilter) {
    let result;
    try {
      const searchBusiness = await Business.findOne({
        where: {email: emailBusiness},
      });
      const {page, limit} = searchFilter!;
      const offset = (page - 1) * limit;
      result = await Product.findAndCountAll({
        limit,
        offset,
        where: {sportId: sportId},
        include: [
          {
            model: Location,
            required: true,
            as: 'location',
            attributes: ['id', 'sector'],
            where: {businessId: searchBusiness?.id},
          },
          {
            model: Catalog,
            required: true,
            as: 'sport',
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
      console.log(error);
      throw error;
    }
  };

  /**
   * s
   * @param {string} sportId
   * @param {string} locationId
   * @param {SearchFilter} searchFilter
   * @return {string} result
   */
  async findSportByIdLocationPaginates(sportId: number, locationId: number | null, searchFilter: SearchFilter) {
    let result;
    try {
      const {page, limit} = searchFilter!;
      const offset = (page - 1) * limit;
      result = await Product.findAndCountAll({
        limit,
        offset,
        where: {sportId: sportId, locationId: locationId},
        include: [
          {
            model: Location,
            required: true,
            as: 'location',
            attributes: ['id', 'sector'],
          },
          {
            model: Catalog,
            required: true,
            as: 'sport',
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
      console.log(error);
      throw error;
    }
  };

  /**
   * s
   * @param {string} emailBusiness
   * @param {string} sportId
   * @param {string} locationId
   * @param {SearchFilter} searchFilter
   * @return {string} result
   */
  async findSportByIdLocationBusinessPaginates(emailBusiness: string,
      sportId: number | null, locationId: number | null, searchFilter: SearchFilter) {
    let result;
    try {
      const searchBusiness = await Business.findOne({
        where: {email: emailBusiness},
      });
      const {page, limit} = searchFilter!;
      const offset = (page - 1) * limit;
      result = await Product.findAndCountAll({
        limit,
        offset,
        where: {sportId: sportId, locationId: locationId},
        include: [
          {
            model: Location,
            required: true,
            as: 'location',
            attributes: ['id', 'sector'],
            where: {businessId: searchBusiness?.id},
          },
          {
            model: Catalog,
            required: true,
            as: 'sport',
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
      console.log(error);
      throw error;
    }
  };
  /**
   * s
   * @param {string} locationId
   * @param {SearchFilter} searchFilter
   * @return {string} result
   */
  async findAllByLocationIdPaginates(locationId: number | null, searchFilter: SearchFilter) {
    let result;
    try {
      const {page, limit} = searchFilter!;
      const offset = (page - 1) * limit;
      result = await Product.findAndCountAll({
        limit,
        offset,
        where: {locationId: locationId},
        include: [
          {
            model: Location,
            required: true,
            as: 'location',
            attributes: ['id', 'sector'],
          },
          {
            model: Catalog,
            required: true,
            as: 'sport',
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
      console.log(error);
      throw error;
    }
  }
}
