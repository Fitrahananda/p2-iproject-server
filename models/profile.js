"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User);
      this.belongsToMany(models.User, { through: models.Partner });
    }
  }
  Profile.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name is required" },
          notEmpty: { msg: "Name is required" },
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,

        validate: {
          notEmpty: { msg: "Gender is required" },
          notNull: { msg: "Gender is required" },
        },
      },
      age: {
        type: DataTypes.STRING,
        allowNull: false,

        validate: {
          notEmpty: { msg: "Age is required" },
          notNull: { msg: "Age is required" },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,

        validate: {
          notEmpty: { msg: "PhoneNumber is required" },
          notNull: { msg: "PhoneNumber is required" },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,

        validate: {
          notEmpty: { msg: "Address is required" },
          notNull: { msg: "Address is required" },
        },
      },
      photoProfile: {
        type: DataTypes.STRING,
        allowNull: false,

        validate: {
          notEmpty: { msg: "Photo is required" },
          notNull: { msg: "Photo is required" },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Profile",
    }
  );
  return Profile;
};
