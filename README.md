# Welcome to MyBaseCamp
***

## Task
MyBaseCamp is a simple web-based project management tool inspired by Basecamp. It lets users register, sign in, manage their profiles, and create projects inside a clean beginner-friendly MVC web application.

## Description
MyBaseCamp is built with **Node.js** and **Express** on the backend, using **EJS** as the templating engine for server-rendered views. Data is stored in a **SQLite** database managed through **Sequelize ORM**, which handles model definitions, table creation, validation, and database queries. Passwords are hashed using **SHA-256** as requested for this project, and user sessions are managed with **express-session**.

The application follows a clear **MVC architecture**:
- **Models** - `User` and `Project` are defined as Sequelize models with validation rules and relationships
- **Views** - EJS templates organized by resource (`users/`, `projects/`, `sessions/`)
- **Controllers** - separate controller files handle registration, login, role changes, and project actions
- **Routes** - REST-style routes with auth and admin middleware protection

Key features include user registration, login/logout, admin role management (promote/demote users), and full CRUD for projects with owner-based access control. The first registered user becomes admin automatically, and admins can manage users and all projects from the interface.

MyBasecamp2 extends the original project with attachments, discussion threads, and thread messages. Users who can access a project can add and delete attachments, project admins can create, edit, and delete threads, and users can post, edit, and delete messages inside each thread.

## Installation
```bash
# Open the project folder
cd "my basecamp sabis"

# Install dependencies
npm install
```

Make sure you have **Node.js v18+** installed. No external database setup is required - SQLite is file-based and created automatically when the app starts.

## Usage
```bash
# Start the server
npm start
# or
node app.js
```

The server runs on **http://localhost:3000**.

On first use, no default admin account is pre-created. Instead:
- **First registered user:** becomes admin automatically
- **Next users:** are created as regular users unless promoted by an admin

From there you can register new users, sign in, manage roles from the users page, and create or manage projects. Only project owners (or admins) can edit or delete a project. Passwords must be at least 4 characters long.

If the project is run from a OneDrive folder on Windows, the app automatically stores the SQLite database in a temporary local folder to avoid SQLite file locking issues.

## Cloud Deployment

Live project link:

https://mybasecamp2-production.up.railway.app

### The Core Team
Sebine Isayeva,  Lale Nasibova

<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
