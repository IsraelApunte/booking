import {PostgresPaymentVerifyRepository} from '../repository/PostgresPaymentVerifyRepository';

/**
 * Administration Booking
 */
export class PostgresPaymentVerifyService {
  /**
   * Find all with pagination
   * @param {authorizationParams} authorizationParams
   * @param {number} id
   */
  async findPaymentVerify(): Promise<any> {
    try {
      const paymentVerifyRepository = new PostgresPaymentVerifyRepository();
      return await paymentVerifyRepository.findAll();
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Update Booking
   * @param {Booking} bookingIds
   */
  async updatePaymentsVerifyApproved(bookingIds: number[]) {
    try {
      const paymentVerifyRepository = new PostgresPaymentVerifyRepository();
      return await paymentVerifyRepository.updateApproved(bookingIds);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Update Booking
   * @param {Booking} bookingIds
   */
  async updatePaymentsVerifyCanceled(bookingIds: number[]) {
    try {
      const paymentVerifyRepository = new PostgresPaymentVerifyRepository();
      return await paymentVerifyRepository.updateCanceled(bookingIds);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
}
