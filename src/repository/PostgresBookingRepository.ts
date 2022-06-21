import {CommonRepository} from './CommonRepository';
import {
  Database, BookingDetail, Booking, Product,
  Customer, Catalog, BookingSequence, Business,
  Location,
  BankAccount,
} from '../util/Database';
import {Op} from 'sequelize';
import {SearchFilter} from '../dto/SearchFilter';
import {addPadLeft} from '../util/Utils';
// import moment from 'moment';
/**
 * s
 */
export class PostgresBookingRepository extends CommonRepository {
  /**
   * Generate Booking
   * @param {any} object
   */
  async create(object: Booking) {
    const t = await Database.transaction();
    let response;
    try {
      // let template = await readTemplate();
      const findNumberSequence = await BookingSequence.findOne({where: {locationId: object.locationId}});
      const orderNumber = ++findNumberSequence!.bookingNumber;
      await BookingSequence.update({bookingNumber: orderNumber},
          {where: {locationId: object.locationId}});
      const numberOrder = addPadLeft(orderNumber.toString(), 9);
      object.bookingNumber = numberOrder;

      // const searchCustomer = await Customer.findByPk(object.customerId, {
      //   transaction: t,
      // });
      // object.customerName = `${searchCustomer!.firstName} ${searchCustomer!.lastName}`;
      // object.identificationNumber = `${searchCustomer!.identificationNumber}`;
      // object.email = `${searchCustomer!.email}`;
      // object.mobile = `${searchCustomer!.mobile}`;
      // object.address = `${searchCustomer!.address}`;
      response = await Booking.create(object, {
        include: BookingDetail,
        transaction: t,
      });
      const searchBooking: any = await Booking.findByPk(response.id, {
        include: [
          {
            model: BookingDetail,
            as: 'bookingDetails',
            include: [
              {
                model: Product,
                as: 'product',
                include: [
                  {
                    model: Catalog,
                    as: 'sport',
                  },
                ],
              },
            ],
          },
          {
            model: Location,
            as: 'location',
            include: [
              {
                model: Business,
                as: 'business',
              },
            ],
          },
        ],
        transaction: t,
      });
      await t.commit();
      return {searchBooking};
    } catch (error) {
      console.error(error);
      await t.rollback();
      throw error;
    }
  }
  /**
   * Generate Booking
   * @param {string} email
   * @param {any} object
   */
  async createByBusiness(email: string, object: Booking) {
    let result;
    try {
      const searchLocation = await Location.findOne({
        where: {
          id: object.locationId,
        },
        include: [{
          model: Business,
          as: 'business',
          where: {
            email: email,
          },
        }],
      });
      if (searchLocation === null) {
        throw new Error(`No existe locationId ${object.locationId}`);
      }
      result = await this.create(object);
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
  async getOne(id: number) {
    let result;
    try {
      result = await Booking.findByPk(id, {
        include: [{
          model: Catalog,
          as: 'status',
          attributes: ['id', 'name'],
        },
        {
          model: BookingDetail,
          as: 'bookingDetails',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['sku', 'numberPlayers', 'isCovered'],
            include: [{
              model: Catalog,
              as: 'sport',
              attributes: ['id', 'name'],
            }],
          }],
        },
        {
          model: BankAccount,
          as: 'bankAccount',
        }],
      });
      if (!result) {
        result = await Booking.findByPk(id, {
          include: [{
            model: BookingDetail,
            as: 'bookingDetails',
            include: [{
              model: Product,
              as: 'product',
              include: [{
                model: Catalog,
                as: 'sport',
              }],
            }],
          }],
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
  async update(object: Booking) {
    const t = await Database.transaction();
    let response;
    try {
      const updatedObject = await Booking.update(object, {
        where: {
          id: object.id,
        },
        transaction: t,
      });
      const bookingDetails = object.bookingDetails;
      await BookingDetail.destroy({
        where: {
          bookingId: object.id,
        },
        transaction: t,
      });
      for (const bookingDetail of bookingDetails) {
        bookingDetail.bookingId = object.id;
        await BookingDetail.create(bookingDetail, {
          transaction: t,
        });
      }
      const searchBooking: any = await Booking.findByPk(object.id, {
        include: [
          {
            model: BookingDetail,
            as: 'bookingDetails',
            include: [
              {
                model: Product,
                as: 'product',
                include: [
                  {
                    model: Catalog,
                    as: 'sport',
                  },
                ],
              },
            ],
          },
          {
            model: Location,
            as: 'location',
            include: [
              {
                model: Business,
                as: 'business',
              },
            ],
          },
        ],
        transaction: t,
      });
      // const searchLocation = await Location.findOne({
      //   where: {
      //     id: object.locationId,
      //   },
      //   include: [{
      //     model: Business,
      //     as: 'business',
      //   }],
      //   transaction: t,
      // });
      response = {searchBooking};
      await t.commit();
      response = !updatedObject ?
        {message: 'Document can\'t be updated.', statusCode: 500} :
        Object.assign({message: 'Document updated.'}, response);
      return response;
    } catch (error) {
      console.error(error);
      await t.rollback();
      throw error;
    }
  }
  /**
  * s
  * @param {object} object
  * @return {response} response
  */
  async updatePayments(object: Booking[]) {
    let response;
    const t = await Database.transaction();
    try {
      for (const booking of object) {
        const id = booking.id;
        const bookingTmp: any = booking;
        delete bookingTmp.id;
        response = await Booking.update(bookingTmp, {
          where: {
            id: id,
          },
          transaction: t,
        });
      }
      await t.commit();
      response = !response ?
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
    const {page, limit, filter} = searchFilter!;
    const offset = (page - 1) * limit;
    if (filter == null) {
      result = await Booking.findAndCountAll({
        limit, offset,
        order: [['emissionDate', 'DESC']],
        include: [
          {
            model: Catalog,
            as: 'status',
            attributes: ['id', 'name'],
          },
          {
            model: Location,
            required: true,
            as: 'location',
            attributes: ['id', 'sector'],
            include: [{
              model: Business,
              required: true,
              as: 'business',
              attributes: ['id', 'firstName', 'lastName', 'tradename'],
            },
            ],
          },
        ],
      });
    } else {
      result = await Booking.findAndCountAll({
        limit,
        offset,
        order: [['emissionDate', 'DESC']],
        where: {
          [Op.or]: [
            // {emissionDate: {[Op.iLike]: `%${filter}%`}},
            {bookingNumber: {[Op.iLike]: `%${filter}%`}},
            {identificationNumber: {[Op.iLike]: `%${filter}%`}},
            {customerName: {[Op.iLike]: `%${filter}%`}},
          ],
        },
        include: [
          {
            model: Catalog,
            as: 'status',
            attributes: ['id', 'name'],
          },
          {
            model: Location,
            required: true,
            as: 'location',
            attributes: ['id', 'sector'],
            include: [{
              model: Business,
              required: true,
              as: 'business',
              attributes: ['id', 'firstName', 'lastName', 'tradename'],
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
  };
  /**
   * s
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllPaymentsByPaginates(searchFilter: SearchFilter) {
    let result;
    const {page, limit, businessId, filter, startDate, endDate} = searchFilter!;
    const offset = (page - 1) * limit;

    if (businessId !== null) {
      if (filter == null) {
        result = await Booking.findAndCountAll({
          limit, offset,
          order: [['emissionDate', 'DESC']],
          where: {
            isPaid: false,
          },
          include: {
            model: Location,
            where: {
              businessId: businessId,
            },
          },
        });
      } else {
        result = await Booking.findAndCountAll({
          limit,
          offset,
          order: [['emissionDate', 'DESC']],
          where: {
            isPaid: false,
            emissionDate: {
              [Op.lte]: new Date(endDate!).getTime(),
              [Op.gte]: new Date(startDate!).getTime(),
            },
            [Op.or]: [
              {customerName: {[Op.iLike]: `%${filter}%`}},
            ],
          },
          include: {
            model: Location,
            where: {
              businessId: businessId,
            },
          },
        });
      }
      if (startDate != null || endDate != null) {
        result = await Booking.findAndCountAll({
          limit, offset,
          order: [['emissionDate', 'DESC']],
          where: {
            isPaid: false,
            emissionDate: {
              [Op.lte]: new Date(endDate!).getTime(),
              [Op.gte]: new Date(startDate!).getTime(),
            },
          },
          include: {
            model: Location,
            where: {
              businessId: businessId,
            },
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
    } else {
      if (filter == null || startDate == null || endDate == null) {
        result = await Booking.findAndCountAll({
          limit, offset,
          order: [['emissionDate', 'DESC']],
          where: {
            isPaid: false,
          },
          include: {
            model: Location,
          },
        });
      } else {
        result = await Booking.findAndCountAll({
          limit,
          offset,
          order: [['emissionDate', 'DESC']],
          where: {
            isPaid: false,
            emissionDate: {
              [Op.lte]: new Date(endDate!).getTime(),
              [Op.gte]: new Date(startDate!).getTime(),
            },
            [Op.or]: [
              {customerName: {[Op.iLike]: `%${filter}%`}},
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
    }
  };
  /**
   * s
   * @param {string} emailBusiness
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllByBusinessPaginates(emailBusiness: string, searchFilter: SearchFilter) {
    let result;
    const {page, limit, filter} = searchFilter!;
    const offset = (page - 1) * limit;
    const searchBusiness = await Business.findOne({
      where: {email: emailBusiness},
    });
    if (filter == null) {
      result = await Booking.findAndCountAll({
        limit, offset,
        order: [['emissionDate', 'DESC']],
        include: [{
          model: Location,
          as: 'location',
          where: {businessId: searchBusiness!.id},
          include: [{
            model: Business,
            as: 'business',
          }],
        }],
      });
    } else {
      result = await Booking.findAndCountAll({
        limit,
        offset,
        order: [['emissionDate', 'DESC']],
        include: [{
          model: Location,
          as: 'location',
          where: {businessId: searchBusiness!.id},
          include: [{
            model: Business,
            as: 'business',
          }],
        }],
        where: {
          [Op.or]: [
            {customerName: {[Op.iLike]: `%${filter}%`}},
            {identificationNumber: {[Op.iLike]: `%${filter}%`}},
            {bookingNumber: {[Op.iLike]: `%${filter}%`}},
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
  /**
   * s
   * @param {string} emailCustomer
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllByCustomerPaginates(emailCustomer: string, searchFilter: SearchFilter) {
    let result;
    const {page, limit, filter} = searchFilter!;
    const offset = (page - 1) * limit;
    const searchCustomer = await Customer.findOne({
      where: {email: emailCustomer},
    });
    if (filter == null) {
      result = await Booking.findAndCountAll({
        limit, offset,
        order: [['emissionDate', 'DESC'], [BookingDetail, 'startTime', 'ASC']],
        include: [
          {
            model: Location,
            as: 'location',
            include: [{
              model: Business,
              as: 'business',
            }],
          },
          {
            model: Catalog,
            required: true,
            as: 'status',
            attributes: ['id', 'name'],
          },
          {
            model: BookingDetail,
            as: 'bookingDetails',
            include: [{
              model: Product,
              as: 'product',
              attributes: ['sku', 'sportId'],
              include: [
                {
                  model: Catalog,
                  as: 'sport',
                  attributes: ['name'],
                },
              ],
            },
            ],
          },
        ],
        where: {customerId: searchCustomer!.id},
      });
    } else {
      result = await Booking.findAndCountAll({
        limit,
        offset,
        order: [['emissionDate', 'DESC'], [BookingDetail, 'startTime', 'ASC']],
        include: [
          {
            model: Location,
            as: 'location',
            where: {
              [Op.or]: [{sector: {[Op.iLike]: `%${filter}%`}}],
            },
            include: [{
              model: Business,
              as: 'business',
            }],
          },
          {
            model: Catalog,
            required: true,
            as: 'status',
            attributes: ['id', 'name'],
          },
          {
            model: BookingDetail,
            as: 'bookingDetails',
            include: [{
              model: Product,
              as: 'product',
              attributes: ['sku', 'sportId'],
              include: [
                {
                  model: Catalog,
                  as: 'sport',
                  attributes: ['name'],
                },
              ],
            },
            ],
          },
        ],
        where: {customerId: searchCustomer!.id,
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
   * s
   * @param {number} businessId
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findByIdBusiness(businessId: number, searchFilter: SearchFilter) {
    let result;
    const {page, limit, filter, startDate, endDate} = searchFilter!;
    const offset = (page - 1) * limit;
    const searchBusiness = await Business.findOne({
      where: {id: businessId},
    });
    if (filter == null) {
      result = await Booking.findAndCountAll({
        where: {
          emissionDate: {
            [Op.lte]: new Date(endDate!).getTime(),
            [Op.gte]: new Date(startDate!).getTime(),
          },
        },
        limit, offset,
        include: [{
          model: Location,
          as: 'location',
          where: {businessId: searchBusiness!.id},
          include: [{
            model: Business,
            as: 'business',
          }],
        }],
      });
    } else {
      result = await Booking.findAndCountAll({
        limit,
        offset,
        include: [{
          model: Location,
          as: 'location',
          where: {businessId: searchBusiness!.id},
          include: [{
            model: Business,
            as: 'business',
          }],
        }],
        where: {
          emissionDate: {
            [Op.lte]: new Date(endDate!).getTime(),
            [Op.gte]: new Date(startDate!).getTime(),
          },
          [Op.or]: [
            {customerName: {[Op.iLike]: `%${filter}%`}},
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
