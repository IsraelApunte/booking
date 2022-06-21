require('dotenv').config({path: `src/env/${process.env.LAMBDA_ENV}.env`});
import {Sequelize} from 'sequelize';
import Agent from '../entity/Agent';
import BankAccount from '../entity/BankAccount';
import BookingSequence from '../entity/BookingSequence';
import Booking from '../entity/Booking';
import BookingDetail from '../entity/BookingDetail';
import Business from '../entity/Business';
import BusinessHour from '../entity/BusinessHour';
import Catalog from '../entity/Catalog';
import Customer from '../entity/Customer';
import Gallery from '../entity/Gallery';
import Location from '../entity/Location';
import Product from '../entity/Product';
import Banner from '../entity/Banner';
import User from '../entity/User';
import Role from '../entity/Role';
import Menu from '../entity/Menu';
import Event from '../entity/Event';
import EventSchedule from '../entity/EventSchedule';

// Open database connection
const sequelize = new Sequelize(
    process.env.DB_DATABASE!,
    process.env.DB_USERNAME!,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: 5432,
      logging: process.env.IS_OFFLINE === 'true'? true: false, // Disable the logging. It is consuming the time on lambda function.
      dialect: 'postgres',
      // sync: {force: true},
      define: {
        timestamps: false,
        freezeTableName: true,
        underscored: true, // country_id le transform a mobileCodeId
      },
      // operatorsAliases: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 20000,
        idle: 10000,
      },
    });

// Initialize each model in the database
// This must be done before associations are made
const models = [BankAccount, Agent, Booking, BookingDetail, Business, BusinessHour, Catalog, Customer,
  Gallery, Location, Product, Banner, BookingSequence, User, Menu, Role, Event, EventSchedule];
models.forEach((model) => model.initialize(sequelize));

Agent.belongsTo(Catalog, {as: 'mobileCode', foreignKey: 'mobileCodeId'});
Agent.belongsTo(Catalog, {as: 'identificationType', foreignKey: 'identificationTypeId'});

BankAccount.belongsTo(Catalog, {as: 'mobileCode', foreignKey: 'mobileCodeId'});
BankAccount.belongsTo(Catalog, {as: 'identificationType', foreignKey: 'identificationTypeId'});
BankAccount.belongsTo(Catalog, {as: 'accountType', foreignKey: 'accountTypeId'});
BankAccount.belongsTo(Catalog, {as: 'bankName', foreignKey: 'bankNameId'});

Booking.belongsTo(Catalog, {as: 'status', foreignKey: 'statusId'});
Booking.belongsTo(Catalog, {as: 'paymentMethod', foreignKey: 'paymentMethodId'});

Product.belongsTo(Location, {as: 'location', foreignKey: 'locationId'});
Booking.belongsTo(BankAccount);
Location.hasMany(Product); // product is not associated to location!

BookingDetail.belongsTo(Product);
Business.belongsTo(Agent);
Agent.hasMany(Business);

BankAccount.belongsTo(Agent);
Agent.hasMany(BankAccount);

BankAccount.belongsTo(Business);
Business.hasMany(BankAccount);

// One customer for each booking
// Catalog.belongsTo(Customer, {as: 'mobileCode', foreignKey: 'mobileCodeId'});
Customer.belongsTo(Catalog, {as: 'mobileCode', foreignKey: 'mobileCodeId'});
Customer.belongsTo(Catalog, {as: 'identificationType', foreignKey: 'identificationTypeId'});
// Customer.hasMany(Catalog);

Business.belongsTo(Catalog, {as: 'mobileCode', foreignKey: 'mobileCodeId'});
Business.belongsTo(Catalog, {as: 'identificationType', foreignKey: 'identificationTypeId'});
Business.belongsTo(Catalog, {as: 'province', foreignKey: 'provinceId'});
Business.belongsTo(Catalog, {as: 'city', foreignKey: 'cityId'});

Product.belongsTo(Catalog, {as: 'sport', foreignKey: 'sportId'});

Location.belongsTo(Business, {as: 'business', foreignKey: 'businessId'});
Booking.belongsTo(Location);

// One customer for each booking
Booking.belongsTo(Customer);
// Many bookings for one customer
Customer.hasMany(Booking);

// One booking for each bookingDetail
BookingDetail.belongsTo(Booking);
// Many bookingDetails for one booking
Booking.hasMany(BookingDetail);

// One location for each product
BusinessHour.belongsTo(Location);
// Many products for one location
Location.hasMany(BusinessHour);

// One product for each gallery
Gallery.belongsTo(Product);
// Many galleries for one product
Product.hasMany(Gallery);

// User.belongsTo(Role);
User.belongsTo(Role, {as: 'role', foreignKey: 'roleId'});
Menu.belongsTo(Role);

BookingSequence.belongsTo(Location);
// Create database tables
//   force: true causes database to reset with each run
// sequelize.sync({force: true});

Event.belongsTo(Location, {as: 'location', foreignKey: 'locationId'});
Event.belongsTo(Business, {as: 'business', foreignKey: 'businessId'});
Event.belongsTo(Product, {as: 'product', foreignKey: 'productId'});
EventSchedule.belongsTo(Event, {as: 'event', foreignKey: 'eventId'});
// Many products for one location
Event.hasMany(EventSchedule);
export {
  sequelize as Database,
  BankAccount, Agent, Booking, BookingDetail, Business, BusinessHour, Catalog, Customer,
  Gallery, Location, Product, Banner, BookingSequence, User, Menu, Role, Event, EventSchedule};

