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
    pct_co2: DataTypes.DOUBLE,
    infiltration: DataTypes.DOUBLE,
    blk_density: DataTypes.DOUBLE,
    conductivity: DataTypes.DOUBLE,
    agg_stability: DataTypes.DOUBLE,
    slaking_rating: DataTypes.DOUBLE,
    earthworm_count: DataTypes.INTEGER,
    pen_resistance: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'SoilEntry',
  });
  return SoilEntry;
};