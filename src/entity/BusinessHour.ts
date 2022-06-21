import {
  Association, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin, DataTypes, Model, Sequelize,
} from 'sequelize';
import Location from './Location';


/**
 * Entity BusinessHours
 */
export default class BusinessHour extends Model {
  locationId!: number;
  day!:string;

  // Location association methods
  public createLocation!: BelongsToCreateAssociationMixin<Location>
  public getLocation!: BelongsToGetAssociationMixin<Location>
  public setLocation!: BelongsToSetAssociationMixin<Location, number>

  // Populated for inclusions
  public readonly location?: Location

  public static associations: {
    location: Association<BusinessHour, Location>
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
      'locationId': {
        type: DataTypes.INTEGER,
      },
      'day': {
        type: DataTypes.STRING,
      },
      'startTime': {
        type: DataTypes.TIME,
      },
      'endTime': {
        type: DataTypes.TIME,
      },
      'code': {
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
    {sequelize, modelName: 'businessHour', tableName: 'business_hour'});
  }
}
