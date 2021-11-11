'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SoilEntries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fieldId : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        references: {
          model: 'Fields',
          key: 'id', 
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      pH: {
        type: Sequelize.DOUBLE
      },
      nitrate: {
        type: Sequelize.INTEGER
      },
      phosphorus: {
        type: Sequelize.INTEGER
      },
      potassium: {
        type: Sequelize.INTEGER
      },
      temperature: {
        type: Sequelize.DOUBLE
      },
      pctCo2: {
        type: Sequelize.DOUBLE
      },
      infiltration: {
        type: Sequelize.DOUBLE
      },
      blkDensity: {
        type: Sequelize.DOUBLE
      },
      conductivity: {
        type: Sequelize.DOUBLE
      },
      aggStability: {
        type: Sequelize.DOUBLE
      },
      slakingRating: {
        type: Sequelize.DOUBLE
      },
      earthwormCount: {
        type: Sequelize.INTEGER
      },
      penResistance: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SoilEntries');
  }
};