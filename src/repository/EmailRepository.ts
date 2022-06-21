import {SESRequest} from '../schemas/SESRequest';
import {sendEmail} from '../util/SESService';
import {readTemplate, readTemplatePayphone} from '../util/Utils';
import {Attachment} from 'nodemailer/lib/mailer';
const numeral = require('numeral');
/**
 * EmailRepository
 */
export class EmailRepository {
  /**
   * Generate PDF envio de email sin comision de Payphone
   * @param {Booking[]} searchBooking
   */
  async sendEmailBooking(searchBooking: any) {
    let rowIter = '';
    searchBooking.bookingDetails.forEach((row: any) => {
      const total = numeral(row.total);
      numeral.defaultFormat('0,0.00');
      rowIter =
        rowIter +
        `<tr>
        <td align="left">${row.product && row.product.sku ? row.product.sku : 'NA'} ${row.product.sport.name}</td>
        <td align="center">${row.reservationDate} ${row.startTime}-${row.endTime}</td>
        <td align="center">${row.quantity}</td>
        <td align="right">${row.product.price}</td>
        <td align="right">${total.format()}</td>
        </tr>`;
    });

    let template = await readTemplate();
    template = template.replace(
        /{{URL_BUCKET_NAME}}/g,
        `https://${process.env.BUCKET_PUBLIC_NAME}.s3.amazonaws.com/sources/logo.png`);
    const ecTime = new Date(searchBooking.emissionDate).toLocaleString('es-EC', {
      timeZone: 'America/Guayaquil',
    });

    // cabecera Booking
    template = template.replace(/{{ORDER_NUMBER}}/g, searchBooking.bookingNumber || '');
    template = template.replace(/{{ORDER_DATE}}/g, ecTime.toLocaleString());
    template = template.replace(/{{BUSINESS_LOCATION}}/g,
        `${searchBooking.location.sector}-${searchBooking.location.address}`.toUpperCase());
    template = template.replace(/{{BUSINESS_TRADENAME}}/g,
        `${searchBooking.location.business.tradename}`.toUpperCase());
    // template = template.replace(/{{ORDER_WIRE_TRANSFER}}/g,
    //     `Para continuar con el proceso de la reserva realizar el depósito o transferencia bancaria`);
    template = template.replace(/{{CUSTOMER_DOCUMENT_NUMBER}}/g, searchBooking!.identificationNumber || '');
    template = template.replace(/{{CUSTOMER_BUSINESS_NAME}}/g,
        `${searchBooking!.customerName}`.trim());
    // template = template.replace(/{{CUSTOMER_PHONE}}/g, searchBooking!.phone || '');
    template = template.replace(/{{CUSTOMER_MOBILE}}/g, searchBooking!.mobile || '');
    template = template.replace(/{{CUSTOMER_EMAIL}}/g, searchBooking!.email || '');
    template = template.replace(/{{CUSTOMER_ADDRESS}}/g, searchBooking!.address || '');
    template = template.replace(/{{TEMPLATE_URL_ALPELOTEO}}/g, process.env.URL_ALPELOTEO || '');

    // Booking
    const bookingSubtotal = numeral(searchBooking.subtotal);
    const bookingIVA = numeral(searchBooking.iva);
    const bookingTotal = numeral(searchBooking.total);
    const bookingDiscount = numeral(0.0);
    numeral.defaultFormat('0,0.00');
    template = template.replace(/{{BOOKING_DISCOUNT_PERCENTAJE}}/g, '0');
    template = template.replace(/{{BOOKING_PRODUCTS_DETAIL}}/g, rowIter);
    template = template.replace(/{{BOOKING_SUBTOTAL}}/g, bookingSubtotal.format());
    template = template.replace(/{{BOOKING_DISCOUNT}}/g, bookingDiscount.format());
    template = template.replace(/{{BOOKING_IVA_PERCENTAJE}}/g, process.env.PERCENTAGE_IVA ||'');
    template = template.replace(/{{BOOKING_IVA}}/g, bookingIVA.format());
    template = template.replace(/{{BOOKING_TOTAL}}/g, bookingTotal.format());

    // Business
    template = template.replace(/{{COMPANY_NAME}}/g, 'Al Peloteo');
    template = template.replace(/{{COMPANY_ADDRESS}}/g, 'Garcia Moreno N3-320 y 23 de Abril Sector Llano Grande');
    template = template.replace(/{{COMPANY_EMAIL}}/g, process.env.MAILING_FROM!);
    template = template.replace(/{{COMPANY_PHONES}}/g, '(+593)99 504 0729 - (+593)99 835 8654');

    const filename: Attachment[] = [{
      filename: `Comprobante ${searchBooking.bookingNumber}.pdf`,
      content: template,
    }];

    const emailRequest: SESRequest = {
      from: `alpeloteo.com <${process.env.MAILING_FROM}>`,
      to: [searchBooking?.email, searchBooking.location.business.email, `${process.env.MAILING_NOTIFICATION_TO}`],
      subject: `Orden generada #${searchBooking.bookingNumber}`,
      documentNumber: searchBooking.bookingNumber || '',
      emissionDate: ecTime.toLocaleString(),
      attachments: filename,
      html: null,
    };
    await sendEmail(emailRequest);
  }
  /**
   * Generate PDF comision payphone
   * @param {Booking} searchBooking
   */
  async sendEmailBookingPayphone(searchBooking: any) {
    let rowIter = '';
    searchBooking.bookingDetails.forEach((row: any) => {
      const total = numeral(row.total);
      numeral.defaultFormat('0,0.00');
      rowIter =
        rowIter +
        `<tr>
        <td align="left">${row.product && row.product.sku ? row.product.sku : 'NA'} ${row.product.sport.name}</td>
        <td align="center">${row.reservationDate} ${row.startTime}-${row.endTime}</td>
        <td align="center">${row.quantity}</td>
        <td align="right">${row.product.price}</td>
        <td align="right">${total.format()}</td>
        </tr>`;
    });

    let template = await readTemplatePayphone();
    template = template.replace(
        /{{URL_BUCKET_NAME}}/g,
        `https://${process.env.BUCKET_PUBLIC_NAME}.s3.amazonaws.com/sources/logo.png`);
    const ecTime = new Date(searchBooking.emissionDate).toLocaleString('es-EC', {
      timeZone: 'America/Guayaquil',
    });

    // cabecera Booking
    template = template.replace(/{{ORDER_NUMBER}}/g, searchBooking.bookingNumber || '');
    template = template.replace(/{{ORDER_DATE}}/g, ecTime.toLocaleString());
    template = template.replace(/{{BUSINESS_LOCATION}}/g,
        `${searchBooking.location.sector}-${searchBooking.location.address}`.toUpperCase());
    template = template.replace(/{{BUSINESS_TRADENAME}}/g, `${searchBooking.location.business.tradename}`
        .toUpperCase());
    // template = template.replace(/{{ORDER_WIRE_TRANSFER}}/g,
    //     `Para continuar con el proceso de la reserva realizar el depósito o transferencia bancaria`);
    template = template.replace(/{{CUSTOMER_DOCUMENT_NUMBER}}/g, searchBooking!.identificationNumber || '');
    template = template.replace(/{{CUSTOMER_BUSINESS_NAME}}/g,
        `${searchBooking!.customerName}`.trim());
    // template = template.replace(/{{CUSTOMER_PHONE}}/g, searchBooking!.phone || '');
    template = template.replace(/{{CUSTOMER_MOBILE}}/g, searchBooking!.mobile || '');
    template = template.replace(/{{CUSTOMER_EMAIL}}/g, searchBooking!.email || '');
    template = template.replace(/{{CUSTOMER_ADDRESS}}/g, searchBooking!.address || '');
    template = template.replace(/{{TEMPLATE_URL_ALPELOTEO}}/g, process.env.URL_ALPELOTEO || '');

    // Booking
    const bookingSubtotal = numeral(searchBooking.subtotal);
    const bookingIVA = numeral(searchBooking.iva);
    const bookingTotal = numeral(searchBooking.total);
    const bookingDiscount = numeral(0.0);
    const bookingPayphoneCommission= numeral(searchBooking.payphoneCommission);
    numeral.defaultFormat('0,0.00');
    template = template.replace(/{{BOOKING_DISCOUNT_PERCENTAJE}}/g, '0');
    template = template.replace(/{{BOOKING_PRODUCTS_DETAIL}}/g, rowIter);
    template = template.replace(/{{BOOKING_SUBTOTAL}}/g, bookingSubtotal.format());
    template = template.replace(/{{BOOKING_DISCOUNT}}/g, bookingDiscount.format());
    template = template.replace(/{{BOOKING_IVA_PERCENTAJE}}/g, process.env.PERCENTAGE_IVA ||'');
    template = template.replace(/{{BOOKING_IVA}}/g, bookingIVA.format());
    template = template.replace(/{{BOOKING_PERCENTAJE_PAYPHONE}}/g, process.env.PERCENTAGE_PAYPHONE_COMMISSION|| '');
    template = template.replace(/{{BOOKING_PAYPHONE_COMMISSION}}/g, bookingPayphoneCommission.format());
    template = template.replace(/{{BOOKING_TOTAL}}/g, bookingTotal.format());

    // Business
    template = template.replace(/{{COMPANY_NAME}}/g, 'Al Peloteo');
    template = template.replace(/{{COMPANY_ADDRESS}}/g, 'Garcia Moreno N3-320 y 23 de Abril Sector Llano Grande');
    template = template.replace(/{{COMPANY_EMAIL}}/g, process.env.MAILING_FROM!);
    template = template.replace(/{{COMPANY_PHONES}}/g, '(+593)99 504 0729 - (+593)99 835 8654');

    const filename: Attachment[] = [{
      filename: `Comprobante ${searchBooking.bookingNumber}.pdf`,
      content: template,
    }];

    const emailRequest: SESRequest = {
      from: `alpeloteo.com <${process.env.MAILING_FROM}>`,
      to: [searchBooking?.email, searchBooking.location.business.email, `${process.env.MAILING_NOTIFICATION_TO}`],
      subject: `Orden generada #${searchBooking.bookingNumber}`,
      documentNumber: searchBooking.bookingNumber || '',
      emissionDate: ecTime.toLocaleString(),
      attachments: filename,
      html: null,
    };
    await sendEmail(emailRequest);
  }
}
