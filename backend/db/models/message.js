'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {}

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
    title: {
      type: DataTypes.STRING(255)
    },
    description: {
      type: DataTypes.TEXT
    },
    message_date: {
      type: DataTypes.DATEONLY
    },
    message_time: {
      type: DataTypes.TIME
    }
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'messages'
  });

  return Message;
};
