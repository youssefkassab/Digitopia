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

## Base URL & Headers

### Base URL
All API requests must be made to: `http://localhost:3000/api`

### Required Headers
- `Content-Type: application/json` (for requests with body)
- `Authorization: Bearer <token>` (for protected routes)

## Rate Limits

| Endpoint Type       | Rate Limit           | Notes                             |
|---------------------|---------------------|-----------------------------------|
| Authentication      | 5 req/15 min/IP     | Applies to login/signup endpoints |
| API Endpoints       | 100 req/min/IP      | Applies to all other endpoints    |
| File Uploads        | 10MB max per request| For future file upload features   |

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
}

// Teacher request (teacher_id is set automatically)
{
  "name": "Advanced Web Development",
  "description": "Master modern web technologies",
  "price": 149.99
}
```

**Required Fields**
- `name`: Course title
- `description`: Course description
- `price`: Course price (number)
- `teacher_id`: Required only for admin users (to assign to specific teacher)

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
GET /api/courses/find
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": 1
}
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

**Error Responses**
- `400 Bad Request`: Missing course ID
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
}
```

**Notes**:
- Teachers can only update their own courses
- Admins can update any course
- Only include fields that need to be updated

**Success Response (200 OK)**
```json
{
  "message": "Course updated successfully."
}
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
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
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


---

*Documentation last updated: August 2025*
