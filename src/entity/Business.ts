
import {
  Association, Model, Sequelize, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin, DataTypes, HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin,
} from 'sequelize';
import Agent from './Agent';
import BankAccount from './BankAccount';
import Catalog from './Catalog';
import Location from './Location';

/**
 * Entity Business
 */
export default class Business extends Model {
  id!: number;
  logo!: string;
  locations!: Location[];
  email!: string;
  bankAccounts!: BankAccount[];
  mobile!:string;
  username!: string;

  // Catalog association methods
  public createCatalog!: BelongsToCreateAssociationMixin<Catalog>
  public getCatalog!: BelongsToGetAssociationMixin<Catalog>
  public setCatalog!: BelongsToSetAssociationMixin<Catalog, number>

  // Agent association methods
  public createAgent!: BelongsToCreateAssociationMixin<Agent>
  public getAgent!: BelongsToGetAssociationMixin<Agent>
  public setAgent!: BelongsToSetAssociationMixin<Agent, number>

  // Location association methods
  public addLocation!: HasManyAddAssociationMixin<Location, number>
  public addLocationes!: HasManyAddAssociationsMixin<Location, number>
  public countLocationes!: HasManyCountAssociationsMixin
  public createLocation!: HasManyCreateAssociationMixin<Location>
  public getLocationes!: HasManyGetAssociationsMixin<Location>
  public hasLocation!: HasManyHasAssociationMixin<Location, number>
  public hasLocationes!: HasManyHasAssociationsMixin<Location, number>
  public removeLocation!: HasManyRemoveAssociationMixin<Location, number>
  public removeLocationes!: HasManyRemoveAssociationsMixin<Location, number>
  public setLocationes!: HasManySetAssociationsMixin<Location, number>

  // Populated for inclusions
  public readonly Catalog?: Catalog
  public readonly Agent?: Agent
  public readonly Locations?: Location[]

  public static associations: {
    Catalog: Association<Business, Catalog>
    Agent: Association<Business, Agent>
    Locations: Association<Business, Location>
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
        allowNull: false,
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
      'agentId': {
        type: DataTypes.INTEGER,
      },
      'personTypeId': {
        type: DataTypes.INTEGER,
      },
      'tradename': {
        type: DataTypes.STRING,
      },
      'birthday': {
        type: DataTypes.DATE,
      },
      'mobileCodeId': {
        type: DataTypes.INTEGER,
      },
      'mobile': {
        type: DataTypes.STRING,
        allowNull: false,
      },
      'phone': {
        type: DataTypes.STRING,
      },
      'email': {
        type: DataTypes.STRING,
        allowNull: false,
      },
      'logo': {
        type: DataTypes.STRING,
      },
      'isActive': {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      'provinceId': {
        type: DataTypes.INTEGER,
      },
      'cityId': {
        type: DataTypes.INTEGER,
      },
      'storeId': {
        type: DataTypes.STRING,
      },
      'emailWasSent': {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
    {sequelize, modelName: 'business'});
  }
}

