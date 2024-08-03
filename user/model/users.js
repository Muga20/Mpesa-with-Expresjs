const { DataTypes } = require('sequelize');
const db = require('../../config/config');
const UserDetails = require('./details'); 
const TwoFaAuth = require('./twoFA_auth'); 
const UserRoles = require('./user_roles'); 

const Users = db.define(
    'users',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
        },
        authType: {
            type: DataTypes.STRING,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        freezeTableName: true,
    }
);

// Associations
Users.belongsToMany(Roles, { through: UserRoles, foreignKey: 'user_id', as: 'roles' });
Users.hasMany(UserDetails, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Users.hasMany(TwoFaAuth, { foreignKey: 'user_id', onDelete: 'CASCADE' });

db.sync();


module.exports = Users;
