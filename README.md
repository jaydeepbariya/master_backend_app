# Master Backend App

A comprehensive Node.js backend application demonstrating professional backend development practices including authentication, content management, caching, rate limiting, and email notifications.

## Features

### Core Functionality
- 🔐 **JWT Authentication**: Secure API endpoints with token-based authentication
- 📰 **News Management**: Create, read, update, and delete news articles with image uploads
- 👤 **User Profiles**: Manage user information and profile pictures
- 📧 **Email Notifications**: Send emails to users with Nodemailer integration
- 🖼️ **Image Hosting**: Upload and manage images via Cloudinary

### Technical Features
- 🗄️ **Database ORM**: Prisma with PostgreSQL for type-safe database operations
- ⚡ **Caching**: Redis integration for improved performance
- 🛡️ **Security**: JWT tokens, password hashing with bcrypt, CORS, Helmet middleware
- 📊 **Rate Limiting**: Express rate limiting to prevent API abuse
- 📝 **Data Validation**: Vine.js for robust request validation
- 📋 **Logging**: Winston logger for application monitoring and debugging
- 📤 **File Uploads**: Support for image uploads with validation

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Caching** | Redis |
| **Authentication** | JWT |
| **Security** | bcrypt, Helmet |
| **Logging** | Winston |
| **Validation** | Vine.js |
| **File Storage** | Cloudinary |
| **Email** | Nodemailer |

## Architecture Overview

```
Client
  ↓
Express Server
  ↓
Middleware (Auth, Rate Limit, Validation)
  ↓
Routes (Auth, News, Profile)
  ↓
Controllers (Business Logic)
  ↓
Prisma ORM ← → PostgreSQL Database
  ↓           ← → Redis Cache
```

## Database Schema

### Users Table
```prisma
model Users {
  id         Int       @id @default(autoincrement())
  name       String
  email      String    @unique
  password   String    (hashed with bcrypt)
  profile    String?   (Cloudinary URL)
  created_at DateTime  @default(now())
  updated_at DateTime  @default(now())
  News       News[]    (One-to-Many relationship)
}
```

### News Table
```prisma
model News {
  id         Int       @id @default(autoincrement())
  user_id    Int       (Foreign key)
  user       Users     @relation
  title      String    (Max 200 characters)
  content    String
  image      String    (Cloudinary URL)
  created_at DateTime  @default(now())
  updated_at DateTime  @default(now())
}
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- Redis server
- Cloudinary account (for image hosting)
- Nodemailer configuration (Gmail/custom SMTP)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jaydeepbariya/master_backend_app.git
   cd master_backend_app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Server
   PORT=4000
   
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/master_backend_app"
   
   # JWT
   JWT_SECRET="your_jwt_secret_key_here"
   
   # Cloudinary
   CLOUDINARY_NAME="your_cloudinary_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   
   # Email (Nodemailer)
   MAIL_HOST="smtp.gmail.com"
   MAIL_USER="your_email@gmail.com"
   MAIL_PORT=587
   MAIL_PASS="your_app_password"
   
   # Redis
   REDIS_URL="redis://localhost:6379"
   
   # CORS
   CLIENT_URL="http://localhost:3000"
   ```

4. **Setup PostgreSQL Database:**
   ```bash
   npm run prisma:migrate
   ```

5. **Start Redis:**
   ```bash
   docker run -d -p 6379:6379 redis/redis-stack
   ```
   
   Or install and run locally: [Redis Docker Hub](https://hub.docker.com/r/redis/redis-stack)

6. **Start the development server:**
   ```bash
   npm run start
   ```
   
   The server will run on `http://localhost:4000`

## API Documentation

### Base URL
```
http://localhost:4000/api/v1
```

### Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_token_here>
```

---

## Auth Endpoints

### 1. Register User
- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Authentication:** Not required
- **Description:** Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
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

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

---

### 2. Login User
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Authentication:** Not required
- **Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
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

**Error Response (401):**
```json
{
  "success": false,
  "message": "User does not exist" / "Invalid Credentials"
}
```

---

### 3. Get User Profile
- **Method:** `GET`
- **Endpoint:** `/auth/profile`
- **Authentication:** Required ✓
- **Description:** Fetch authenticated user's profile information

**Headers:**
```
Authorization: Bearer <token>
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
    "profile": "https://cloudinary-url.com/image.jpg",
    "created_at": "2024-07-30T15:29:06.000Z",
    "updated_at": "2024-07-30T15:29:06.000Z"
  }
}
```

---

## Profile Endpoints

### 4. Update User Profile
- **Method:** `PUT`
- **Endpoint:** `/profile/:id`
- **Authentication:** Required ✓
- **Description:** Update user profile picture

**Parameters:**
- `id` (path): User ID

**Request Body (Form Data):**
- `profile` (file): Profile image file (JPEG/PNG/GIF)

**Success Response (200):**
```json
{
  "success": true,
  "message": "profile updated"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Image not provided" / "Invalid image format"
}
```

---

## News Endpoints

### 5. Create News
- **Method:** `POST`
- **Endpoint:** `/news`
- **Authentication:** Required ✓
- **Description:** Create a new news article with image

**Request Body (Form Data):**
- `title` (string): Article title (max 200 characters)
- `content` (string): Article content
- `image` (file): Article image (JPEG/PNG/GIF)

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
    "image": "https://cloudinary-url.com/image.jpg",
    "created_at": "2024-07-31T15:35:48.000Z",
    "updated_at": "2024-07-31T15:35:48.000Z"
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Image required" / "Validation Failed" / "Error message"
}
```

---

### 6. Get All News (Paginated)
- **Method:** `GET`
- **Endpoint:** `/news`
- **Authentication:** Not required
- **Description:** Fetch all news articles with pagination

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page, max 10 (default: 2)

**Example Request:**
```
GET /api/v1/news?page=1&limit=5
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "News Fetched",
  "metadata": {
    "totalNews": 15,
    "totalPages": 3,
    "currentPage": 1,
    "currentLimit": 5
  },
  "news": [
    {
      "id": 1,
      "user_id": 1,
      "title": "First News",
      "content": "Content here...",
      "image": "https://cloudinary-url.com/image.jpg",
      "created_at": "2024-07-31T10:00:00.000Z",
      "updated_at": "2024-07-31T10:00:00.000Z",
      "user": {
        "id": 1,
        "name": "John Doe",
        "profile": "https://cloudinary-url.com/profile.jpg"
      }
    }
  ]
}
```

---

### 7. Get Single News (With Caching)
- **Method:** `GET`
- **Endpoint:** `/news/:id`
- **Authentication:** Not required
- **Description:** Fetch a single news article (uses Redis cache)
- **Cache Strategy:** First request caches the data; subsequent requests serve from cache

**Parameters:**
- `id` (path): News article ID

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
    "image": "https://cloudinary-url.com/image.jpg",
    "created_at": "2024-07-31T10:00:00.000Z",
    "updated_at": "2024-07-31T10:00:00.000Z"
  }
}
```

---

### 8. Update News
- **Method:** `PUT`
- **Endpoint:** `/news/:id`
- **Authentication:** Required ✓
- **Description:** Update a news article (only by author)

**Parameters:**
- `id` (path): News article ID

**Request Body (Form Data):**
- `title` (string, optional): Updated title
- `content` (string, optional): Updated content
- `image` (file, optional): Updated image

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
    "image": "https://cloudinary-url.com/updated.jpg",
    "created_at": "2024-07-31T10:00:00.000Z",
    "updated_at": "2024-07-31T12:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "you cannot update this news"
}
```

---

### 9. Delete News
- **Method:** `DELETE`
- **Endpoint:** `/news/:id`
- **Authentication:** Required ✓
- **Description:** Delete a news article (only by author)

**Parameters:**
- `id` (path): News article ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "News deleted"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "you cannot delete this news"
}
```

---

## Email Endpoints

### 10. Send Email
- **Method:** `POST`
- **Endpoint:** `/send-email`
- **Authentication:** Required ✓
- **Description:** Send email notification to users

**Request Body:**
```json
{
  "recipient": "user@example.com",
  "subject": "Welcome to our platform",
  "message": "Thank you for signing up!"
}
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

## Security Features

### Rate Limiting
- API requests are rate-limited using express-rate-limit
- Default limit: Configurable per endpoint
- Strategy: Redis-backed rate limiting for distributed systems

### Password Security
- Passwords hashed with bcrypt (salt rounds: 12)
- Never transmitted in responses
- Validated on login with secure comparison

### CORS Configuration
```javascript
Origin: http://localhost:3000
Credentials: true
```

### Additional Security
- **Helmet.js**: Sets HTTP security headers
- **JWT Expiry**: Tokens expire in 2 days
- **Input Validation**: All inputs validated with Vine.js
- **File Upload Validation**: Images validated by type and size

---

## Available NPM Scripts

```bash
npm run start        # Start development server with nodemon
npm run build        # Build for production
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio GUI
```

---

## Project Structure

```
master_backend_app/
├── config/              # Configuration files
│   ├── cloudinaryConfig.js
│   ├── dbConfig.js
│   ├── logConfig.js
│   └── rateLimitConfig.js
├── controllers/         # Business logic
│   ├── AuthController.js
│   ├── NewsController.js
│   └── ProfileController.js
├── routes/             # API routes
│   └── authRoute.js
├── validations/        # Input validation schemas
│   ├── authValidation.js
│   └── newsValidation.js
├── middlwares/        # Custom middleware
│   └── Auth.js
├── util/              # Utility functions
│   ├── sendEmail.js
│   └── validateImage.js
├── data/              # Static data
│   └── imageFormats.js
├── prisma/            # Database schema and migrations
│   ├── schema.prisma
│   └── migrations/
├── server.js          # Application entry point
├── package.json
└── README.md
```

---

## Known Limitations & Future Improvements

### Current Limitations
- Single-database approach (no read replicas)
- Email sending limited to Nodemailer (no queue system)
- No pagination for user endpoints
- Cache invalidation is manual

### Future Enhancements
- [ ] Job queue system (BullMQ) for async tasks
- [ ] Refresh token rotation
- [ ] Search functionality for news articles
- [ ] User roles and permissions (RBAC)
- [ ] Comment system for news articles
- [ ] Social features (likes, follows)
- [ ] API versioning strategy
- [ ] Comprehensive error handling
- [ ] Integration tests and unit tests

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## Contact & Support

For questions or support, please reach out or open an issue on GitHub.

**Built with ❤️ by Jay Deep Bariya**
