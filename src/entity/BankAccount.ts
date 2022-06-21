import {
  BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin, DataTypes, Model, Sequelize,
} from 'sequelize';
import Catalog from './Catalog';

/**
 * Entity BankAccount
 */
export default class BankAccount extends Model {
  businessId!: number;
  // Catalog association methods
  public createCatalog!: BelongsToCreateAssociationMixin<Catalog>
  public getCatalog!: BelongsToGetAssociationMixin<Catalog>
  public setCatalog!: BelongsToSetAssociationMixin<Catalog, number>


  // Populated for inclusions
  public readonly identificationType?: Catalog

  /* public static associations: {
   identificationTypeId: Association<BankAccount, Catalog>
 }*/
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
      'firstName': {
        type: DataTypes.STRING,
      },
      'lastName': {
        type: DataTypes.STRING,
      },
      'identificationTypeId': {
        type: DataTypes.INTEGER,
      },
      'identificationNumber': {
        type: DataTypes.STRING,
      },
      'bankNameId': {
        type: DataTypes.INTEGER,
      },
      'accountTypeId': {
        type: DataTypes.INTEGER,
      },
      'accountNumber': {
        type: DataTypes.STRING,
      },
      'email': {
        type: DataTypes.STRING,
      },
      'mobileCodeId': {
        type: DataTypes.INTEGER,
      },
      'mobile': {
        type: DataTypes.STRING,
      },
      'personTypeId': {
        type: DataTypes.INTEGER,
      },
      'businessId': {
        type: DataTypes.INTEGER,
      },
      'agentId': {
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
    {sequelize, modelName: 'bankAccount', tableName: 'bank_account'});
  }
}
