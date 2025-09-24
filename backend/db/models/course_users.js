"use strict";
module.exports = (sequelize, DataTypes) => {
  const course_user = sequelize.define(
    "course_user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );

  course_user.associate = function (models) {
    course_user.belongsTo(models.course, { foreignKey: "course_id" });
    course_user.belongsTo(models.user, { foreignKey: "user_id" });
  };

  return course_user;
};
