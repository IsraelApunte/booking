import {Model, Sequelize, DataTypes} from 'sequelize';


/**
 * Entity Banner
 */
export default class Banner extends Model {
  id!: number;
  imageDesktop!: string;
  imageTablet!: string;
  imageMobile!: string;
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
      'imageDesktop': {
        type: DataTypes.STRING,
      },
      'imageTablet': {
        type: DataTypes.STRING,
      },
      'imageMobile': {
        type: DataTypes.STRING,
      },
      'url': {
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
    {sequelize, modelName: 'banner'});
  }
}


