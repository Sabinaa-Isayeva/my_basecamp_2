const db = require("../models");

// Bu köməkçi yoxlayır ki, user bu project-i idarə edə bilər ya yox.
// Qayda sadədir:
// 1. admin hər şeyi idarə edə bilər
// 2. adi user yalnız öz project-ini idarə edə bilər
function userCanManageProject(user, project) {
  return Boolean(user && (user.isAdmin || user.id === project.ownerId));
}

module.exports = {
  // Project-lərin siyahısını göstərir.
  async index(req, res) {
    // Admin-dirsə bütün project-ləri görür.
    // Yoxdursa yalnız öz project-lərini görür.
    const where = req.currentUser.isAdmin ? {} : { ownerId: req.currentUser.id };

    // Project-ləri owner məlumatı ilə birlikdə gətiririk.
    const projects = await db.Project.findAll({
      where,
      include: [
        {
          model: db.User,
          as: "owner"
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.render("projects/index", {
      pageTitle: "Projects",
      projects
    });
  },

  // Yeni project yaratmaq səhifəsi.
  newForm(req, res) {
    res.render("projects/new", { pageTitle: "New Project" });
  },

  // Yeni project yaradır.
  async create(req, res) {
    const { title, description } = req.body;

    try {
      // Layihə hazırkı daxil olmuş istifadəçiyə aid olur.
      const project = await db.Project.create({
        title,
        description,
        ownerId: req.currentUser.id
      });

      req.flash("success", "Project created successfully.");
      res.redirect(`/projects/${project.id}`);
    } catch (error) {
      // Sequelize validation xətasını sadə formatda göstəririk.
      const message =
        error.errors && error.errors.length > 0
          ? error.errors[0].message
          : error.message;

      req.flash("danger", message);
      res.redirect("/projects/new");
    }
  },

  // Tək bir project-i göstərir.
  async show(req, res) {
    /* bu deyisdi for basecamp2 why? deyim neye komek edr 
     project show acanda attachmentleri getirir , hər attachment-i 
     əlavə edən user-i də gətirir . ən yenilər yuxarıda görünür. */

     
     /*Project show səhifəsində thread list göstərə bilək.
Hər thread-i kim yaradıb onu da göstərə bilək.*/

const project = await db.Project.findByPk(req.params.id, {
  include: [
    {
      model: db.User,
      as: "owner"
    },
    {
      model: db.Attachment,
      as: "attachments",
      include: [
        {
          model: db.User,
          as: "user"
        }
      ]
    },
    {
      model: db.Thread,
      as: "threads",
      include: [
        {
          model: db.User,
          as: "user"
        }
      ]
    }
  ],
  order: [
    [{ model: db.Attachment, as: "attachments" }, "createdAt", "DESC"],
    [{ model: db.Thread, as: "threads" }, "createdAt", "DESC"]
  ]
});


    // Project yoxdursa geri qayıdırıq.
    if (!project) {
      req.flash("danger", "Project not found.");
      return res.redirect("/projects");
    }

    // İcazəsiz baxmaq olmaz.
    if (!userCanManageProject(req.currentUser, project)) {
      req.flash("danger", "You cannot view that project.");
      return res.redirect("/projects");
    }

    res.render("projects/show", {
      pageTitle: project.title,
      project
    });
  },

  // Project redaktə formunu açır.
  async editForm(req, res) {
    const project = await db.Project.findByPk(req.params.id);

    // Project yoxdur.
    if (!project) {
      req.flash("danger", "Project not found.");
      return res.redirect("/projects");
    }

    // Bu project-i dəyişməyə icazəsi varmı?
    if (!userCanManageProject(req.currentUser, project)) {
      req.flash("danger", "You cannot edit that project.");
      return res.redirect("/projects");
    }

    res.render("projects/edit", {
      pageTitle: `Edit ${project.title}`,
      project
    });
  },

  // Project məlumatını yeniləyir.
  async update(req, res) {
    const project = await db.Project.findByPk(req.params.id);

    // Əvvəl project tapılmalıdır.
    if (!project) {
      req.flash("danger", "Project not found.");
      return res.redirect("/projects");
    }

    // Hər kəs başqasının project-ini dəyişə bilməz.
    if (!userCanManageProject(req.currentUser, project)) {
      req.flash("danger", "You cannot update that project.");
      return res.redirect("/projects");
    }

    try {
      // Yeni gələn form məlumatlarını project obyektinə yazırıq.
      project.title = req.body.title;
      project.description = req.body.description;

      // Sonra bazada saxlayırıq.
      await project.save();

      req.flash("success", "Project updated successfully.");
      res.redirect(`/projects/${project.id}`);
    } catch (error) {
      // Problem olsa, yenə sadə xətanı göstəririk.
      const message =
        error.errors && error.errors.length > 0
          ? error.errors[0].message
          : error.message;

      req.flash("danger", message);
      res.redirect(`/projects/${project.id}/edit`);
    }
  },

  // Project silir.
  async destroy(req, res) {
    const project = await db.Project.findByPk(req.params.id);

    // Silinəcək project yoxdursa, davam etmirik.
    if (!project) {
      req.flash("danger", "Project not found.");
      return res.redirect("/projects");
    }

    // İcazəsi olmayan adam project silə bilməz.
    if (!userCanManageProject(req.currentUser, project)) {
      req.flash("danger", "You cannot delete that project.");
      return res.redirect("/projects");
    }

    // Project bazadan silinir.
    await project.destroy();
    req.flash("success", "Project deleted successfully.");
    res.redirect("/projects");
  }
};
