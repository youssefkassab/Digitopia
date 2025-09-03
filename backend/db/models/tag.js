'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      // Many-to-Many with Posts
      Tag.belongsToMany(models.Post, { through: 'Post_Tags', foreignKey: 'tagId' });
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
