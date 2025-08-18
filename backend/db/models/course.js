'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // A course belongs to one teacher (user)
      Course.belongsTo(models.User, { foreignKey: 'teacher_id' });
    }
  }

  Course.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.DECIMAL(10, 2)
    },
    teacher_id: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Course',
    tableName: 'courses'
  });

  return Course;
};
