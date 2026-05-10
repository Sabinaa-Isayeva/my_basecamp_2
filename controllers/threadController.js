const db = require("../models");

function userCanManageProject(user, project) {
  return Boolean(user && (user.isAdmin || user.id === project.ownerId));
}

module.exports = {
  async newForm(req, res) {
    const project = await db.Project.findByPk(req.params.projectId);

    if (!project) {
      req.flash("danger", "Project not found.");
      return res.redirect("/projects");
    }

    if (!userCanManageProject(req.currentUser, project)) {
      req.flash("danger", "Only project admins can create threads.");
      return res.redirect(`/projects/${project.id}`);
    }

    res.render("threads/new", {
      pageTitle: "New Thread",
      project
    });
  },

  async create(req, res) {
    const project = await db.Project.findByPk(req.params.projectId);

    if (!project) {
      req.flash("danger", "Project not found.");
      return res.redirect("/projects");
    }

    if (!userCanManageProject(req.currentUser, project)) {
      req.flash("danger", "Only project admins can create threads.");
      return res.redirect(`/projects/${project.id}`);
    }

    try {
      const thread = await db.Thread.create({
        title: req.body.title,
        projectId: project.id,
        userId: req.currentUser.id
      });

      req.flash("success", "Thread created successfully.");
      res.redirect(`/projects/${project.id}/threads/${thread.id}`);
    } catch (error) {
      const message =
        error.errors && error.errors.length > 0
          ? error.errors[0].message
          : error.message;

      req.flash("danger", message);
      res.redirect(`/projects/${project.id}/threads/new`);
    }
  },

  async show(req, res) {
const thread = await db.Thread.findByPk(req.params.id, {
  include: [
    {
      model: db.Project,
      as: "project",
      include: [
        {
          model: db.User,
          as: "owner"
        }
      ]
    },
    {
      model: db.User,
      as: "user"
    },
    {
      model: db.Message,
      as: "messages",
      include: [
        {
          model: db.User,
          as: "user"
        }
      ]
    }
  ],
  order: [[{ model: db.Message, as: "messages" }, "createdAt", "ASC"]]
});


    if (!thread) {
      req.flash("danger", "Thread not found.");
      return res.redirect("/projects");
    }

    if (!userCanManageProject(req.currentUser, thread.project)) {
      req.flash("danger", "You cannot view that thread.");
      return res.redirect("/projects");
    }

    res.render("threads/show", {
      pageTitle: thread.title,
      thread,
      project: thread.project
    });
  },

  async editForm(req, res) {
    const thread = await db.Thread.findByPk(req.params.id, {
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

    if (!userCanManageProject(req.currentUser, thread.project)) {
      req.flash("danger", "Only project admins can edit threads.");
      return res.redirect(`/projects/${thread.projectId}`);
    }

    res.render("threads/edit", {
      pageTitle: `Edit ${thread.title}`,
      thread,
      project: thread.project
    });
  },

  async update(req, res) {
    const thread = await db.Thread.findByPk(req.params.id, {
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

    if (!userCanManageProject(req.currentUser, thread.project)) {
      req.flash("danger", "Only project admins can update threads.");
      return res.redirect(`/projects/${thread.projectId}`);
    }

    try {
      thread.title = req.body.title;
      await thread.save();

      req.flash("success", "Thread updated successfully.");
      res.redirect(`/projects/${thread.projectId}/threads/${thread.id}`);
    } catch (error) {
      const message =
        error.errors && error.errors.length > 0
          ? error.errors[0].message
          : error.message;

      req.flash("danger", message);
      res.redirect(`/projects/${thread.projectId}/threads/${thread.id}/edit`);
    }
  },

  async destroy(req, res) {
    const thread = await db.Thread.findByPk(req.params.id, {
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

    if (!userCanManageProject(req.currentUser, thread.project)) {
      req.flash("danger", "Only project admins can delete threads.");
      return res.redirect(`/projects/${thread.projectId}`);
    }

    const projectId = thread.projectId;
    await thread.destroy();

    req.flash("success", "Thread deleted successfully.");
    res.redirect(`/projects/${projectId}`);
  }
};
