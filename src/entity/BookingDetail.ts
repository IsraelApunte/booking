import {
  DataTypes, Model, Sequelize, BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, Association,
} from 'sequelize';
import Product from './Product';
import Booking from './Booking';

/**
 * Entity Booking-Detail
 */
export default class BookingDetail extends Model {
  id!:number;
  price!: number;
  total!: number;
  subtotal!: number;
  product!: Product;
  bookingId!: number;
  startTime!: string;
  endTime!: string;
  reservationDate!: string;

  // Product association methods
  public createProduct!: BelongsToCreateAssociationMixin<Product>
  public getProduct!: BelongsToGetAssociationMixin<Product>
  public setProduct!: BelongsToSetAssociationMixin<Product, number>

  // Booking association methods
  public createBooking!: BelongsToCreateAssociationMixin<Booking>
  public getBooking!: BelongsToGetAssociationMixin<Booking>
  public setBooking!: BelongsToSetAssociationMixin<Booking, number>

  // Populated for inclusions
  public readonly Product?: Product
  public readonly Booking?: Booking

  public static associations: {
    Product: Association<BookingDetail, Product>
    Booking: Association<BookingDetail, Booking>
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
      'productId': {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      'bookingId': {
        type: DataTypes.INTEGER,
      },
      'reservationDate': {
        type: DataTypes.DATE,
      },
      'startTime': {
        type: DataTypes.TIME,
      },
      'endTime': {
        type: DataTypes.TIME,
      },
      'quantity': {
        type: DataTypes.INTEGER,
      },
      'price': {
        type: DataTypes.DOUBLE,
      },
      'subtotal': {
        type: DataTypes.DOUBLE,
      },
      'iva': {
        type: DataTypes.DOUBLE,
      },
      'total': {
        type: DataTypes.DOUBLE,
      },
      'discountId': {
        type: DataTypes.DOUBLE,
      },
      'percentageDiscount': {
        type: DataTypes.DOUBLE,
      },
      'isActive': {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
    {sequelize, modelName: 'bookingDetail', tableName: 'booking_detail'});
  }
}
