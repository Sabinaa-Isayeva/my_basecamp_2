const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

// User modelini yükləyirik.
const User = require("./user")(sequelize, DataTypes);
// Project modelini yükləyirik.
const Project = require("./project")(sequelize, DataTypes);
// Attachment modelini yükləyirik.
const Attachment = require("./attachment")(sequelize, DataTypes);
// Thread modelini yükləyirik.
const Thread = require("./thread")(sequelize, DataTypes);
// bu ise message ucundu 
const Message = require("./message")(sequelize, DataTypes);

// Bir istifadəçinin bir neçə layihəsi ola bilər.
// Yəni 1 user -> çox project
User.hasMany(Project, {
  foreignKey: "ownerId",
  as: "projects",
  onDelete: "CASCADE"
});

// Hər layihə də bir istifadəçiyə aiddir.
// Yəni çox project -> 1 user
Project.belongsTo(User, {
  foreignKey: "ownerId",
  as: "owner"
});

// Hər layihənin bir neçə attachment-i ola bilər.
// Yəni 1 project -> çox attachment
Project.hasMany(Attachment, {
  foreignKey: "projectId",
  as: "attachments",
  onDelete: "CASCADE"
});

// Hər attachment bir project-ə aiddir.
// Yəni 1 attachment -> 1 project
Attachment.belongsTo(Project, {
  foreignKey: "projectId",
  as: "project"
});

// Bir istifadəçi bir neçə attachment əlavə edə bilər.
// Yəni 1 user -> çox attachment
User.hasMany(Attachment, {
  foreignKey: "userId",
  as: "attachments",
  onDelete: "CASCADE"
});

// Hər attachment bir user tərəfindən əlavə olunur.
// Yəni 1 attachment -> 1 user
Attachment.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

// Hər layihənin bir neçə thread-i ola bilər.
// Yəni 1 project -> çox thread
Project.hasMany(Thread, {
  foreignKey: "projectId",
  as: "threads",
  onDelete: "CASCADE"
});

// Hər thread bir project-ə aiddir.
// Yəni 1 thread -> 1 project
Thread.belongsTo(Project, {
  foreignKey: "projectId",
  as: "project"
});

// Bir istifadəçi bir neçə thread yarada bilər.
// Yəni 1 user -> çox thread
User.hasMany(Thread, {
  foreignKey: "userId",
  as: "threads",
  onDelete: "CASCADE"
});

// Hər thread bir user tərəfindən yaradılır.
// Yəni 1 thread -> 1 user
Thread.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});


// MESSAGE!!!!!!
// Hər thread-in bir neçə message-i ola bilər.
// Yəni 1 thread -> çox message
Thread.hasMany(Message, {
  foreignKey: "threadId",
  as: "messages",
  onDelete: "CASCADE"
});

// Hər message bir thread-ə aiddir.
// Yəni 1 message -> 1 thread
Message.belongsTo(Thread, {
  foreignKey: "threadId",
  as: "thread"
});

// Bir istifadəçi bir neçə message göndərə bilər.
// Yəni 1 user -> çox message
User.hasMany(Message, {
  foreignKey: "userId",
  as: "messages",
  onDelete: "CASCADE"
});

// Hər message bir user tərəfindən göndərilir.
// Yəni 1 message -> 1 user
Message.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

// Hamısını bir yerdən export edirik ki, başqa fayllarda rahat istifadə edək.
module.exports = {
  sequelize,
  User,
  Project,
  Attachment,
  Thread,
  Message
};

