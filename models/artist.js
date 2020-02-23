const sequelize = require("../database/sequlize");
const Sequelize = require("sequelize");

module.exports = sequelize.define(
  "artist",
  {
    id: {
      field: "ArtistId",
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      field: "Name",
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          args: true,
          mas: "Name is required"
        },
        isAlpha: {
          args: true,
          msg: "Name must only contain letters"
        },
        len: {
          args: [2, 10],
          msg: "Name must be between 2 and 10 chars"
        }
      }
    }
  },
  {
    timestamps: false
  }
);
