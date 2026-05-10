/* opened for basecamp 2 */
const db = require("../models");

function userCanUseProject(user, project) {
  return Boolean(user && (user.isAdmin || user.id === project.ownerId));
}

module.exports = {
  async create(req, res) {
    const project = await db.Project.findByPk(req.params.projectId);

    if (!project) {
      req.flash("danger", "Project not found.");
      return res.redirect("/projects");
    }

    if (!userCanUseProject(req.currentUser, project)) {
      req.flash("danger", "You cannot add attachments to that project.");
      return res.redirect("/projects");
    }

    const { fileName, format } = req.body;

    try {
      await db.Attachment.create({
        fileName,
        format,
        projectId: project.id,
        userId: req.currentUser.id
      });

      req.flash("success", "Attachment added successfully.");
      res.redirect(`/projects/${project.id}`);
    } catch (error) {
      const message =
        error.errors && error.errors.length > 0
          ? error.errors[0].message
          : error.message;

      req.flash("danger", message);
      res.redirect(`/projects/${project.id}`);
    }
  },

  async destroy(req, res) {
    const attachment = await db.Attachment.findByPk(req.params.id, {
      include: [
        {
          model: db.Project,
          as: "project"
        }
      ]
    });

    if (!attachment) {
      req.flash("danger", "Attachment not found.");
      return res.redirect("/projects");
    }

    if (!userCanUseProject(req.currentUser, attachment.project)) {
      req.flash("danger", "You cannot delete that attachment.");
      return res.redirect("/projects");
    }

    const projectId = attachment.projectId;

    await attachment.destroy();

    req.flash("success", "Attachment deleted successfully.");
    res.redirect(`/projects/${projectId}`);
  }
};
