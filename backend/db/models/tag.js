'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      // Many-to-Many: tags <-> posts
      Tag.belongsToMany(models.Post, {
        through: 'post_tags',
        foreignKey: 'tag_id',
        otherKey: 'post_id',
        as: 'posts'
      });

      // Many-to-Many: tags <-> courses
      Tag.belongsToMany(models.Course, {
        through: 'courses_tags',
        foreignKey: 'tag_id',
        otherKey: 'course_id',
        as: 'courses'
      });
    }
  }

  Tag.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Tag',
    tableName: 'tags'
  });

  return Tag;
};
