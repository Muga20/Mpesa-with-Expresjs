const { DataTypes } = require('sequelize');
const db = require('../../config/config');

const UserRoles = db.define(
    'user_roles', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    role_id: {
        type: DataTypes.UUID,
        allowNull: false,
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['user_id']
        },
        {
            fields: ['role_id']
        }
    ]
});

db.sync();

module.exports = UserRoles;
