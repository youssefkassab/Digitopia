# Admin Module Documentation

An in-depth guide for the admin functionality in the backend and frontend.  
This covers controller logic, routing, HTTP endpoints, and client utilities for admin operations.  

---

## adminController.js

This file implements all **admin-related operations** in the backend.  
It handles authentication, student/teacher/admin CRUD, and input validation.  

### Utility Functions 🛠️

These functions validate email format and password strength before any database operations.

- **isValidEmail(email)**: Uses regex to ensure a proper email structure.  
- **isStrongPassword(password)**: Enforces at least 8 characters, one uppercase, one number, and one symbol.

```js
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isStrongPassword = (password) =>
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
```

---

### Admin Signup 🔒

Registers a new admin after verifying a master key and credentials.

- Validates presence of `email`, `password`, and `masterKey`.  
- Checks `masterKey` against `process.env.ADMIN_MASTER_KEY`.  
- Ensures email format and password strength.  
- Prevents duplicate admin emails.  
- Hashes password and inserts a new admin record.

```js
const adminSignup = (req, res) => {
  const { email, password, masterKey } = req.body;
  // ...validation and DB logic...
};
```

```api
{
  "title": "Admin Signup",
  "description": "Create a new admin user with master key verification",
  "method": "POST",
  "baseUrl": "http://localhost:3000/api",
  "endpoint": "/admin/signup",
  "headers": [
    { "key": "Content-Type", "value": "application/json", "required": true }
  ],
  "bodyType": "json",
  "requestBody": "{\n  \"email\": \"admin@example.com\",\n  \"password\": \"Str0ngP@ss!\",\n  \"masterKey\": \"MASTER_KEY\"\n}",
  "responses": {
    "201": {
      "description": "Admin created successfully",
      "body": "{\n  \"message\": \"Admin created successfully.\",\n  \"admin\": {\n    \"id\": 1,\n    \"email\": \"admin@example.com\",\n    \"role\": \"admin\"\n  }\n}"
    },
    "400": {
      "description": "Missing or invalid fields",
      "body": "{ \"error\": \"All fields are required.\" }"
    },
    "403": {
      "description": "Invalid master key",
      "body": "{ \"error\": \"Invalid master key.\" }"
    }
  }
}
```

---

### Admin Login 🔑

Authenticates an admin and issues a JWT token.

- Requires `email` and `password`.  
- Verifies admin role and password match.  
- Signs a JWT with 1-hour expiry containing admin details.

```js
const adminLogin = (req, res) => {
  const { email, password } = req.body;
  // ...DB lookup and bcrypt.compare...
};
```

```api
{
  "title": "Admin Login",
  "description": "Authenticate an admin and receive a JWT token",
  "method": "POST",
  "baseUrl": "http://localhost:3000/api",
  "endpoint": "/admin/login",
  "headers": [
    { "key": "Content-Type", "value": "application/json", "required": true }
  ],
  "bodyType": "json",
  "requestBody": "{\n  \"email\": \"admin@example.com\",\n  \"password\": \"Str0ngP@ss!\"\n}",
  "responses": {
    "200": {
      "description": "Login successful",
      "body": "{\n  \"token\": \"<jwt_token>\",\n  \"admin\": {\n    \"id\": 1,\n    \"email\": \"admin@example.com\",\n    \"role\": \"admin\"\n  }\n}"
    },
    "401": {
      "description": "Authentication failed",
      "body": "{ \"error\": \"Invalid password.\" }"
    }
  }
}
```

---

### Student Management 🎓

#### Get All Students

Retrieves all users with the `user` role.

```js
const getStudents = (req, res) => {
  db.query(
    `SELECT id, name, email, national_number, Grade FROM users WHERE role = 'user'`,
    (err, results) => { /* ... */ }
  );
};
```

```api
{
  "title": "List Students",
  "description": "Fetch all student users",
  "method": "GET",
  "baseUrl": "http://localhost:3000/api",
  "endpoint": "/admin/students",
  "headers": [
    { "key": "Authorization", "value": "Bearer <token>", "required": true }
  ],
  "responses": {
    "200": {
      "description": "Array of students",
      "body": "[\n  { \"id\": 1, \"name\": \"Alice\", \"email\": \"alice@example.com\", \"national_number\": \"12345\", \"Grade\": \"A\" }\n]"
    },
    "500": {
      "description": "Database error",
      "body": "{ \"error\": \"Database error.\" }"
    }
  }
}
```

#### Add Student

Creates a new student after validating inputs.

```js
const addStudent = (req, res) => {
  const { name, email, password, national_number, Grade } = req.body;
  // ...validation and insertion...
};
```

```api
{
  "title": "Add Student",
  "description": "Create a new student user",
  "method": "POST",
  "baseUrl": "http://localhost:3000/api",
  "endpoint": "/admin/students",
  "headers": [
    { "key": "Content-Type", "value": "application/json", "required": true },
    { "key": "Authorization", "value": "Bearer <token>", "required": true }
  ],
  "bodyType": "json",
  "requestBody": "{\n  \"name\": \"Bob\",\n  \"email\": \"bob@example.com\",\n  \"password\": \"Stud3ntP@ss!\",\n  \"national_number\": \"67890\",\n  \"Grade\": \"B\"\n}",
  "responses": {
    "201": {
      "description": "Student added",
      "body": "{ \"message\": \"Student added successfully.\", \"id\": 2 }"
    },
    "409": {
      "description": "Email conflict",
      "body": "{ \"error\": \"Email already in use.\" }"
    }
  }
}
```

#### Delete Student

Removes a student by ID.

```js
const deleteStudent = (req, res) => {
  const { id } = req.params;
  // ...deletion logic...
};
```

```api
{
  "title": "Delete Student",
  "description": "Remove a student by ID",
  "method": "DELETE",
  "baseUrl": "http://localhost:3000/api",
  "endpoint": "/admin/students/:id",
  "pathParams": [
    { "key": "id", "value": "Student ID", "required": true }
  ],
  "headers": [
    { "key": "Authorization", "value": "Bearer <token>", "required": true }
  ],
  "responses": {
    "200": {
      "description": "Student deleted",
      "body": "{ \"message\": \"Student deleted successfully.\" }"
    },
    "404": {
      "description": "Not found",
      "body": "{ \"error\": \"Student not found.\" }"
    }
  }
}
```

---

### Teacher Management 👩‍🏫

#### Get All Teachers

Fetches all users with the `teacher` role.

```js
const getTeachers = (req, res) => {
  db.query(
    `SELECT id, name, email, national_number FROM users WHERE role = 'teacher'`,
    (err, results) => { /* ... */ }
  );
};
```

```api
{
  "title": "List Teachers",
  "description": "Fetch all teacher users",
  "method": "GET",
  "baseUrl": "http://localhost:3000/api",
  "endpoint": "/admin/teachers",
  "headers": [
    { "key": "Authorization", "value": "Bearer <token>", "required": true }
  ],
  "responses": {
    "200": {
      "description": "Array of teachers",
      "body": "[\n  { \"id\": 1, \"name\": \"Eve\", \"email\": \"eve@example.com\", \"national_number\": \"54321\" }\n]"
    }
  }
}
```

#### Add Teacher

Creates a new teacher after input checks.

```js
const addTeacher = (req, res) => {
  const { name, email, password, national_number } = req.body;
  // ...validation and insertion...
};
```

```api
{
  "title": "Add Teacher",
  "description": "Create a new teacher user",
  "method": "POST",
  "baseUrl": "http://localhost:3000/api",
  "endpoint": "/admin/teachers",
  "headers": [
    { "key": "Content-Type", "value": "application/json", "required": true },
    { "key": "Authorization", "value": "Bearer <token>", "required": true }
  ],
  "bodyType": "json",
  "requestBody": "{\n  \"name\": \"Carol\",\n  \"email\": \"carol@example.com\",\n  \"password\": \"T3ach3rP@ss!\",\n  \"national_number\": \"11223\"\n}",
  "responses": {
    "201": {
      "description": "Teacher added",
      "body": "{ \"message\": \"Teacher added successfully.\", \"id\": 3 }"
    },
    "409": {
      "description": "Email conflict",
      "body": "{ \"error\": \"Email already in use.\" }"
    }
  }
}
```

#### Delete Teacher

Deletes a teacher by ID.

```js
const deleteTeacher = (req, res) => {
  const { id } = req.params;
  // ...deletion logic...
};
```

```api
{
  "title": "Delete Teacher",
  "description": "Remove a teacher by ID",
  "method": "DELETE",
  "baseUrl": "http://localhost:3000/api",
  "endpoint": "/admin/teachers/:id",
  "pathParams": [
    { "key": "id", "value": "Teacher ID", "required": true }
  ],
  "headers": [
    { "key": "Authorization", "value": "Bearer <token>", "required": true }
  ],
  "responses": {
    "200": {
      "description": "Teacher deleted",
      "body": "{ \"message\": \"Teacher deleted successfully.\" }"
    },
    "404": {
      "description": "Not found",
      "body": "{ \"error\": \"Teacher not found.\" }"
    }
  }
}
```

---

### Admin Management 🛡️

#### Get All Admins

Lists all users with the `admin` role.

```js
const getAdmins = (req, res) => {
  db.query(
    `SELECT id, email FROM users WHERE role = 'admin'`,
    (err, results) => { /* ... */ }
  );
};
```

```api
{
  "title": "List Admins",
  "description": "Fetch all admin users",
  "method": "GET",
  "baseUrl": "http://localhost:3000/api",
  "endpoint": "/admin/admins",
  "headers": [
    { "key": "Authorization", "value": "Bearer <token>", "required": true }
  ],
  "responses": {
    "200": {
      "description": "Array of admins",
      "body": "[\n  { \"id\": 1, \"email\": \"admin@example.com\" }\n]"
    }
  }
}
```

#### Delete Admin

Removes an admin by ID, preventing self-deletion.

```js
const deleteAdmin = (req, res) => {
  const { id } = req.params;
  // ...self-check and deletion...
};
```

```api
{
  "title": "Delete Admin",
  "description": "Remove an admin by ID (self-deletion forbidden)",
  "method": "DELETE",
  "baseUrl": "http://localhost:3000/api",
  "endpoint": "/admin/admins/:id",
  "pathParams": [
    { "key": "id", "value": "Admin ID", "required": true }
  ],
  "headers": [
    { "key": "Authorization", "value": "Bearer <token>", "required": true }
  ],
  "responses": {
    "200": {
      "description": "Admin deleted",
      "body": "{ \"message\": \"Admin deleted successfully.\" }"
    },
    "403": {
      "description": "Self-deletion attempt",
      "body": "{ \"error\": \"You cannot delete yourself.\" }"
    },
    "404": {
      "description": "Not found",
      "body": "{ \"error\": \"Admin not found.\" }"
    }
  }
}
```

---

## admin.router.js

Defines **Express routes** for all admin operations.  
It applies authentication and role-based middleware to protect routes.

```js
const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const { auth, roleAuth, ROLE } = require("../middleware/auth.middleware");

// Public auth
router.post("/signup", adminController.adminSignup);
router.post("/login", adminController.adminLogin);

// Protected student routes
router.get("/students", auth, roleAuth(ROLE.ADMIN), adminController.getStudents);
router.post("/students", auth, roleAuth(ROLE.ADMIN), adminController.addStudent);
router.delete("/students/:id", auth, roleAuth(ROLE.ADMIN), adminController.deleteStudent);

// Protected teacher routes
router.get("/teachers", auth, roleAuth(ROLE.ADMIN), adminController.getTeachers);
router.post("/teachers", auth, roleAuth(ROLE.ADMIN), adminController.addTeacher);
router.delete("/teachers/:id", auth, roleAuth(ROLE.ADMIN), adminController.deleteTeacher);

// Protected admin routes
router.get("/admins", auth, roleAuth(ROLE.ADMIN), adminController.getAdmins);
router.delete("/admins/:id", auth, roleAuth(ROLE.ADMIN), adminController.deleteAdmin);

module.exports = router;
```

---

## adminApi.js

This frontend module configures an Axios instance for **admin HTTP calls**.  
It automatically attaches the admin JWT token to each request header.

```js
import axios from "axios";

const API_URL = "http://localhost:3000/api";

const adminApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" }
});

// Attach admin token if present
adminApi.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

export default adminApi;
```

```packagemanagers
{
  "commands": {
    "npm": "npm install axios",
    "yarn": "yarn add axios",
    "pnpm": "pnpm add axios",
    "bun": "bun add axios"
  }
}
```

---

## adminAuth.js

Provides **client-side helpers** for admin authentication flows.  
It isolates admin session storage from user session.

```js
import api from "../services/api";

/**
 * Admin login - stores token under 'adminToken'.
 */
export const adminLogin = async (email, password) => {
  try {
    const { data } = await api.post(
      "/admin/login",
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("admin", JSON.stringify(data.admin));
    return data;
  } catch (error) {
    throw error.response?.data || { error: "Admin login failed." };
  }
};

/**
 * Admin logout - clears adminToken and admin only.
 */
export const adminLogout = async () => {
  try {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    return { message: "Admin logged out (local)" };
  } catch (err) {
    throw { error: "Admin logout failed." };
  }
};

/**
 * Retrieve stored admin info.
 */
export const getStoredAdmin = () => {
  const raw = localStorage.getItem("admin");
  return raw ? JSON.parse(raw) : null;
};

/**
 * Check if admin is authenticated.
 */
export const isAdminAuthenticated = () => {
  return !!localStorage.getItem("adminToken");
};
```

- **adminLogin**: Calls `/admin/login`, saves token and info.  
- **adminLogout**: Clears only admin session data.  
- **getStoredAdmin**: Parses and returns admin details.  
- **isAdminAuthenticated**: Checks presence of `adminToken`.  

---

All modules integrate to provide a secure, role-based admin interface.  
Feel free to extend validation, error handling, or middleware as needed.