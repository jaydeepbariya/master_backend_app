# API Documentation - Master Backend App

Complete API reference with cURL examples and detailed usage instructions.

## Table of Contents
1. [Authentication](#authentication)
2. [Auth Endpoints](#auth-endpoints)
3. [Profile Endpoints](#profile-endpoints)
4. [News Endpoints](#news-endpoints)
5. [Email Endpoints](#email-endpoints)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)

---

## Authentication

### JWT Token Format
All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJ1c2VyX2lkIjoxLCJpYXQiOjE2OTExMjM0NTZ9.xyz...
```

### Token Details
- **Expiry**: 2 days
- **Algorithm**: HS256 (HMAC SHA-256)
- **Payload**: Contains user info (name, email, user_id)

### How to Get a Token
1. Call the `/auth/register` endpoint with new user details
2. Call the `/auth/login` endpoint with email and password
3. Extract the `token` from the response
4. Use this token in subsequent requests

---

## Auth Endpoints

### 1. Register User

Creates a new user account in the system.

**Endpoint:**
```
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Validation Rules:**
- `name`: String, required, 3-50 characters
- `email`: Valid email format, required, must be unique
- `password`: String, required, minimum 6 characters

**cURL Example:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User Registration Successful",
  "userData": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "profile": null,
    "created_at": "2024-07-30T15:29:06.000Z",
    "updated_at": "2024-07-30T15:29:06.000Z"
  }
}
```

**Error Responses:**

*Email Already Exists (400):*
```json
{
  "success": false,
  "message": "User already exists"
}
```

*Validation Failed (400):*
```json
{
  "success": false,
  "message": "Validation Failed",
  "errors": {
    "email": "The email field must be a valid email address"
  }
}
```

---

### 2. Login User

Authenticates user and returns JWT token.

**Endpoint:**
```
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Validation Rules:**
- `email`: Valid email format, required
- `password`: String, required

**cURL Example:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login Successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "profile": null,
    "created_at": "2024-07-30T15:29:06.000Z",
    "updated_at": "2024-07-30T15:29:06.000Z"
  },
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

*User Not Found (401):*
```json
{
  "success": false,
  "message": "User does not exist"
}
```

*Invalid Password (401):*
```json
{
  "success": false,
  "message": "Invalid Credentials"
}
```

---

### 3. Get User Profile

Retrieves authenticated user's profile information.

**Endpoint:**
```
GET /api/v1/auth/profile
```

**Authentication:** Required ✓

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**cURL Example:**
```bash
curl -X GET http://localhost:4000/api/v1/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User Details Fetched",
  "userData": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "profile": "https://res.cloudinary.com/xxx/image.jpg",
    "created_at": "2024-07-30T15:29:06.000Z",
    "updated_at": "2024-07-30T15:29:06.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Profile Endpoints

### 4. Update User Profile Picture

Updates the user's profile picture via Cloudinary.

**Endpoint:**
```
PUT /api/v1/profile/:id
```

**Parameters:**
- `:id` - User ID (must match authenticated user)

**Authentication:** Required ✓

**Request Body:** Form Data
- `profile` (file): Image file (JPEG, PNG, GIF)
  - Max size: 5MB
  - Supported formats: JPG, JPEG, PNG, GIF

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**cURL Example:**
```bash
curl -X PUT http://localhost:4000/api/v1/profile/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "profile=@/path/to/image.jpg"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "profile updated"
}
```

**Error Responses:**

*No Image Provided (400):*
```json
{
  "success": false,
  "message": "Image not provided"
}
```

*Invalid Image Format (400):*
```json
{
  "success": false,
  "message": "Invalid image format. Allowed: JPG, JPEG, PNG, GIF"
}
```

*Image Too Large (400):*
```json
{
  "success": false,
  "message": "Image size exceeds maximum limit of 5MB"
}
```

---

## News Endpoints

### 5. Create News Article

Creates a new news article with an image.

**Endpoint:**
```
POST /api/v1/news
```

**Authentication:** Required ✓

**Request Body:** Form Data
- `title` (string): Article title (max 200 characters)
- `content` (string): Article content
- `image` (file): Article image (JPEG, PNG, GIF)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**cURL Example:**
```bash
curl -X POST http://localhost:4000/api/v1/news \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "title=Breaking News" \
  -F "content=This is the news content..." \
  -F "image=@/path/to/image.jpg"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "News created",
  "news": {
    "id": 5,
    "user_id": 1,
    "title": "Breaking News",
    "content": "This is the news content...",
    "image": "https://res.cloudinary.com/xxx/image.jpg",
    "created_at": "2024-07-31T15:35:48.000Z",
    "updated_at": "2024-07-31T15:35:48.000Z"
  }
}
```

**Error Responses:**

*Image Missing (400):*
```json
{
  "success": false,
  "message": "Image required"
}
```

*Validation Failed (500):*
```json
{
  "success": false,
  "message": "Validation Failed"
}
```

---

### 6. Get All News (Paginated)

Fetches all news articles with pagination support.

**Endpoint:**
```
GET /api/v1/news?page=1&limit=5
```

**Authentication:** Not required

**Query Parameters:**
- `page` (number, optional): Page number (default: 1, minimum: 1)
- `limit` (number, optional): Items per page (default: 2, max: 10)

**cURL Example:**
```bash
# Get first page with 5 items per page
curl -X GET "http://localhost:4000/api/v1/news?page=1&limit=5" \
  -H "Content-Type: application/json"

# Get second page with default limit
curl -X GET "http://localhost:4000/api/v1/news?page=2" \
  -H "Content-Type: application/json"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "News Fetched",
  "metadata": {
    "totalNews": 25,
    "totalPages": 5,
    "currentPage": 1,
    "currentLimit": 5
  },
  "news": [
    {
      "id": 1,
      "user_id": 1,
      "title": "First News",
      "content": "Content here...",
      "image": "https://res.cloudinary.com/xxx/image.jpg",
      "created_at": "2024-07-31T10:00:00.000Z",
      "updated_at": "2024-07-31T10:00:00.000Z",
      "user": {
        "id": 1,
        "name": "John Doe",
        "profile": "https://res.cloudinary.com/xxx/profile.jpg"
      }
    },
    {
      "id": 2,
      "user_id": 2,
      "title": "Second News",
      "content": "More content...",
      "image": "https://res.cloudinary.com/xxx/image2.jpg",
      "created_at": "2024-07-31T11:00:00.000Z",
      "updated_at": "2024-07-31T11:00:00.000Z",
      "user": {
        "id": 2,
        "name": "Jane Smith",
        "profile": "https://res.cloudinary.com/xxx/profile2.jpg"
      }
    }
  ]
}
```

---

### 7. Get Single News (With Redis Caching)

Fetches a single news article by ID. Results are cached in Redis for optimal performance.

**Endpoint:**
```
GET /api/v1/news/:id
```

**Parameters:**
- `:id` - News article ID

**Authentication:** Not required

**Cache Behavior:**
- First request: Fetches from database, stores in Redis
- Subsequent requests: Served from Redis cache until expiry
- Cache TTL: Implemented in application config

**cURL Example:**
```bash
curl -X GET http://localhost:4000/api/v1/news/1 \
  -H "Content-Type: application/json"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "News Fetched",
  "news": {
    "id": 1,
    "user_id": 1,
    "title": "First News",
    "content": "Content here...",
    "image": "https://res.cloudinary.com/xxx/image.jpg",
    "created_at": "2024-07-31T10:00:00.000Z",
    "updated_at": "2024-07-31T10:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "News not found"
}
```

---

### 8. Update News Article

Updates a news article (only by the author).

**Endpoint:**
```
PUT /api/v1/news/:id
```

**Parameters:**
- `:id` - News article ID

**Authentication:** Required ✓

**Request Body:** Form Data
- `title` (string, optional): Updated title
- `content` (string, optional): Updated content
- `image` (file, optional): Updated image

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**cURL Example:**
```bash
curl -X PUT http://localhost:4000/api/v1/news/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "title=Updated Title" \
  -F "content=Updated content..." \
  -F "image=@/path/to/updated-image.jpg"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "News updated",
  "news": {
    "id": 1,
    "user_id": 1,
    "title": "Updated Title",
    "content": "Updated content...",
    "image": "https://res.cloudinary.com/xxx/updated.jpg",
    "created_at": "2024-07-31T10:00:00.000Z",
    "updated_at": "2024-07-31T12:30:00.000Z"
  }
}
```

**Error Responses:**

*Unauthorized (400):*
```json
{
  "success": false,
  "message": "you cannot update this news"
}
```

*Article Not Found (404):*
```json
{
  "success": false,
  "message": "News not found"
}
```

---

### 9. Delete News Article

Deletes a news article (only by the author).

**Endpoint:**
```
DELETE /api/v1/news/:id
```

**Parameters:**
- `:id` - News article ID

**Authentication:** Required ✓

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:4000/api/v1/news/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "News deleted"
}
```

**Error Responses:**

*Unauthorized (400):*
```json
{
  "success": false,
  "message": "you cannot delete this news"
}
```

*Article Not Found (404):*
```json
{
  "success": false,
  "message": "News not found"
}
```

---

## Email Endpoints

### 10. Send Email

Sends an email to a user using Nodemailer.

**Endpoint:**
```
POST /api/v1/send-email
```

**Authentication:** Required ✓

**Request Body:**
```json
{
  "recipient": "user@example.com",
  "subject": "Welcome to our platform",
  "message": "Thank you for signing up!"
}
```

**Validation Rules:**
- `recipient`: Valid email format, required
- `subject`: String, required
- `message`: String, required

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**cURL Example:**
```bash
curl -X POST http://localhost:4000/api/v1/send-email \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "user@example.com",
    "subject": "Welcome",
    "message": "Thank you for signing up!"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to send email"
}
```

---

## Error Handling

### Standard Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {} // Optional validation errors
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation failed, invalid data |
| 401 | Unauthorized | Missing or invalid token |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "User already exists" | Email already registered | Use different email or login |
| "Invalid Credentials" | Wrong password | Check password |
| "Unauthorized" | Missing/invalid token | Include valid JWT token |
| "Image required" | No file uploaded | Attach image in request |
| "you cannot update this news" | Not the author | Only author can update |

---

## Rate Limiting

The API implements rate limiting to prevent abuse.

### Rate Limit Headers

Each response includes these headers:

```
X-RateLimit-Limit: 100          # Maximum requests allowed
X-RateLimit-Remaining: 95       # Requests remaining
X-RateLimit-Reset: 1691234560   # Unix timestamp when limit resets
```

### Limits

- **Default**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 5 requests per 15 minutes (stricter for security)

### Rate Limit Response (429)

When rate limit exceeded:

```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

---

## Testing the API

### Using Postman

1. Import the API endpoints into Postman
2. Create an environment with variables:
   - `token`: JWT token from login response
   - `user_id`: User ID from login response
   - `news_id`: News article ID for testing

3. Use these variables in requests:
   ```
   Authorization: Bearer {{token}}
   PUT /api/v1/profile/{{user_id}}
   ```

### Using cURL

All cURL examples are provided in each endpoint section above.

### Using Thunder Client or REST Client

Example VS Code REST Client extension:

```http
### Login
POST http://localhost:4000/api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

### Get Profile
@token = Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

GET http://localhost:4000/api/v1/auth/profile
Authorization: {{token}}
```

---

## Webhook/Integration Notes

- Currently no webhook support
- Consider implementing webhooks for real-time notifications
- Future: Add webhook support for news creation, updates

---

## API Versioning

Current API Version: **v1**

URL Format: `/api/v1/endpoint`

---

## Support & Feedback

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: developer@example.com

