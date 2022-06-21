import {
  Association, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin, DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, Sequelize,
} from 'sequelize';
import Catalog from './Catalog';
import Gallery from './Gallery';
import BookingDetail from './BookingDetail';
import Location from './Location';

/**
 * Entity Product
 */
export default class Product extends Model {
  id!: number;
  sku!:string;
  businessHour!: [];
  sportId!: number;
  galleries!: Gallery[];
  locationId!:number;

  // Catalog association methods
  public createCatalog!: BelongsToCreateAssociationMixin<Catalog>
  public getCatalog!: BelongsToGetAssociationMixin<Catalog>
  public setCatalog!: BelongsToSetAssociationMixin<Catalog, number>

  // BookingDetail association methods
  public addBookingDetail!: HasManyAddAssociationMixin<BookingDetail, number>
  public addBookingDetailes!: HasManyAddAssociationsMixin<BookingDetail, number>
  public countBookingDetailes!: HasManyCountAssociationsMixin
  public createBookingDetail!: HasManyCreateAssociationMixin<BookingDetail>
  public getBookingDetailes!: HasManyGetAssociationsMixin<BookingDetail>
  public hasBookingDetail!: HasManyHasAssociationMixin<BookingDetail, number>
  public hasBookingDetailes!: HasManyHasAssociationsMixin<BookingDetail, number>
  public removeBookingDetail!: HasManyRemoveAssociationMixin<BookingDetail, number>
  public removeBookingDetailes!: HasManyRemoveAssociationsMixin<BookingDetail, number>
  public setBookingDetailes!: HasManySetAssociationsMixin<BookingDetail, number>

  // Location association methods
  public createLocation!: BelongsToCreateAssociationMixin<Location>
  public getLocation!: BelongsToGetAssociationMixin<Location>
  public setLocation!: BelongsToSetAssociationMixin<Location, number>

  // Gallery association methods
  public addGallery!: HasManyAddAssociationMixin<Gallery, number>
  public addGalleryes!: HasManyAddAssociationsMixin<Gallery, number>
  public countGalleryes!: HasManyCountAssociationsMixin
  public createGallery!: HasManyCreateAssociationMixin<Gallery>
  public getGalleryes!: HasManyGetAssociationsMixin<Gallery>
  public hasGallery!: HasManyHasAssociationMixin<Gallery, number>
  public hasGalleryes!: HasManyHasAssociationsMixin<Gallery, number>
  public removeGallery!: HasManyRemoveAssociationMixin<Gallery, number>
  public removeGalleryes!: HasManyRemoveAssociationsMixin<Gallery, number>
  public setGalleryes!: HasManySetAssociationsMixin<Gallery, number>

  // Populated for inclusions
  public readonly sport?: Catalog
  public readonly BookingDetail?: BookingDetail[]
  public readonly location?: Location
  public readonly Galleries?:Gallery[]

  public static associations: {
    sport: Association<Product, Catalog>
    BookingDetails: Association<Product, BookingDetail>
    location: Association<Product, Location>
    Galleries: Association<Product, Gallery>
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
      'locationId': {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      'sku': {
        type: DataTypes.STRING,
        allowNull: false,
      },
      'numberPlayers': {
        type: DataTypes.INTEGER,
      },
      'price': {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      'sportId': {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      'isCovered': {
        type: DataTypes.BOOLEAN,
      },
      'courtTypeId': {
        type: DataTypes.STRING,
      },
      'currencyId': {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      'isActive': {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      'isSynthetic': {
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
    {sequelize, modelName: 'product'});
  }
}
