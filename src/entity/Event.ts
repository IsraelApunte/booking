import {Association, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin, DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, Sequelize,
} from 'sequelize';
import Location from './Location';
import Business from './Business';
import Product from './Product';
import EventSchedule from './EventSchedule';

/**
 * Entity Event
 */
export default class Event extends Model {
  id!: number;
  businessId!: number;
  locationId!:number;
  startDate!: string;
  endDate!: string;
  // Event association methods
  public createLocation!: BelongsToCreateAssociationMixin<Location>
  public getLocation!: BelongsToGetAssociationMixin<Location>
  public setLocation!: BelongsToSetAssociationMixin<Location, number>

  // Business association methods
  public createBusiness!: BelongsToCreateAssociationMixin<Business>
  public getBusiness!: BelongsToGetAssociationMixin<Business>
  public setBusiness!: BelongsToSetAssociationMixin<Business, number>

  // Product association methods
  public createProduct!: BelongsToCreateAssociationMixin<Product>
  public getProduct!: BelongsToGetAssociationMixin<Product>
  public setProduct!: BelongsToSetAssociationMixin<Product, number>

  // EventSchedule association methods
  public addEventSchedule!: HasManyAddAssociationMixin<EventSchedule, number>
  public addEventSchedulees!: HasManyAddAssociationsMixin<EventSchedule, number>
  public countEventSchedulees!: HasManyCountAssociationsMixin
  public createEventSchedule!: HasManyCreateAssociationMixin<EventSchedule>
  public getEventSchedulees!: HasManyGetAssociationsMixin<EventSchedule>
  public hasEventSchedule!: HasManyHasAssociationMixin<EventSchedule, number>
  public hasEventSchedulees!: HasManyHasAssociationsMixin<EventSchedule, number>
  public removeEventSchedule!: HasManyRemoveAssociationMixin<EventSchedule, number>
  public removeEventSchedulees!: HasManyRemoveAssociationsMixin<EventSchedule, number>
  public setEventSchedulees!: HasManySetAssociationsMixin<EventSchedule, number>

  // Populated for inclusions
  public readonly location?: Location
  public readonly business?: Business
  public readonly product?: Product
  public readonly eventSchedules?: EventSchedule[]

  public static associations: {
    location: Association<Event, Location>
    business: Association<Event, Business>
    product: Association<Event, Product>
    eventSchedules: Association<Event, EventSchedule>
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
      'name': {
        type: DataTypes.STRING,
      },
      'startDate': {
        type: DataTypes.DATE,
      },
      'endDate': {
        type: DataTypes.DATE,
      },
      'locationId': {
        type: DataTypes.INTEGER,
      },
      'productId': {
        type: DataTypes.INTEGER,
      },
      'businessId': {
        type: DataTypes.INTEGER,
      },
      'isActive': {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {sequelize, modelName: 'event'});
  }
}
