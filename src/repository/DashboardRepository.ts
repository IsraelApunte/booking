import moment from 'moment';
import {SearchFilterDashboard} from '../dto/SearchFilterDashboard';
import {Business, Database} from '../util/Database';
import {CommonRepository} from './CommonRepository';

/**
 * s
 */
export class DashboardRepository extends CommonRepository {
  /**
   * s
   * @param {SearchFilterDashboard} searchFilter
   * @return {response} response
   */
  async getQuantityBooking(searchFilter: SearchFilterDashboard) {
    try {
      const format1 = 'YYYY-MM-DD HH:mm:ss';
      const startDateD = moment(searchFilter.startDate).format(format1);
      const endDateD = moment(searchFilter.endDate).format(format1);

      const result = {bookingStatusResume: [], bookingByLocationResume: [], bookingBySourceApp: []};
      const [results1] = await Database.query(`
        select status_id as statusId, catalog.name as status, 
        count(status_id) as bookingNumber, sum(booking.total) as bookingTotalSales
        from booking 
        LEFT OUTER JOIN catalog ON booking.status_id = catalog.id
        WHERE emission_date  between '${startDateD}' AND '${endDateD}'
        group by status_id, catalog.name
      `);

      const [results2] = await Database.query(`
      select business.id as businessId, tradename as tradename, location.id as locationId,
      sector, catalog.id as sportId, name, cast(count(booking.id) as INTEGER) as bookingNumber,
      sum(booking.total) bookingTotalSales,sum(booking.total)*(0.05) commission
      from business
      RIGHT OUTER JOIN location ON business.id = location.business_id
      RIGHT OUTER JOIN booking ON location.id = booking.location_id
      RIGHT OUTER JOIN booking_detail ON booking.id = booking_detail.booking_id
      LEFT OUTER JOIN product ON booking_detail.product_id = product.id
      LEFT OUTER JOIN catalog ON product.sport_id = catalog.id
      WHERE emission_date  between  '${startDateD}' AND '${endDateD}'
      group by business.id, tradename, location.id, sector, catalog.id
      order by business.id, location.id
      `);

      const [results3] = await Database.query(`
      select source_app, cast(count(booking.id) as INTEGER) as bookingNumber , 
      sum(booking.total) bookingTotalSales,
      sum(booking.total)*(0.05) commission  from booking 
      RIGHT OUTER JOIN booking_detail ON booking.id = booking_detail.booking_id
      WHERE emission_date  between '${startDateD}' AND '${endDateD}'
      group by source_app
      `);
      result.bookingStatusResume = results1 as [];
      result.bookingByLocationResume = results2 as [];
      result.bookingBySourceApp = results3 as [];
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  /**
   * s
   * @param {string} email
   * @param {SearchFilterDashboard} searchFilter
   * @return {response} response
   */
  async getQuantityBookingByBusiness(email: string, searchFilter: SearchFilterDashboard) {
    try {
      const searchBusiness = await Business.findOne({
        where: {email: email},
      });
      const format1 = 'YYYY-MM-DD HH:mm:ss';
      const startDateD = moment(searchFilter.startDate).format(format1);
      const endDateD = moment(searchFilter.endDate).format(format1);
      const result = {bookingStatusResume: [], bookingByLocationResume: [], bookingBySourceApp: []};
      const [results1] = await Database.query(`
        select status_id as statusId, catalog.name as status, 
        count(status_id) as bookingNumber, sum(booking.total) as bookingTotalSales,source_app, 
        sum(booking.total)*(0.05) commission
        from booking 
        LEFT OUTER JOIN catalog ON booking.status_id = catalog.id
        LEFT OUTER JOIN location ON location.id = booking.location_id
        where location.business_id = ${searchBusiness!.id} and emission_date  between '${startDateD}' AND '${endDateD}'
        group by status_id, catalog.name ,source_app     
      `);

      const [results2] = await Database.query(`
        select location.id as locationId, sector, catalog.id as sportId, 
        name, cast(count(booking.id) as INTEGER) as bookingNumber, sum(booking.total) bookingTotalSales,
        sum(booking.total)*(0.05) commission
        from location
        RIGHT OUTER JOIN booking ON location.id = booking.location_id
        RIGHT OUTER JOIN booking_detail ON booking.id = booking_detail.booking_id
        LEFT OUTER JOIN product ON booking_detail.product_id = product.id
        LEFT OUTER JOIN catalog ON product.sport_id = catalog.id
        where location.business_id = ${searchBusiness!.id} and booking.status_id = 33 
        and emission_date between '${startDateD}' AND '${endDateD}'
        group by location.id, sector, catalog.id
        order by location.id
      `);

      const [results3] = await Database.query(`
      select source_app, cast(count(booking.id) as INTEGER) as bookingNumber , 
      sum(booking.total) bookingTotalSales,
      sum(booking.total)*(0.05) commission  from booking 
      RIGHT OUTER JOIN booking_detail ON booking.id = booking_detail.booking_id
      LEFT OUTER JOIN location ON location.id = booking.location_id
      where location.business_id = ${searchBusiness!.id} and emission_date  between '${startDateD}' AND '${endDateD}'
      group by source_app
      `);
      result.bookingStatusResume = results1 as [];
      result.bookingByLocationResume = results2 as [];
      result.bookingBySourceApp = results3 as [];
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

