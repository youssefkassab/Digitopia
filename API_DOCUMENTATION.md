# Digitopia API - Usage Guide & Restrictions

## Access Requirements

### Base URL
All API requests must be made to: `http://localhost:3000/api`

### Required Headers
- `Content-Type: application/json` for all requests with body
- `Authorization: Bearer <token>` for protected routes

## Rate Limits & Quotas

### Authentication Endpoints
- **Rate Limit**: 5 requests per 15 minutes per IP
- **Affected Routes**:
  - `POST /users/login`
  - `POST /users/signup`

### API Endpoints
- **Default Rate Limit**: 100 requests per minute per IP
- **Upload/Download Limits**: 10MB per request

## Authentication

### Obtaining a Token
1. Make a POST request to `/users/login` with email and password
2. Store the received token securely (e.g., in localStorage for web apps)
3. Include the token in the `Authorization` header for subsequent requests

### Token Expiration
- Tokens expire after 1 hour of inactivity
- No automatic refresh mechanism - user must log in again

## Role-Based Access Control

### Available Roles
1. **Admin** (`admin`)
   - Full access to all resources
   - Can manage users and courses

2. **Teacher** (`teacher`)
   - Can create/update/delete their own courses
   - Can view all courses

3. **User** (`user`)
   - Can view courses
   - Cannot modify any resources

### Endpoint Restrictions
| Endpoint | User | Teacher | Admin |
|----------|------|---------|-------|
| GET /courses | ✓ | ✓ | ✓ |
| POST /courses/create | ✗ | ✓ | ✓ |
| PUT/DELETE /courses/:id | ✗ | Owner only | ✓ |
| GET /users | ✗ | ✗ | ✓ |

## API Endpoints Reference

### Authentication

#### Login
```http
POST /users/login
```
**Restrictions**:
- Max 5 attempts per 15 minutes
- Account locked for 15 minutes after 5 failed attempts

#### Signup
```http
POST /users/signup
```
**Restrictions**:
- Email must be unique
- Password must be at least 8 characters with letters and numbers
- Role must be one of: 'admin', 'teacher', 'user'

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
**Restrictions**:
- Email must be unique across all users
- Password is hashed before storage
- Default role is 'user'

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

## Support
For additional help, please contact:
- Email: support@digitopia.com
- Documentation: https://docs.digitopia.com
- Status Page: https://status.digitopia.com

---

*Documentation last updated: August 2025*
