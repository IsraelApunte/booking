import {Model, Sequelize, DataTypes} from 'sequelize';


/**
 * Entity Catalog
 */
export default class Catalog extends Model {
  name!:string;
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
        allowNull: false,
      },
      'code': {
        type: DataTypes.STRING,
      },
      'parentId': {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      'image': {
        type: DataTypes.STRING,
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
    {sequelize, modelName: 'catalog'});
  }
}


