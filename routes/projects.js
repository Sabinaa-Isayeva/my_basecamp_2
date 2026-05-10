const express = require("express");
const projectController = require("../controllers/projectController");
const { requireAuth } = require("../middleware/auth");
const attachmentController = require("../controllers/attachmentController");
const threadController = require("../controllers/threadController");
const messageController = require("../controllers/messageController");

const router = express.Router();

// Bu fayldakı bütün route-lar üçün əvvəlcə giriş lazımdır.
router.use(requireAuth);

// Basecamp 2 attachment routes
router.post("/:projectId/attachments", attachmentController.create);

router.delete(
  "/:projectId/attachments/:id",
  attachmentController.destroy
);

// Basecamp 2 message routes
router.post(
  "/:projectId/threads/:threadId/messages",
  messageController.create
);

router.get(
  "/:projectId/threads/:threadId/messages/:messageId/edit",
  messageController.editForm
);

router.put(
  "/:projectId/threads/:threadId/messages/:messageId",
  messageController.update
);

router.delete(
  "/:projectId/threads/:threadId/messages/:messageId",
  messageController.destroy
);

// Layihələrin siyahısı.
router.get("/", projectController.index);
// Yeni layihə formu.
router.get("/new", projectController.newForm);
// Yeni layihə yaratmaq.
router.post("/", projectController.create);
// Tək bir layihəni göstərmək.
// Basecamp 2 thread routes
router.get("/:projectId/threads/new", threadController.newForm);
router.post("/:projectId/threads", threadController.create);
router.get("/:projectId/threads/:id", threadController.show);
router.get("/:projectId/threads/:id/edit", threadController.editForm);
router.put("/:projectId/threads/:id", threadController.update);
router.delete("/:projectId/threads/:id", threadController.destroy);

router.get("/:id", projectController.show);
// Redaktə formu.
router.get("/:id/edit", projectController.editForm);
// Layihəni yeniləmək.
router.put("/:id", projectController.update);
// Layihəni silmək.
router.delete("/:id", projectController.destroy);

module.exports = router;
