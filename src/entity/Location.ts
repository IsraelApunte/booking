import {Association, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin, DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, Sequelize} from 'sequelize';
import Business from './Business';
import BusinessHour from './BusinessHour';
import Product from './Product';


/**
 * Entity Location
 */
export default class Location extends Model {
  id!: number;
  businessId!: number;

  // Business association methods
  public createBusiness!: BelongsToCreateAssociationMixin<Business>
  public getBusiness!: BelongsToGetAssociationMixin<Business>
  public setBusiness!: BelongsToSetAssociationMixin<Business, number>

  // BusinessHour association methods
  public addBusinessHour!: HasManyAddAssociationMixin<BusinessHour, number>
  public addBusinessHoures!: HasManyAddAssociationsMixin<BusinessHour, number>
  public countBusinessHoures!: HasManyCountAssociationsMixin
  public createBusinessHour!: HasManyCreateAssociationMixin<BusinessHour>
  public getBusinessHoures!: HasManyGetAssociationsMixin<BusinessHour>
  public hasBusinessHour!: HasManyHasAssociationMixin<BusinessHour, number>
  public hasBusinessHoures!: HasManyHasAssociationsMixin<BusinessHour, number>
  public removeBusinessHour!: HasManyRemoveAssociationMixin<BusinessHour, number>
  public removeBusinessHoures!: HasManyRemoveAssociationsMixin<BusinessHour, number>
  public setBusinessHoures!: HasManySetAssociationsMixin<BusinessHour, number>

  // Product association methods
  public addProduct!: HasManyAddAssociationMixin<Product, number>
  public addProductes!: HasManyAddAssociationsMixin<Product, number>
  public countProductes!: HasManyCountAssociationsMixin
  public createProduct!: HasManyCreateAssociationMixin<Product>
  public getProductes!: HasManyGetAssociationsMixin<Product>
  public hasProduct!: HasManyHasAssociationMixin<Product, number>
  public hasProductes!: HasManyHasAssociationsMixin<Product, number>
  public removeProduct!: HasManyRemoveAssociationMixin<Product, number>
  public removeProductes!: HasManyRemoveAssociationsMixin<Product, number>
  public setProductes!: HasManySetAssociationsMixin<Product, number>

  // Populated for inclusions
  public readonly business?: Business
  public readonly businessHours?: BusinessHour[]
  public readonly Products?: Product[]

  public static associations: {
      business: Association<Location, Business>
      Products: Association<Location, Product>
      businessHours: Association<Location, BusinessHour>
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
      'businessId': {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      'sector': {
        type: DataTypes.STRING,
      },
      'address': {
        type: DataTypes.STRING,
      },
      'latitude': {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      'longitude': {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      'isActive': {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      'hasParking': {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      'hasFoodBar': {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      'canWatchMatches': {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
    {sequelize, modelName: 'location'});
  }
}
