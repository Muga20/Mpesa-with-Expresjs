const { DataTypes } = require('sequelize');
const db = require('../../config/config');
const UserRoles = require('./user_roles'); 

const Roles = db.define(
    'roles',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        role: {
            type: DataTypes.STRING,
        },
        role_number: {
            type: DataTypes.INTEGER,
        },
        role_status: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        freezeTableName: true,
    }
);

// Associations
Roles.belongsToMany(Users, { through: UserRoles, foreignKey: 'role_id', as: 'users' });

db.sync();

module.exports = Roles;
