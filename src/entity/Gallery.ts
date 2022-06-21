import {Association, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin, DataTypes, Model, Sequelize} from 'sequelize';
import Product from './Product';


/**
 * Entity Gallery
 */
export default class Gallery extends Model {
  image!: string;
  productId!: number;

  // Product association methods
  public createProduct!: BelongsToCreateAssociationMixin<Product>
  public getProduct!: BelongsToGetAssociationMixin<Product>
  public setProduct!: BelongsToSetAssociationMixin<Product, number>

  // Populated for inclusions
  public readonlyProduct?:Product

  public static associations: {
     Product: Association<Gallery, Product>
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
      'productId': {
        type: DataTypes.INTEGER,
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
    {sequelize, modelName: 'gallery'});
  }
}
// Gallery.belongsTo(Product, {foreignKey: 'productId'});
