import {Association, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin, DataTypes, HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin,
  Model, Sequelize} from 'sequelize';
import {Business} from '../util/Database';
import Catalog from './Catalog';
// import Business from './Business';

/**
 * Entity Agent
 */
export default class Agent extends Model {
  // Catalog association methods
  public createCatalog!: BelongsToCreateAssociationMixin<Catalog>
  public getCatalog!: BelongsToGetAssociationMixin<Catalog>
  public setCatalog!: BelongsToSetAssociationMixin<Catalog, number>

  // Business association methods
  public addBusiness!: HasManyAddAssociationMixin<Business, number>
  public addBusinesses!: HasManyAddAssociationsMixin<Business, number>
  public countBusinesses!: HasManyCountAssociationsMixin
  public createBusiness!: HasManyCreateAssociationMixin<Business>
  public getBusinesses!: HasManyGetAssociationsMixin<Business>
  public hasBusiness!: HasManyHasAssociationMixin<Business, number>
  public hasBusinesses!: HasManyHasAssociationsMixin<Business, number>
  public removeBusiness!: HasManyRemoveAssociationMixin<Business, number>
  public removeBusinesses!: HasManyRemoveAssociationsMixin<Business, number>
  public setBusinesses!: HasManySetAssociationsMixin<Business, number>

  // Populated for inclusions
  public readonly country?: Catalog
  // public readonly Businesses?: Business[]

  public static associations: {
    // Catalog: Association<Agent, Catalog>
    country: Association<Agent, Catalog>
    Businesses: Association<Agent, Business>
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
      'personTypeId': {
        type: DataTypes.INTEGER,
      },
      'birthday': {
        type: DataTypes.DATE,
      },
      'mobileCodeId': {
        type: DataTypes.INTEGER,
      },
      'mobile': {
        type: DataTypes.STRING,
      },
      'phone': {
        type: DataTypes.STRING,
      },
      'email': {
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
    {sequelize, modelName: 'agent'});
  }
}
