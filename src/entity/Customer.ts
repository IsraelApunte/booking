import {
  Association, Model, Sequelize, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin, DataTypes, HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin,
} from 'sequelize';
import Catalog from './Catalog';
import Booking from './Booking';

/**
 * Entity Customer
 */
export default class Customer extends Model {
  id!: number;
  firstName!: string;
  lastName!: string;
  identificationNumber!: string;
  email!: string;
  mobile!: string;
  address!: string;
  phone!: string;
  mobileCodeId!:number;

  // Catalog association methods
  public createCatalog!: BelongsToCreateAssociationMixin<Catalog>
  public getCatalog!: BelongsToGetAssociationMixin<Catalog>
  public setCatalog!: BelongsToSetAssociationMixin<Catalog, number>

  // Booking association methods
  public addBooking!: HasManyAddAssociationMixin<Booking, number>
  public addBookinges!: HasManyAddAssociationsMixin<Booking, number>
  public countBookinges!: HasManyCountAssociationsMixin
  public createBooking!: HasManyCreateAssociationMixin<Booking>
  public getBookinges!: HasManyGetAssociationsMixin<Booking>
  public hasBooking!: HasManyHasAssociationMixin<Booking, number>
  public hasBookinges!: HasManyHasAssociationsMixin<Booking, number>
  public removeBooking!: HasManyRemoveAssociationMixin<Booking, number>
  public removeBookinges!: HasManyRemoveAssociationsMixin<Booking, number>
  public setBookinges!: HasManySetAssociationsMixin<Booking, number>

  // Populated for inclusions
  public readonly country?: Catalog
  public readonly Bookings?: Booking[]

  public static associations: {
    country: Association<Customer, Catalog>
    Bookings: Association<Customer, Booking>
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
      'firstName': {
        type: DataTypes.STRING,
      },
      'lastName': {
        type: DataTypes.STRING,
      },
      'identificationTypeId': {
        type: DataTypes.INTEGER,
      },
      'identificationNumber': {
        type: DataTypes.STRING,
      },
      'personTypeId': {
        type: DataTypes.INTEGER,
      },
      'birthday': {
        type: DataTypes.DATE,
      },
      'mobile': {
        type: DataTypes.STRING,
      },
      'phone': {
        type: DataTypes.STRING,
      },
      'email': {
        type: DataTypes.STRING,
      },
      'address': {
        type: DataTypes.STRING,
      },
      'mobileCodeId': {
        type: DataTypes.INTEGER,
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
    {sequelize, modelName: 'customer'});
  }
}

