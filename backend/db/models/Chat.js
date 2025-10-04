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
      unique: true, // Each conversation should have unique chatId
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "model"),
      allowNull: false, // Required field for conversation flow
    },
    text: {
      type: DataTypes.TEXT("long"), // Use long text for AI responses
      allowNull: false,
    },
    used_tokens: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Chat',
    tableName: 'chats',
    timestamps: true, // Enable automatic timestamps
    indexes: [
      {
        fields: ['chatId', 'userId'], // Optimize queries by conversation
      },
      {
        fields: ['userId', 'sentAt'], // Optimize queries by user and time
      }
    ]
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
