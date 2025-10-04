'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      // A Post belongs to a user (sender)
      Post.belongsTo(models.User, {
        foreignKey: 'sender',
        as: 'author',
        onDelete: 'CASCADE'
      });

      // Many-to-Many: posts <-> tags
      Post.belongsToMany(models.Tag, {
        through: 'post_tags',
        foreignKey: 'post_id',
        otherKey: 'tag_id',
        as: 'tags'
      });
    }
  }

  Post.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    sender: {
      type: DataTypes.STRING(100),
      allowNull: false,
      references: {
        model: 'users',
        key: 'email' // Assuming sender is email, but could be user ID
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('published', 'draft', 'archived'),
      allowNull: false,
      defaultValue: 'published'
    },
    view_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true,
    indexes: [
      {
        fields: ['sender'], // Optimize queries by author
      },
      {
        fields: ['date', 'time'], // Optimize queries by publication date
      },
      {
        fields: ['status'], // Optimize queries by post status
      },
      {
        fields: ['title'], // Optimize searches by title
      }
    ]
  });

  return Post;
};
