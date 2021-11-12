'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SoilEntry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SoilEntry.belongsTo(models.Field);
      // define association here
    }
  };
  SoilEntry.init({
    pH: DataTypes.DOUBLE,
    nitrate: DataTypes.INTEGER,
    phosphorus: DataTypes.INTEGER,
    potassium: DataTypes.INTEGER,
    temperature: DataTypes.DOUBLE,
    pctCo2: DataTypes.DOUBLE,
    infiltration: DataTypes.DOUBLE,
    blkDensity: DataTypes.DOUBLE,
    conductivity: DataTypes.DOUBLE,
    aggStability: DataTypes.DOUBLE,
    slakingRating: DataTypes.DOUBLE,
    earthwormCount: DataTypes.INTEGER,
    penResistance: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'SoilEntry',
  });
  return SoilEntry;
};