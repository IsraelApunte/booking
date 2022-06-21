import {Association, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin, DataTypes, Model, Sequelize,
} from 'sequelize';
import Event from './Event';

/**
 * Entity EventSchedule
 */
export default class EventSchedule extends Model {
  eventId!:number;
  startTime!: string;
  endTime!: string;
  day!:string;

  // Event association methods
  public createEvent!: BelongsToCreateAssociationMixin<Event>
  public getEvent!: BelongsToGetAssociationMixin<Event>
  public setEvent!: BelongsToSetAssociationMixin<Event, number>

  // Populated for inclusions
  public readonly event?: Event

  public static associations: {
    Event: Association<EventSchedule, Event>
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
      'eventId': {
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
      'isActive': {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {sequelize, modelName: 'eventSchedule', tableName: 'event_schedule'});
  }
}
