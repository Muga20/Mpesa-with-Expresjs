const { DataTypes } = require("sequelize");
const db = require("../config/config");
const crypto = require("crypto");
const Roles = require("./roles");

const TwoFaAuth = db.define(
    "two_fa_auth",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        user_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        two_factor_code: {
            type: DataTypes.STRING,
            unique: true,
        },

        two_factor_expires_at: {
            type: DataTypes.STRING,
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

module.exports = TwoFaAuth;