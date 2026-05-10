const db = require("../models");

function userCanUseProject(user, project) {
  return Boolean(user && (user.isAdmin || user.id === project.ownerId));
}

module.exports = {
  async create(req, res) {
    const thread = await db.Thread.findByPk(req.params.threadId, {
      include: [
        {
          model: db.Project,
          as: "project"
        }
      ]
    });

    if (!thread) {
      req.flash("danger", "Thread not found.");
      return res.redirect("/projects");
    }

    if (!userCanUseProject(req.currentUser, thread.project)) {
      req.flash("danger", "You cannot post messages in this thread.");
      return res.redirect("/projects");
    }

    try {
      await db.Message.create({
        body: req.body.body,
        threadId: thread.id,
        userId: req.currentUser.id
      });

      req.flash("success", "Message posted successfully.");
      res.redirect(`/projects/${thread.projectId}/threads/${thread.id}`);
    } catch (error) {
      const message =
        error.errors && error.errors.length > 0
          ? error.errors[0].message
          : error.message;

      req.flash("danger", message);
      res.redirect(`/projects/${thread.projectId}/threads/${thread.id}`);
    }
  },

  async editForm(req, res) {
    const message = await db.Message.findByPk(req.params.messageId, {
      include: [
        {
          model: db.Thread,
          as: "thread",
          include: [
            {
              model: db.Project,
              as: "project"
            }
          ]
        }
      ]
    });

    if (!message) {
      req.flash("danger", "Message not found.");
      return res.redirect("/projects");
    }

    if (!userCanUseProject(req.currentUser, message.thread.project)) {
      req.flash("danger", "You cannot edit that message.");
      return res.redirect("/projects");
    }

    res.render("messages/edit", {
      pageTitle: "Edit Message",
      message,
      thread: message.thread,
      project: message.thread.project
    });
  },

  async update(req, res) {
    const message = await db.Message.findByPk(req.params.messageId, {
      include: [
        {
          model: db.Thread,
          as: "thread",
          include: [
            {
              model: db.Project,
              as: "project"
            }
          ]
        }
      ]
    });

    if (!message) {
      req.flash("danger", "Message not found.");
      return res.redirect("/projects");
    }

    if (!userCanUseProject(req.currentUser, message.thread.project)) {
      req.flash("danger", "You cannot update that message.");
      return res.redirect("/projects");
    }

    try {
      message.body = req.body.body;
      await message.save();

      req.flash("success", "Message updated successfully.");
      res.redirect(`/projects/${message.thread.projectId}/threads/${message.threadId}`);
    } catch (error) {
      const errorMessage =
        error.errors && error.errors.length > 0
          ? error.errors[0].message
          : error.message;

      req.flash("danger", errorMessage);
      res.redirect(
        `/projects/${message.thread.projectId}/threads/${message.threadId}/messages/${message.id}/edit`
      );
    }
  },

  async destroy(req, res) {
    const message = await db.Message.findByPk(req.params.messageId, {
      include: [
        {
          model: db.Thread,
          as: "thread",
          include: [
            {
              model: db.Project,
              as: "project"
            }
          ]
        }
      ]
    });

    if (!message) {
      req.flash("danger", "Message not found.");
      return res.redirect("/projects");
    }

    if (!userCanUseProject(req.currentUser, message.thread.project)) {
      req.flash("danger", "You cannot delete that message.");
      return res.redirect("/projects");
    }

    const projectId = message.thread.projectId;
    const threadId = message.threadId;

    await message.destroy();

    req.flash("success", "Message deleted successfully.");
    res.redirect(`/projects/${projectId}/threads/${threadId}`);
  }
};
