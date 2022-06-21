import {Model, Sequelize, DataTypes} from 'sequelize';


/**
 * Entity User
 */
export default class User extends Model {
  roleId!: number
  email!: string
  username!: string

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
      'username': {
        type: DataTypes.STRING,
        allowNull: false,
      },
      'fullname': {
        type: DataTypes.STRING,
      },
      'email': {
        type: DataTypes.STRING,
        allowNull: false,
      },
      'roleId': {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      'verifiedtermsandpolicies': {
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
    {sequelize, modelName: 'user', tableName: 'booking_user'});
  }
}


