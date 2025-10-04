'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // Messages don't need associations for basic functionality
      // If you need user relationships later, add them here
    }
  }

  Message.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sender: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    receiver: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    message_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    message_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    seen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    timestamps: true, // Enable createdAt/updatedAt
    indexes: [
      {
        fields: ['sender', 'receiver'], // Optimize queries between users
      },
      {
        fields: ['receiver', 'seen'], // Optimize queries for unread messages
      }
    ]
  });

  return Message;
};
