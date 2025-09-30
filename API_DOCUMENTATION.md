# Digitopia API Documentation

## Table of Contents
- [Base URL & Headers](#base-url--headers)
- [Rate Limits](#rate-limits)
- [Authentication](#authentication)
- [User Roles & Permissions](#user-roles--permissions)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-endpoints)
    - [Login](#login)
    - [Signup](#signup)
    - [Logout](#logout)
  - [User Management](#user-management)
    - [Get Current User](#get-current-user)
  - [Course Management](#course-management)
    - [Create Course](#create-course)
    - [Get All Courses](#get-all-courses)
    - [Get Teacher's Courses](#get-teachers-courses)
    - [Find Course by ID](#find-course-by-id)
    - [Update Course](#update-course)
    - [Delete Course](#delete-course)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Testing Guide](#testing-guide)

## Frontend Change Log

- [BREAKING][FRONTEND_ACTION] `GET /api/courses/find/:id` now uses a path parameter instead of a GET body. Frontend must switch from sending `{ id }` in body to `.../find/ID` in the URL.
- [FRONTEND_ACTION] Rate limits updated: login/signup now `10 req / 15 min / IP`; public message send now `3 req / 10 min / IP`. Adjust UI error handling for `429`.
- [FRONTEND_ACTION] Message endpoints standardize success responses as JSON objects `{ "message": "..." }`. In particular, "Mark as seen" returns `{ message: ' Message marked as seen successfully.' }`.
- [FRONTEND_ACTION] Course update endpoint may return additional messages when no changes are detected: `{ message: 'No changes detected.' }` or `{ message: 'No changes detected. Tags updated successfully.' }`. Handle these gracefully in the UI.
- [NEW][FRONTEND_ACTION] Admin endpoint `POST /api/users/upgradeRole` accepts `{ id, role }` to change another user's role. If consuming admin features, add this integration.

## Base URL & Headers

### Base URL
All API requests must be made to: `http://localhost:3000/api`

### Required Headers
- `Content-Type: application/json` (for requests with body)
- `Authorization: Bearer <token>` (for protected routes)

## Rate Limits

| Endpoint Type                | Rate Limit           | Notes                                               |
|------------------------------|---------------------|-----------------------------------------------------|
| Authentication (login/signup)| 10 req/15 min/IP    | [FRONTEND_ACTION] Updated limit                     |
| Public message send          | 3 req/10 min/IP     | [FRONTEND_ACTION] Stricter limit; handle 429 in UI  |
| File Uploads                 | 10MB max/request    | For future file upload features                     |

## Authentication

### Obtaining a Token
1. Make a POST request to `/users/login` with email and password
2. Store the received token securely (e.g., in localStorage)
3. Include the token in the `Authorization` header for subsequent requests

### Token Expiration
- Tokens expire after 1 hour of inactivity
- No automatic refresh - user must log in again

### Request Headers
For authenticated requests, include the following header:
```
Authorization: Bearer <your_token_here>
```

## User Roles & Permissions

| Role      | Description                          | Course Access           | User Management |
|-----------|--------------------------------------|-------------------------|-----------------|
| Admin     | Full system access                   | Full CRUD on all courses| Full access     |
| Teacher   | Can manage own courses               | CRUD on own courses     | None            |
| User      | Basic access                         | Read-only access        | None            |

## Data Models

### User
```typescript
interface User {
  id: number;
  email: string;
  name?: string;
  national_number?: string;
  role: 'admin' | 'teacher' | 'user';
  Grade?: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}
```

**[FRONTEND_ACTION] Notes**
- Public endpoint is rate-limited to `3 requests / 10 minutes / IP`.

### Course
```typescript
interface Course {
  id: number;
  name: string;
  description: string;
  price: number;
  teacher_id: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}
```

## API Endpoints

### Authentication Endpoints

#### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200 OK)**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Error Responses**
- `400 Bad Request`: Missing or invalid fields
- `401 Unauthorized`: Invalid credentials
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

#### Signup
```http
POST /users/signup
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "role": "user",
  "name": "John Doe",
  "national_number": "1234567890",
  "Grade": "A"
}
```

**Request Fields**
- `email` (required): Must be a valid email format
- `password` (required): Must be at least 8 characters long and contain at least one letter and one number (special characters allowed)
- `role` (required): Must be one of: 'admin', 'teacher', 'user'
- `name` (optional): User's full name
- `national_number` (optional): National identification number
- `Grade` (optional): User's grade/level

**Success Response (201 Created)**
```json
{
  "message": "User created successfully."
}
```

**Error Responses**
- `400 Bad Request`: Missing required fields or invalid data
- `409 Conflict`: User already exists
- `500 Internal Server Error`: Server error
}
```

**Success Response (201 Created)**
```json
{
  "message": "User created successfully",
  "userId": 2
}
```

**Error Responses**
- `400 Bad Request`: Email already registered
- `403 Forbidden`: Invalid role specified

---

### Course Tag Endpoints

#### Create Tag
```http
POST /api/courses/tag
Content-Type: application/json

{
  "name": "Math"
}
```
**Success Response (200 OK)**
```json
{
  "message": "Tag created successfully."
}
```

#### Get All Tags
```http
GET /api/courses/tags
```
**Success Response (200 OK)**
```json
[
  { "id": 1, "name": "Math" },
  { "id": 2, "name": "Science" }
]
```

---

### Message Endpoints

#### Send Message
```http
POST /api/messages/send
Content-Type: application/json

{
  "senderEmail": "user@example.com",
  "content": "Hello!"
}
```
**Success Response (201 Created)**
```json
{
  "id": 1,
  "sender": "user@example.com",
  "content": "Hello!",
  "seen": false,
  "message_date": "2025-09-20",
  "message_time": "12:00:00"
}
```

#### Get All Messages (Admin)
```http
GET /api/messages/receiveAll
Authorization: Bearer <token>
```
**Success Response (200 OK)**
```json
[ { "id": 1, "sender": "user@example.com", "content": "Hello!", ... } ]
```

#### Get My Messages
```http
GET /api/messages/MyMessages
Authorization: Bearer <token>
```
**Success Response (200 OK)**
```json
[ { "id": 1, "sender": "user@example.com", "content": "Hello!", ... } ]
```

#### Update Message
```http
PATCH /api/messages/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": 1,
  "content": "Updated message"
}
```
**Success Response (200 OK)**
```json
{
  "message": "Message updated successfully."
}

#### Mark Message as Seen (Admin)
```http
PATCH /api/messages/seen
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": 1
}
```
**Success Response (200 OK)**
```json
{ "message": " Message marked as seen successfully." }
```

#### Delete Message
```http
DELETE /api/messages/delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": 1
}
```
**Success Response (200 OK)**
```json
{
  "message": "Message deleted successfully."
}

---

#### Logout
```http
POST /users/logout
Authorization: Bearer <token>
```

**Success Response (200 OK)**
```json
{
  "message": "Successfully logged out"
}
```

### User Management

#### Get Current User
```http
GET /api/users/user
Authorization: Bearer <token>
```

**Success Response (200 OK)**
```json
{
  "id": 1,
  "name": "",
  "email": "user@example.com",
  "national_number": "",
  "role": "user"
}
```

**Error Responses**
- `401 Unauthorized`: Invalid or missing token

### Course Management

#### Create Course
```http
POST /api/courses/create
Authorization: Bearer <token>
Content-Type: application/json

// Admin request
{
  "name": "Introduction to Programming",
  "description": "Learn the basics of programming",
  "price": 99.99,
  "teacher_id": 2
  "tags": [1, 2] // Array of tag IDs
}

// Teacher request (teacher_id is set automatically)
{
  "name": "Advanced Web Development",
  "description": "Master modern web technologies",
  "price": 149.99
  "tags": [2, 3] // Array of tag IDs
}
```

**Required Fields**
- `tags`: (optional) Array of tag IDs to associate with the course

**Success Response (201 Created)**
```json
{
  "message": "Course created successfully."
}
```

**Required Fields**
- `name`: String
- `price`: Number
- `teacher_id`: Number

---

#### Get All Courses
```http
GET /api/courses/all
```

**Error Response Example:**
```json
{
  "error": "Validation error: Invalid tag ID(s)",
  "code": "VALIDATION_ERROR"
}
```

**Notes**:
- Public endpoint (no authentication required)
- Returns all available courses

**Success Response (200 OK)**
```json
[
  {
    "id": 1,
    "name": "Introduction to Programming",
    "description": "Learn the basics of programming",
    "price": 99.99,
    "teacher_id": 1,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
]
```

**Error Responses**
- `500 Internal Server Error`: Server error

---

#### Get Teacher's Courses
```http
GET /api/courses/teacher/mycourses
Authorization: Bearer <token>
```

**Error Response Example:**
```json
{
  "error": "Validation error: Invalid tag ID(s)",
  "code": "VALIDATION_ERROR"
}
```

**Success Response (200 OK)**
```json
[
  {
    "id": 1,
    "name": "Advanced Web Development",
    "description": "Master modern web technologies",
    "price": 149.99,
    "teacher_id": 2,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
]
```

**Error Responses**
- `401 Unauthorized`: No token provided
- `403 Forbidden`: Insufficient permissions

---

#### Find Course by ID
```http
GET /api/courses/find/:id
Authorization: Bearer <token>
```

> [FRONTEND_ACTION] Do not include the colon (:) when calling the endpoint. The `:` only indicates a path parameter in docs.
>
> - Correct: `GET /api/courses/find/28`
> - Incorrect: `GET /api/courses/find/:28` (will cause validation error like `"id" must be a number`)

Example:

```bash
curl -X GET http://localhost:3000/api/courses/find/28 \
  -H "Authorization: Bearer <token>"
```

**Success Response (200 OK)**
```json
{
  "id": 1,
  "name": "Introduction to Programming",
  "description": "Learn the basics of programming",
  "price": 99.99,
  "teacher_id": 1,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

**[BREAKING][FRONTEND_ACTION] Notes**
- Path parameter `:id` replaces GET body. Update frontend calls to `/api/courses/find/${id}`.

**Error Responses**
- `401 Unauthorized`: No token provided
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Course not found
- `500 Internal Server Error`: Server error

---

#### Update Course
```http
PUT /api/courses/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": 1,
  "name": "Updated Course Title",
  "description": "Updated course description",
  "price": 129.99
  "tags": [1, 2, 3] // Array of tag IDs to update course tags
}
```

**Notes**:
- To update course tags, include a `tags` array with the tag IDs. This will replace all existing tags for the course.
- If `tags` is omitted, existing tags will remain unchanged.
- If `tags` is an empty array, all tags will be removed from the course.

**Success Response (200 OK)**
```json
// Possible messages (handle all in UI):
{ "message": "Course and tags updated successfully." }
{ "message": "Course updated successfully." }
{ "message": "No changes detected." }                      // [FRONTEND_ACTION]
{ "message": "No changes detected. Tags updated successfully." } // [FRONTEND_ACTION]
{ "message": "Course updated successfully (no tags)." }
```

**Error Responses**
- `400 Bad Request`: Missing course ID or invalid data
- `401 Unauthorized`: No token provided
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Course not found or not accessible
- `500 Internal Server Error`: Server error

---

#### Delete Course
```http
DELETE /api/courses/delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": 1
}
```

**Success Response (200 OK)**
```json
{
  "message": "Course deleted successfully"
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Courses Table
```sql
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    teacher_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);
```

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "error": "Validation error message",
  "code": "VALIDATION_ERROR"
}
```

#### 401 Unauthorized
```json
{
  "error": "Authentication required",
  "code": "AUTH_REQUIRED"
}
```

#### 403 Forbidden
```json
{
  "error": "Insufficient permissions",
  "code": "ACCESS_DENIED"
}
```

#### 404 Not Found
```json
{
  "error": "Resource not found",
  "code": "NOT_FOUND"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

## Testing Guide

### Prerequisites
- Install [Postman](https://www.postman.com/downloads/) or similar API testing tool
- Ensure the backend server is running

### Test Cases

#### 1. User Registration
1. Send POST request to `/api/users/signup`
2. Verify successful creation (201)
3. Verify duplicate email prevention (400)

#### 2. User Login
1. Send POST request to `/api/users/login`
2. Verify token is returned (200)
3. Test invalid credentials (401)

#### 3. Course Management
1. Login as teacher
2. Create a new course
3. Verify course appears in teacher's courses
4. Update course details
5. Delete course
6. Verify course is removed

### Testing with cURL

#### Login Example
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com","password":"password123"}'
```

#### Create Course Example
```bash
curl -X POST http://localhost:3000/api/courses/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"New Course","price":99.99,"teacher_id":1}'
```

### Common Issues
- **Token Expired**: Login again to get a new token
- **CORS Issues**: Ensure frontend is making requests to the correct origin
- **Validation Errors**: Check request body matches required schema

### Courses Table
```sql
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    teacher_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);
```
**Restrictions**:
- Price must be a positive number
- Teacher must exist in users table
- Deleting a user automatically deletes their courses

## Frontend Integration Guide

### 1. Installation
```bash
npm install axios
```

### 2. API Service Setup
```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
    return config;
  },
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Usage Examples

#### Authentication Service
```javascript
// src/services/auth.js
import api from './api';

export const login = async (email, password) => {
  try {
    const { data } = await api.post('/users/login', { email, password });
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    console.error('Login failed:', error.response?.data);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get('/users/user');
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error.response?.data);
    throw error;
  }
};
```

#### Course Service
```javascript
// src/services/course.js
import api from './api';

export const fetchCourses = async () => {
  try {
    const { data } = await api.get('/courses/all');
    return data;
  } catch (error) {
    console.error('Failed to fetch courses:', error.response?.data);
    throw error;
  }
};

export const createCourse = async (courseData) => {
  try {
    const { data } = await api.post('/courses/create', courseData);
    return data;
  } catch (error) {
    console.error('Failed to create course:', error.response?.data);
    throw error;
  }
};
```

### 4. Security Best Practices

1. **Token Storage**
   - Store JWT in `localStorage` for web apps
   - For mobile apps, use secure storage solutions
   - Never store tokens in cookies without `httpOnly` and `secure` flags

2. **Error Handling**
   - Always handle API errors gracefully
   - Show user-friendly error messages
   - Log errors for debugging

3. **Rate Limiting**
   - Implement client-side rate limiting
   - Show appropriate messages when rate limited
   - Add loading states to prevent multiple submissions

4. **Input Validation**
   - Validate all user inputs on client side
   - Never trust client-side validation alone
   - Sanitize all inputs to prevent XSS

## Frontend Integration

### 1. Installation
```bash
npm install axios
```

### 2. API Service Setup
```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Example Usage

#### Authentication
```javascript
// Login
const login = async (email, password) => {
  try {
    const response = await api.post('/users/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data);
    throw error;
  }
};

// Signup
const signup = async (userData) => {
  try {
    const response = await api.post('/users/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Signup failed:', error.response?.data);
    throw error;
  }
};
```

#### Course Operations
```javascript
// Get all courses
const getCourses = async () => {
  try {
    const response = await api.get('/courses/all');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch courses:', error.response?.data);
    throw error;
  }
};

// Create course (Teacher/Admin only)
const createCourse = async (courseData) => {
  try {
    const response = await api.post('/courses/create', courseData);
    return response.data;
  } catch (error) {
    console.error('Failed to create course:', error.response?.data);
    throw error;
  }
};
```

## Error Handling

### Standard Error Response Format
```json
{
  "error": "Error message describing the issue",
  "code": "ERROR_CODE",
  "details": {
    // Additional error details if available
  }
}
```

### Common Error Codes

#### Authentication Errors (4xx)
- `AUTH_REQUIRED` (401): No authentication token provided
- `INVALID_TOKEN` (401): Invalid or expired token
- `INVALID_CREDENTIALS` (401): Incorrect email or password
- `ACCESS_DENIED` (403): Insufficient permissions
- `RATE_LIMIT_EXCEEDED` (429): Too many requests

#### Validation Errors (400)
- `VALIDATION_ERROR`: Request data is invalid
- `EMAIL_TAKEN`: Email is already registered
- `INVALID_EMAIL`: Invalid email format
- `WEAK_PASSWORD`: Password doesn't meet requirements

#### Resource Errors (404)
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `USER_NOT_FOUND`: User not found
- `COURSE_NOT_FOUND`: Course not found

### Handling Errors in Frontend

#### Error Interceptor Example
```javascript
// Add to your api.js
api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    
    if (!response) {
      // Network error
      return Promise.reject({
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to server'
      });
    }

    const { status, data } = response;
    
    // Handle specific status codes
    switch (status) {
      case 401:
        // Handle unauthorized
        if (data.code === 'INVALID_TOKEN') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        break;
      case 403:
        // Handle forbidden
        break;
      case 429:
        // Handle rate limiting
        const retryAfter = response.headers['retry-after'] || 60;
        console.warn(`Rate limited. Retry after ${retryAfter} seconds`);
        break;
      default:
        break;
    }
    
    return Promise.reject(data || error);
  }
);
```

## Rate Limiting

### Endpoint Limits
| Endpoint | Limit | Window |
|----------|-------|--------|
| /login | 5 | 15 minutes |
| /signup | 5 | 15 minutes |
| All others | 100 | 1 minute |

### Response Headers
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in window
- `X-RateLimit-Reset`: When the rate limit resets (UTC timestamp)
- `Retry-After`: Seconds to wait before retrying (when rate limited)

## Testing Guide

### Prerequisites
1. Install [Postman](https://www.postman.com/downloads/)
2. Set up the following environment variables in Postman:
   - `base_url`: `http://localhost:3000/api`
   - `token`: (Will be set after login)

### Test Cases

#### 1. User Registration
**Endpoint**: `POST /users/signup`

**Test Case 1.1: Successful Registration**
- **Request**:
  ```http
  POST {{base_url}}/users/signup
  Content-Type: application/json
  
  {
    "email": "testuser@example.com",
    "password": "TestPass123",
    "name": "Test User",
    "national_number": "1234567890"
  }
  ```
- **Expected Response**: 201 Created
- **Verification**:
  - Check if user is created in database
  - Verify password is hashed
  - Verify role defaults to 'user' if not specified

**Test Case 1.2: Duplicate Email**
- **Request**: Same as above with existing email
- **Expected Response**: 400 Bad Request
- **Verification**: Error message should indicate email exists

#### 2. User Login
**Endpoint**: `POST /users/login`

**Test Case 2.1: Successful Login**
- **Request**:
  ```http
  POST {{base_url}}/users/login
  Content-Type: application/json
  
  {
    "email": "testuser@example.com",
    "password": "TestPass123"
  }
  ```
- **Expected Response**: 200 OK with JWT token
- **Verification**:
  - Save token to environment variable `token`
  - Token should be valid JWT
  - Response should include user details (without password)

**Test Case 2.2: Invalid Credentials**
- **Request**: Wrong email/password
- **Expected Response**: 401 Unauthorized
- **Verification**: Error message should be generic

#### 3. Get Current User
**Endpoint**: `GET /users/user`

**Test Case 3.1: With Valid Token**
- **Request**:
  ```http
  GET {{base_url}}/users/user
  Authorization: Bearer {{token}}
  ```
- **Expected Response**: 200 OK with user data
- **Verification**:
  - Response should match test user data
  - Should not include password hash

**Test Case 3.2: Without Token**
- **Request**: Same as above without Authorization header
- **Expected Response**: 401 Unauthorized

### Postman Collection Setup
1. **Import Collection**:
   - Click "Import" in Postman
   - Select "Raw text" and paste the collection JSON
   - Set up environment variables as shown above

2. **Running Tests**:
   - Open the collection in Postman
   - Run the collection runner
   - All tests should pass

### Common Issues & Solutions
1. **401 Unauthorized**
   - Check if token is expired
   - Verify token is in correct format: `Bearer <token>`
   - Ensure token is being sent in the Authorization header

2. **500 Internal Server Error**
   - Check server logs for detailed error
   - Verify database connection
   - Ensure all environment variables are set

3. **Validation Errors**
   - Check request body against API documentation
   - Verify all required fields are present
   - Ensure data types match expected format

## Best Practices

### Security
1. Always use HTTPS in production
2. Store sensitive data in environment variables
3. Implement proper CORS policies
4. Use secure cookie settings
5. Regularly update dependencies

### Performance
1. Implement client-side caching
2. Use pagination for large datasets
3. Compress responses
4. Implement request debouncing


## Additional Test Scenarios (Comprehensive)

The following scenarios should be validated end-to-end in addition to the Testing Guide above.

### Users & Auth
- [TEST_CASE] Signup success with role `user` and all required fields.
- [TEST_CASE] Signup duplicate email -> 409.
- [TEST_CASE] Signup weak password -> 400.
- [TEST_CASE] Login success -> 200 with token.
- [TEST_CASE] Login wrong password -> 401.
- [TEST_CASE] Rate limit login after >10 attempts in 15 min -> 429.
- [TEST_CASE] Get current user with valid token -> 200.
- [TEST_CASE] Get current user without token -> 401.
- [TEST_CASE] Admin upgradeRole { id, role } -> 200; non-admin -> 403.

### Courses (Teacher role unless stated)
- [TEST_CASE] Create course minimal fields (name, description, price) -> 201.
- [TEST_CASE] Create course with tags array -> 201 and tags persisted.
- [TEST_CASE] Create course missing required fields -> 400.
- [TEST_CASE] Get all courses -> 200 with tags aggregated string.
- [TEST_CASE] Get mycourses as teacher -> only courses where `teacher_id` = token user id.
- [TEST_CASE] [BREAKING] Find by id using path param (no colon): `/api/courses/find/ID` -> 200.
- [TEST_CASE] Find by id with literal colon (incorrect) `/api/courses/find/:ID` -> 400 validation (expected in negative tests).
- [TEST_CASE] Update fields only (name/price) -> 200.
- [TEST_CASE] Update tags only (replace set) -> 200 with appropriate message.
- [TEST_CASE] Update with no changes -> 200 with `No changes detected.` message.
- [TEST_CASE] Update not owned by teacher -> 404.
- [TEST_CASE] Admin update any course -> 200.
- [TEST_CASE] Delete owned course -> 200 and tag links removed.
- [TEST_CASE] Delete not owned course (teacher) -> 404.
- [TEST_CASE] Admin delete any course -> 200.

### Tags
- [TEST_CASE] Create tag (teacher/admin) -> 200.
- [TEST_CASE] Get tags -> 200 list.

### Messages
- [TEST_CASE] Public send message valid -> 201 with id, sender, content, timestamps, seen=0.
- [TEST_CASE] Public send rate limit after 3 in 10 min -> 429.
- [TEST_CASE] Admin receiveAll -> 200 list.
- [TEST_CASE] MyMessages with token -> messages by token email only.
- [TEST_CASE] Update message by non-owner -> should not update (negative); owner -> 200.
- [TEST_CASE] Mark seen admin -> 200 with `{ message: ' Message marked as seen successfully.' }`.
- [TEST_CASE] Delete message admin -> 200; non-admin only own -> 200 else negative.

### CORS & Docs
- [TEST_CASE] Swagger `/docs` enabled in development (NODE_ENV!=production and ENABLE_SWAGGER!=false).
- [TEST_CASE] Swagger `/docs` disabled in production by default.
- [TEST_CASE] CORS allowlist behavior if `CORS_ORIGIN` is set; with credentials avoid wildcard in production.


---

## Admin Management
- **Auth**: Required (Admin role only). All endpoints require the user to have `role: 'admin'` in the database.
- **Base URL**: `/api/admin`

### Get All Students
- **Method**: GET
- **URL**: `/api/admin/students`
- **Auth**: Required (Admin only)
- **Response**: 200 with array of users (role: 'user')
- **Description**: Retrieve all users with role 'user'.
- **Example Response**: `[{ "id": 1, "name": "John Doe", "email": "john@example.com" }]`

### Get All Teachers
- **Method**: GET
- **URL**: `/api/admin/teachers`
- **Auth**: Required (Admin only)
- **Response**: 200 with array of users (role: 'teacher')
- **Description**: Retrieve all users with role 'teacher'.
- **Example Response**: `[{ "id": 2, "name": "Jane Smith", "email": "jane@example.com" }]`

### Get All Admins
- **Method**: GET
- **URL**: `/api/admin/admins`
- **Auth**: Required (Admin only)
- **Response**: 200 with array of users (role: 'admin')
- **Description**: Retrieve all users with role 'admin'.
- **Example Response**: `[{ "id": 3, "email": "admin@example.com" }]`

### Delete Student
- **Method**: DELETE
- **URL**: `/api/admin/students/:id`
- **Auth**: Required (Admin only)
- **Path Params**: `id` (integer, user ID)
- **Response**: 200 (deleted) or 404 (not found)
- **Description**: Delete a user with role 'user' by ID.

### Delete Teacher
- **Method**: DELETE
- **URL**: `/api/admin/teachers/:id`
- **Auth**: Required (Admin only)
- **Path Params**: `id` (integer, user ID)
- **Response**: 200 (deleted) or 404 (not found)
- **Description**: Delete a user with role 'teacher' by ID.
### Login - `POST /api/users/login`

**Description:** Lets a user log in with their email and password. Postman will use the token for other APIs.

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-LOGIN-001 | Any    | Login with valid details | 1. Open Postman.<br>2. Select this endpoint.<br>3. Enter a valid email and password.<br>4. Click Send. | You should see status **200 OK** and a token. Postman should save the token for next requests. | Report a problem if login fails or no token is saved. |
| TC-LOGIN-002 | Any    | Wrong password | 1. Enter a valid email but a wrong password.<br>2. Click Send. | You should see **401 Unauthorized** with a message saying the email or password is wrong. | Report a problem if it allows login. |
| TC-LOGIN-003 | Any    | Missing password | 1. Remove the password from the body.<br>2. Click Send. | You should see **400 Bad Request** with a message that the password is required. | Report a problem if it still logs in. |
| TC-LOGIN-004 | Any    | Too many attempts (rate limit) | 1. Try more than 10 times within 15 minutes.<br>2. Click Send. | You should see **429 Too Many Requests**. | Report a problem if there is no rate limit. |

### Signup - `POST /api/users/signup`

**Description:** Creates a new account.

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-SIGNUP-001 | Any   | Successful registration | 1. Open Postman.<br>2. Select this endpoint.<br>3. Enter a unique email, a strong password, a name, national number, and role User.<br>4. Click Send. | You should see **201 Created** and a success message. | Report a problem if you do not see 201. |
| TC-SIGNUP-002 | Any   | Duplicate email | 1. Use an email that already exists.<br>2. Click Send. | You should see **409 Conflict** and a message saying user already exists. | Report a problem if it creates another user with same email. |
| TC-SIGNUP-003 | Any   | Weak password | 1. Enter a password shorter than 8 characters.<br>2. Click Send. | You should see **400 Bad Request** telling you the password is too weak. | Report a problem if it accepts the weak password. |
| TC-SIGNUP-004 | Any   | Missing required fields | 1. Remove the email or password field.<br>2. Click Send. | You should see **400 Bad Request** and a message that a field is missing. | Report a problem if it still creates the user. |

### Logout - `POST /api/users/logout`

**Description:** Confirms the user logged out (the system does not block old tokens automatically).

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-LOGOUT-001 | Any   | Logout with a valid token | 1. Log in first.<br>2. Select this endpoint.<br>3. Click Send. | You should see **200 OK** with a success message. | Report a problem if you get a different status. |
| TC-LOGOUT-002 | Any   | Logout without a token | 1. Remove the Authorization header.<br>2. Click Send. | You should see **401 Unauthorized**. | Report a problem if it still logs out successfully. |

### Get Current User - `GET /api/users/user`

**Description:** Shows the profile of the logged-in user.

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-ME-001 | Any | Get profile with a valid token | 1. Log in first.<br>2. Select this endpoint.<br>3. Click Send. | You should see **200 OK** and your user details. | Report a problem if you get an error or the data is not yours. |
| TC-ME-002 | Any | Get profile without a token | 1. Remove the Authorization header.<br>2. Click Send. | You should see **401 Unauthorized**. | Report a problem if it works without a token. |

### Upgrade User Role (Admin) - `POST /api/users/upgradeRole`

**Description:** Allows Admin to change someone’s role (for example, to Manager/Teacher).

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-UPR-001 | Admin | Change another user to Manager | 1. Log in as Admin.<br>2. Select this endpoint.<br>3. Enter a valid user ID and the new role (e.g., manager/teacher).<br>4. Click Send. | You should see **200 OK** and a success message. | Report a problem if status is not 200. |
| TC-UPR-002 | User  | User tries to change roles | 1. Log in as a normal User.<br>2. Try to call this endpoint.<br>3. Click Send. | You should see **403 Forbidden**. | Report a problem if the user can change roles. |
| TC-UPR-003 | Admin | Missing fields | 1. Log in as Admin.<br>2. Remove the user ID or role field.<br>3. Click Send. | You should see **400 Bad Request**. | Report a problem if it still works. |

### Create Course - `POST /api/courses/create`

**Description:** Creates a new course. Admin can choose the teacher. Manager creates courses under their own account.

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-CRS-CRT-001 | Manager | Create with valid details | 1. Log in as Manager.<br>2. Enter name, description, price, and optional tags.<br>3. Click Send. | You should see **201 Created** and a success message. | Report a problem if not 201. |
| TC-CRS-CRT-002 | Admin | Create for a specific teacher | 1. Log in as Admin.<br>2. Enter name, description, price, and teacher ID.<br>3. Click Send. | You should see **201 Created**. | Report a problem if not 201. |
| TC-CRS-CRT-003 | Manager | Missing required fields | 1. Remove name or description or price.<br>2. Click Send. | You should see **400 Bad Request**. | Report a problem if it still creates the course. |

### Get All Courses - `GET /api/courses/all`

**Description:** Lists all courses (public).

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-CRS-ALL-001 | Any | View all courses | 1. Open this endpoint.<br>2. Click Send. | You should see **200 OK** and a list of courses. | Report a problem if status is not 200. |

### Get My Courses (Manager) - `GET /api/courses/teacher/mycourses`

**Description:** Shows courses created by the logged-in Manager.

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-CRS-MINE-001 | Manager | View my courses | 1. Log in as Manager.<br>2. Open this endpoint.<br>3. Click Send. | You should see **200 OK** and only your courses. | Report a problem if you see courses from other users. |
| TC-CRS-MINE-002 | User | User tries to access manager list | 1. Log in as User.<br>2. Call this endpoint.<br>3. Click Send. | You should see **403 Forbidden**. | Report a problem if it shows data. |

### Find Course by ID - `GET /api/courses/find/:id`

**Description:** Gets details for one course. Admin can view any; Manager can view only their own.

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-CRS-FIND-001 | Manager | View own course | 1. Log in as Manager.<br>2. Enter the URL with your course ID, e.g., `/api/courses/find/28` (do not include a colon).<br>3. Click Send. | You should see **200 OK** with the course details. | Report a problem if you see an error. |
| TC-CRS-FIND-002 | Manager | Try viewing someone else’s course | 1. Log in as Manager.<br>2. Enter the URL for a course that belongs to another user.<br>3. Click Send. | You should see **404 Not Found**. | Report a problem if it shows the other user’s course. |
| TC-CRS-FIND-003 | Any | Wrong format in URL | 1. Use `/api/courses/find/:28` with a colon on purpose.<br>2. Click Send. | You should see **400 Bad Request** complaining about the id format. | Report a problem if it accepts the wrong format. |

### Update Course - `PUT /api/courses/update`

**Description:** Updates course details and/or tags in one step.

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-CRS-UPD-001 | Manager | Change course name or price | 1. Log in as Manager.<br>2. Provide the course ID and a new name or price.<br>3. Click Send. | You should see **200 OK** with a success message. | Report a problem if status is not 200. |
| TC-CRS-UPD-002 | Manager | Update only tags | 1. Log in as Manager.<br>2. Provide the course ID and the new list of tags (this replaces existing tags).<br>3. Click Send. | You should see **200 OK**. You may see a message like “Course and tags updated successfully.” | Report a problem if tags don’t change. |
| TC-CRS-UPD-003 | Manager | No actual changes | 1. Log in as Manager.<br>2. Send the same values that are already saved.<br>3. Click Send. | You should see **200 OK** with “No changes detected.” | Report a problem if it returns an error. |
| TC-CRS-UPD-004 | Manager | Update someone else’s course | 1. Log in as Manager.<br>2. Provide the ID of a course owned by a different user.<br>3. Click Send. | You should see **404 Not Found**. | Report a problem if it updates the other user’s course. |
| TC-CRS-UPD-005 | Admin | Update any course | 1. Log in as Admin.<br>2. Provide any valid course ID and new data.<br>3. Click Send. | You should see **200 OK**. | Report a problem if Admin is blocked. |

### Delete Course - `DELETE /api/courses/delete`

**Description:** Removes a course.

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-CRS-DEL-001 | Manager | Delete own course | 1. Log in as Manager.<br>2. Enter the course ID in the body.<br>3. Click Send. | You should see **200 OK** and a success message. | Report a problem if not 200. |
| TC-CRS-DEL-002 | Manager | Delete someone else’s course | 1. Log in as Manager.<br>2. Enter the other user’s course ID.<br>3. Click Send. | You should see **404 Not Found**. | Report a problem if it deletes it. |
| TC-CRS-DEL-003 | Admin | Delete any course | 1. Log in as Admin.<br>2. Enter any valid course ID.<br>3. Click Send. | You should see **200 OK**. | Report a problem if Admin cannot delete. |

### Create Tag - `POST /api/courses/tag`

**Description:** Creates a tag.

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-TAG-CRT-001 | Manager | Create a tag with a valid name | 1. Log in as Manager.<br>2. Enter a simple name like "Math".<br>3. Click Send. | You should see **200 OK** and a success message. | Report a problem if not 200. |
| TC-TAG-CRT-002 | Manager | Missing name | 1. Log in as Manager.<br>2. Leave the name empty.<br>3. Click Send. | You should see **400 Bad Request**. | Report a problem if it still creates the tag. |

### Get Tags - `GET /api/courses/tags`

**Description:** Lists all tags.

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-TAG-GET-001 | Any | View tags | 1. Open this endpoint.<br>2. Click Send. | You should see **200 OK** and a list of tags. | Report a problem if not 200. |

### Send Message (Public) - `POST /api/messages/send`

**Description:** Sends a public message without logging in (limited to slow down spam).

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-MSG-SEND-001 | Any | Send a message with valid details | 1. Open this endpoint.<br>2. Enter your email and a short message.<br>3. Click Send. | You should see **201 Created** with a new message ID and your content. | Report a problem if not 201. |
| TC-MSG-SEND-002 | Any | Too many messages (rate limit) | 1. Send more than 3 messages within 10 minutes from the same IP.<br>2. Click Send. | You should see **429 Too Many Requests**. | Report a problem if there is no rate limit. |
| TC-MSG-SEND-003 | Any | Missing message text | 1. Leave the message text empty.<br>2. Click Send. | You should see **400 Bad Request**. | Report a problem if it accepts the empty message. |

### Get All Messages (Admin) - `GET /api/messages/receiveAll`

**Description:** Shows all messages (Admin only).

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-MSG-ALL-001 | Admin | View all messages | 1. Log in as Admin.<br>2. Open this endpoint.<br>3. Click Send. | You should see **200 OK** and a full list. | Report a problem if not 200. |
| TC-MSG-ALL-002 | User  | User tries to view all | 1. Log in as User.<br>2. Call this endpoint.<br>3. Click Send. | You should see **403 Forbidden**. | Report a problem if the user can see all messages. |

### Get My Messages - `GET /api/messages/MyMessages`

**Description:** Shows messages sent from the logged-in user’s email.

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-MSG-MINE-001 | Any | View my messages | 1. Log in.<br>2. Open this endpoint.<br>3. Click Send. | You should see **200 OK** and only messages from your email. | Report a problem if others’ messages appear. |

### Update Message - `PATCH /api/messages/update`

**Description:** Changes a message’s text. Only the sender can change their own messages.

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-MSG-UPD-001 | Any | Update my own message | 1. Log in as the sender.<br>2. Provide the message ID and a new text.<br>3. Click Send. | You should see **200 OK** with a success message. | Report a problem if not 200. |
| TC-MSG-UPD-002 | Any | Try to update someone else’s message | 1. Log in.<br>2. Use the ID of another user’s message.<br>3. Click Send. | You should not see success (expect an error response). | Report a problem if it updates the other user’s message. |
| TC-MSG-UPD-003 | Any | Missing text | 1. Leave the new text empty.<br>2. Click Send. | You should see **400 Bad Request**. | Report a problem if it still updates. |

### Mark Message as Seen (Admin) - `PATCH /api/messages/seen`

**Description:** Marks a message as seen (Admin only).

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-MSG-SEEN-001 | Admin | Mark as seen | 1. Log in as Admin.<br>2. Enter a valid message ID.<br>3. Click Send. | You should see **200 OK** and a message saying it was marked as seen. | Report a problem if not 200. |
| TC-MSG-SEEN-002 | User  | User tries to mark seen | 1. Log in as User.<br>2. Try this endpoint.<br>3. Click Send. | You should see **403 Forbidden**. | Report a problem if the user can mark seen. |

### Delete Message - `DELETE /api/messages/delete`

**Description:** Deletes a message. Admin can delete any; others can delete only their own.

| Test Case ID | Role   | Scenario Description | Steps in Postman | Expected Result | If Something Else Happens |
|--------------|--------|----------------------|------------------|----------------|---------------------------|
| TC-MSG-DEL-001 | Admin | Admin deletes a message | 1. Log in as Admin.<br>2. Enter a message ID.<br>3. Click Send. | You should see **200 OK** with a success message. | Report a problem if not 200. |
| TC-MSG-DEL-002 | Any   | Delete my own message | 1. Log in as the sender.<br>2. Enter your own message ID.<br>3. Click Send. | You should see **200 OK**. | Report a problem if it fails without reason. |
| TC-MSG-DEL-003 | Any   | Try to delete someone else’s message | 1. Log in.<br>2. Use a different user’s message ID.<br>3. Click Send. | You should not see success (expect an error). | Report a problem if it deletes it. |


---

*Documentation last updated: September 2025*

## Admin Management
- **Auth**: Required (Admin role only). All endpoints require the user to have `role: 'admin'` in the database.
- **Base URL**: `/api/admin`

### Get All Students
- **Method**: GET
- **URL**: `/api/admin/students`
- **Auth**: Required (Admin only)
- **Response**: 200 with array of users (role: 'user')
- **Description**: Retrieve all users with role 'user'.
- **Example Response**: `[{ "id": 1, "name": "John Doe", "email": "john@example.com" }]`

### Get All Teachers
- **Method**: GET
- **URL**: `/api/admin/teachers`
- **Auth**: Required (Admin only)
- **Response**: 200 with array of users (role: 'teacher')
- **Description**: Retrieve all users with role 'teacher'.
- **Example Response**: `[{ "id": 2, "name": "Jane Smith", "email": "jane@example.com" }]`

### Get All Admins
- **Method**: GET
- **URL**: `/api/admin/admins`
- **Auth**: Required (Admin only)
- **Response**: 200 with array of users (role: 'admin')
- **Description**: Retrieve all users with role 'admin'.
- **Example Response**: `[{ "id": 3, "email": "admin@example.com" }]`

### Delete Student
- **Method**: DELETE
- **URL**: `/api/admin/students/:id`
- **Auth**: Required (Admin only)
- **Path Params**: `id` (integer, user ID)
- **Response**: 200 (deleted) or 404 (not found)
- **Description**: Delete a user with role 'user' by ID.

### Delete Teacher
- **Method**: DELETE
- **URL**: `/api/admin/teachers/:id`
- **Auth**: Required (Admin only)
- **Path Params**: `id` (integer, user ID)
- **Response**: 200 (deleted) or 404 (not found)
- **Description**: Delete a user with role 'teacher' by ID.
