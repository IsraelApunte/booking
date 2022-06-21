import {DataTypes, Model, Sequelize} from 'sequelize';


/**
 * Entity BookingSequence
 */
export default class BookingSequence extends Model {
  id!: number;
  bookingNumber!: number;
  locationId!:number;
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
      'bookingNumber': {
        type: DataTypes.INTEGER,
      },
      'locationId': {
        type: DataTypes.INTEGER,
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
    {sequelize, modelName: 'bookingSequence', tableName: 'booking_sequence'});
  }
}
