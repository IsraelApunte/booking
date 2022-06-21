import {SearchFilterDashboard} from '../dto/SearchFilterDashboard';
import {DashboardRepository} from '../repository/DashboardRepository';
import {Authorization} from '../util/Utils';

/**
 * Administration Dashboard
 */
export class DashboardService {
  /**
   * Find all with pagination
   * @param {authorizationParams} authorizationParams
   * @param {SearchFilter} searchFilter
   */
  async getQuantityBooking(authorizationParams: Authorization, searchFilter: SearchFilterDashboard): Promise<any> {
    try {
      const {ROLE_USER_ALPELOTEO, ROLE_USER_BUSINESS} = process.env;
      const dashboardRepository = new DashboardRepository();
      if (authorizationParams.group === ROLE_USER_ALPELOTEO) {
        return await dashboardRepository.getQuantityBooking(searchFilter);
      }
      if (authorizationParams.group === ROLE_USER_BUSINESS) {
        return await dashboardRepository.getQuantityBookingByBusiness(authorizationParams.email, searchFilter);
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
}
