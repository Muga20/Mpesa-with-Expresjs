const { DataTypes } = require('sequelize');
const db = require('../config/config');

const UserDetails = db.define(
    'user_details',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        first_name: {
            type: DataTypes.STRING,
        },
        middle_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
        },
        gender: {
            type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.STRING,
        },
        cover_image: {
            type: DataTypes.STRING,
        },
        about_the_user: {
            type: DataTypes.STRING,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        freezeTableName: true,
        indexes: [
            {
                fields: ['user_id']
            }
        ]
    }
);

db.sync();

module.exports = UserDetails;
