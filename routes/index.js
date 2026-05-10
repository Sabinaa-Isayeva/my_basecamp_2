const express = require("express");
const homeController = require("../controllers/homeController");

const router = express.Router();

// Ana səhifə route-u.
router.get("/", homeController.index);
// Session ilə bağlı route-ları qoşuruq.
router.use(require("./sessions"));
// User ilə bağlı route-ları qoşuruq.
router.use("/users", require("./users"));
// Project ilə bağlı route-ları qoşuruq.
router.use("/projects", require("./projects"));
// indi  Attachment ilə bağlı route-ları qoşuruq.
router.use(require("./attachments"));
module.exports = router;
