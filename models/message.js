/* men indi basecamp 2 ucun message modeli hazirlayiram i tthink this is the last model we need to create */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Message",
    {
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Message cannot be empty." }
        }
      },
      threadId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: "messages"
    }
  );
};
