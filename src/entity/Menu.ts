import {Model, Sequelize, DataTypes} from 'sequelize';


/**
 * Entity UserModule
 */
export default class Menu extends Model {
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
      'moduleName': {
        type: DataTypes.STRING,
        allowNull: false,
      },
      'moduleIcon': {
        type: DataTypes.STRING,
        allowNull: false,
      },
      'moduleRoute': {
        type: DataTypes.STRING,
        allowNull: false,
      },
      'roleId': {
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
    {sequelize, modelName: 'menu'});
  }
}


