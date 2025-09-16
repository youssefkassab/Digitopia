module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define("Chat", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastMessages: {
      type: DataTypes.JSON,
      allowNull: true
    }
  });

  Chat.associate = (models) => {
    Chat.belongsTo(models.User, {
      foreignKey: "userId",  // FK in Chats
      targetKey: "id",       // PK in User
      as: "user",
      onDelete: "CASCADE"
    });
  };

  return Chat;
};
