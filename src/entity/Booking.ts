import {Association, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin, DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, Sequelize} from 'sequelize';
import BookingDetail from './BookingDetail';
import Catalog from './Catalog';
import Customer from './Customer';
import Location from './Location';

/**
 * Entity Booking
 */
export default class Booking extends Model {
  id!: number;
  businessId!: number;
  customerId!: number;
  statusId!: number;
  bookingNumber!: string;
  totalPrice!: number;
  subtotalPrice!: number;
  totalIva!: number;
  totalDiscount!: number;
  bookingDetails!:BookingDetail[];
  paymentImage!: string;
  emissionDate!:string;
  locationId!: number;
  customerName!: string;
  identificationNumber!: string;
  email!: string;
  mobile!: string;
  address!: string;
  isPaid!: boolean;
  paymentDate!: string;
  emailWasSent!:boolean;
  paymentMethodId!:number;
  total!:number;
  iva!:number;
  subtotal!:number;
  sourceApp!:string;
  transactionId!:number;
  payphoneCommission!: number;

  // Catalog association methods
  public createCatalog!: BelongsToCreateAssociationMixin<Catalog>
  public getCatalog!: BelongsToGetAssociationMixin<Catalog>
  public setCatalog!: BelongsToSetAssociationMixin<Catalog, number>

  // Customer association methods
  public createCustomer!: BelongsToCreateAssociationMixin<Customer>
  public getCustomer!: BelongsToGetAssociationMixin<Customer>
  public setCustomer!: BelongsToSetAssociationMixin<Customer, number>

  // BookingDetail association methods
  public addBookingDetail!: HasManyAddAssociationMixin<BookingDetail, number>
  public addBookingDetailes!: HasManyAddAssociationsMixin<BookingDetail, number>
  public countBookingDetailes!: HasManyCountAssociationsMixin
  public createBookingDetail!: HasManyCreateAssociationMixin<BookingDetail>
  public getBookingDetailes!: HasManyGetAssociationsMixin<BookingDetail>
  public hasBookingDetail!: HasManyHasAssociationMixin<BookingDetail, number>
  public hasBookingDetailes!: HasManyHasAssociationsMixin<BookingDetail, number>
  public removeBookingDetail!: HasManyRemoveAssociationMixin<BookingDetail, number>
  public removeBookingDetailes!: HasManyRemoveAssociationsMixin<BookingDetail, number>
  public setBookingDetailes!: HasManySetAssociationsMixin<BookingDetail, number>

  // Populated for inclusions
  public readonly Catalog?: Catalog
  public readonly Customer?: Customer
  // public readonly bookingDetails?: BookingDetail[]

  public static associations: {
    Catalog: Association<Booking, Catalog>
    Customer: Association<Booking, Customer>
    bookingDetails: Association<Booking, BookingDetail>
    Location: Association<Booking, Location>
  }

  /**
   * s
   * @param {Sequelize} sequelize
   */
  public static initialize(sequelize: Sequelize) {
    this.init({
      'id': {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      'customerId': {
        type: DataTypes.INTEGER,
      },
      'statusId': {
        type: DataTypes.INTEGER,
      },
      'emissionDate': {
        type: DataTypes.DATE,
      },
      'bookingNumber': {
        type: DataTypes.STRING,
      },
      'total': {
        type: DataTypes.DOUBLE,
      },
      'subtotal': {
        type: DataTypes.DOUBLE,
      },
      'iva': {
        type: DataTypes.DOUBLE,
      },
      'percentageIva': {
        type: DataTypes.DOUBLE,
      },
      'paymentCode': {
        type: DataTypes.STRING,
      },
      'paymentImage': {
        type: DataTypes.STRING,
      },
      'customerName': {
        type: DataTypes.STRING,
      },
      'identificationNumber': {
        type: DataTypes.STRING,
      },
      'email': {
        type: DataTypes.STRING,
      },
      'emailWasSent': {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      'locationId': {
        type: DataTypes.INTEGER,
      },
      'mobile': {
        type: DataTypes.STRING,
      },
      'address': {
        type: DataTypes.STRING,
      },
      'isActive': {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      'bankAccountId': {
        type: DataTypes.INTEGER,
      },
      'sourceApp': {
        type: DataTypes.STRING,
      },
      'isPaid': {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      'paymentDate': {
        type: DataTypes.DATE,
      },
      'paymentMethodId': {
        type: DataTypes.INTEGER,
      },
      'transactionId': {
        type: DataTypes.INTEGER,
      },
      'reschedule': {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      'payphoneCommission': {
        type: DataTypes.DOUBLE,
      },
      'percentagePayphoneCommission': {
        type: DataTypes.DOUBLE,
      },
      'creationUser': {
        type: DataTypes.STRING,
      },
      'updateUser': {
        type: DataTypes.STRING,
      },
      'creationDate': {
        type: DataTypes.DATE,
        defaultValue: new Date().toISOString(),
      },
      'updateDate': {
        type: DataTypes.DATE,
      },
    },
    {sequelize, modelName: 'booking'});
  }
}

