/* now this is for threads, we will create a new model for threads, bu basecamp 2 nin ikinci hissesidi planlid gedirik lol */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Thread",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Thread title is required." }
        }
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: "threads"
    }
  );
};
