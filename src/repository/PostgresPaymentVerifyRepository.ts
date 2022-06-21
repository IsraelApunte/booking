import {CommonRepository} from './CommonRepository';
import {Booking, BookingDetail, Business, Catalog, Location, Product} from '../util/Database';
import {Op} from 'sequelize';
/**
 * s
 */
export class PostgresPaymentVerifyRepository extends CommonRepository {
  /**
   * s
   * @return {response} response
   */
  async findAll() {
    let result;
    try {
      result = await Booking.findAll({
        order: [['emissionDate', 'DESC']],
        where: {
          paymentMethodId: 72,
          emailWasSent: false,
          transactionId: {[Op.not]: null},
        },
        include: [
          {
            model: BookingDetail,
            as: 'bookingDetails',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'sku', 'price'],
                include: [
                  {
                    model: Catalog,
                    as: 'sport',
                    attributes: ['id', 'name'],
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
          }],
      });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
  * s
  * @param {object} bookingApprovedIds
  * @return {response} response
  */
  async updateApproved(bookingApprovedIds: number[]) {
    let response;
    try {
      response = await Booking.update({statusId: 33, emailWasSent: true},
          {
            where: {
              id: bookingApprovedIds,
            },
          });
      response = !response ?
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
  * @param {object} bookingCanceledIds
  * @return {response} response
  */
  async updateCanceled(bookingCanceledIds: number[]) {
    let response;
    try {
      response = await Booking.update({statusId: 32},
          {
            where: {
              id: bookingCanceledIds,
            },
          });
      response = !response ?
        {message: 'Document can\'t be updated.', statusCode: 500} :
        {message: 'Document updated.'};
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
