import {PaymentVerifyRepository} from '../repository/PaymentVerifyRepository';

/**
 * Administration Booking
 */
export class PaymentVerifyService {
  /**
   * Find all with pagination
   * @param {SearchFilter} searchFilter
   */
  async find(): Promise<any> {
    try {
      const paymentVerifiyRepository = new PaymentVerifyRepository();
      return await paymentVerifiyRepository.findAllPaymentVerify();
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
}
