import {Op} from 'sequelize';
import {SearchFilter} from '../dto/SearchFilter';
import {Booking, Business, Catalog, Customer, Location} from '../util/Database';
import {CommonRepository} from './CommonRepository';
/**
 * s
 */
export class CustomerRepository extends CommonRepository {
  /**
   * s
   * @param {object} object
   * @return {response} response
   */
  async create(object: Customer) {
    let response;
    try {
      response = await Customer.create(object);
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
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllByPaginates(searchFilter: SearchFilter) {
    let result;
    try {
      const {page, limit, filter} = searchFilter!;
      const offset = (page - 1) * limit;
      if (filter == null) {
        result = await Customer.findAndCountAll({
          limit, offset,
          include: [
            {
              model: Catalog,
              required: true,
              as: 'identificationType',
              attributes: ['id', 'name'],
            },
          ],
        });
      } else {
        result = await Customer.findAndCountAll({
          limit, offset,
          where: {
            [Op.or]: [
              {firstName: {[Op.iLike]: `%${filter}%`}},
              {lastName: {[Op.iLike]: `%${filter}%`}},
              {identificationNumber: {[Op.iLike]: `%${filter}%`}},
              {mobile: {[Op.iLike]: `%${filter}%`}},
              {email: {[Op.iLike]: `%${filter}%`}},
            ],
          },
          include: [
            {
              model: Catalog,
              required: true,
              as: 'identificationType',
              attributes: ['id', 'name'],
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

  /**
   * s
   * @param {string} emailBusiness
   * @param {SearchFilter} searchFilter
   * @return {response} response
   */
  async findAllByBusinessPaginates(emailBusiness: string, searchFilter: SearchFilter) {
    let result;
    try {
      const {page, limit, filter} = searchFilter!;
      const offset = (page - 1) * limit;
      // search business
      const searchBusiness = await Business.findOne({
        where: {email: emailBusiness},
      });
      // search locations of business
      const searchLocations = await Location.findAll({
        where: {businessId: searchBusiness!.id},
      });
      // list of objects de searchLocations solo necesitamos los id
      const locations = searchLocations.map(((resp) => resp.id));
      // search the bookings of the localitions belonging to a business grouped by customer
      const searchBookings = await Booking.findAll({
        attributes: ['customerId'],
        where: {locationId: locations},
        group: ['customerId'],
      });
      // list of objects de searchBookings solo necesitamos los customerId
      const bookings = searchBookings.map(((customer) => customer.customerId));
      // list customer
      if (filter == null) {
        result = await Customer.findAndCountAll({
          limit, offset,
          where: {id: bookings},
          include: [
            {
              model: Catalog,
              required: true,
              as: 'identificationType',
              attributes: ['id', 'name'],
            },
          ],
        });
      } else {
        result = await Customer.findAndCountAll({
          limit, offset,
          where: {
            [Op.or]: [
              {firstName: {[Op.iLike]: `%${filter}%`}},
              {lastName: {[Op.iLike]: `%${filter}%`}},
              {identificationNumber: {[Op.iLike]: `%${filter}%`}},
              {mobile: {[Op.iLike]: `%${filter}%`}},
              {email: {[Op.iLike]: `%${filter}%`}},
            ],
          },
          include: [
            {
              model: Catalog,
              required: true,
              as: 'identificationType',
              attributes: ['id', 'name'],
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

  /**
   * s
   * @param {string} emailCustomer
   * @param {number} id
   * @return {response} response
   */
  async getOneByCustomerProfile(emailCustomer: string) {
    let result;
    try {
      result = await Customer.findOne({
        where: {email: emailCustomer},
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
      result = await Customer.findByPk(id, {
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
      if (!result) {
        result = {message: `Document ${id} Not Found.`, statusCode: 404};
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
