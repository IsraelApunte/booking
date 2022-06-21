
export interface Booking {
  id: number;
  customerId: number;
  statusId: number;
  date: string;
  expirationDate: string;
  bookingNumber: string;
  totalPrice: number;
  subtotalPrice: number;
  totalIva: number;
  totalDiscount: number;
  reference: string;
  paymentCode: string;
  paymentImage: string;
  isActive: boolean;
}

export interface BookingDetail {
  id: number;
  productId: number;
  bookingId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  subtotalPrice: number;
  iva: number;
  discountId: number;
  isActive: boolean;
}

