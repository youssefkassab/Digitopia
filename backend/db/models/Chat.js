module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define("Chat", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    chatId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "model"),
      allowNull: true,
    },
    used_tokens: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    sentAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Chat',
    tableName: 'chats',
    timestamps: false
  });

  Chat.associate = (models) => {
    Chat.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return Chat;
};
