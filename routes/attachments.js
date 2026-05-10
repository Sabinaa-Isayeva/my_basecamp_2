/* for basecamp 2 */
const express = require("express");
const attachmentController = require("../controllers/attachmentController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.post("/projects/:projectId/attachments", attachmentController.create);
router.delete(
  "/projects/:projectId/attachments/:id",
  attachmentController.destroy
);

module.exports = router;
        