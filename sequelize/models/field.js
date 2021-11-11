'use strict';
const {
  Model, UniqueConstraintError
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Field extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Field.belongsTo(models.User);
      // define association here
    }
  };
  Field.init({
    address: DataTypes.STRING,
    size: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Field',
  });
  return Field;
};