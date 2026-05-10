/* okay demeli burda ne edirik this is for basecamp 2  and im gonna give the instructions "Attachment = project-ə əlavə olunan file məlumatı
fileName = məsələn report.pdf
format = pdf / png / jpg / txt
projectId = hansı project-ə aiddir
userId = kim əlavə edib
"   */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Attachment",
    {
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Attachment file name is required." }
        }
      },
      format: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Attachment format is required." }
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
      tableName: "attachments"
    }
  );
};
