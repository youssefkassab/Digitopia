'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PostTags extends Model {
    static associate(models) {
      // Junction table - relationships defined in Post and Tag models
    }
  }

  PostTags.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tags',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'PostTags',
    tableName: 'post_tags',
    timestamps: true,
    indexes: [
      {
        fields: ['post_id', 'tag_id'],
        unique: true // Prevent duplicate tag assignments
      },
      {
        fields: ['tag_id'], // Optimize queries by tag
      },
      {
        fields: ['post_id'], // Optimize queries by post
      }
    ]
  });

  return PostTags;
};
