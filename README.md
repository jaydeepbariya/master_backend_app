# master_backend_app

A backend application demonstrating key backend development features and practices. 

## Features

- **Routing**: Define and manage routes for handling API requests.
- **Middleware**: Implement functionality to process requests before they reach route handlers.
- **JWT Authentication**: Secure endpoints with JSON Web Token-based authentication.
- **Prisma ORM**: Use Prisma for type-safe database interactions with PostgreSQL.
- **Email Sending**: Send emails programmatically from the application.
- **Caching**: Implement caching strategies to enhance performance.
- **API Rate Limit**: Prevent abuse by limiting the number of API requests from clients.
- **Logging**: Record and manage application logs for monitoring and debugging.
- **Validation**: Validate values coming in request body

## Tech Stack

- **Node.js**: JavaScript runtime for server-side applications.
- **Express.js**: Web framework for building robust APIs.
- **PostgreSQL**: Relational database management system.
- **Prisma**: Modern ORM for database operations.
- **Redis**: In-memory data structure store used for caching.
- **Vine**: Validate values coming in req.body
- **JWT**: Library for handling JSON Web Tokens.
- **Winston**: Logger for application logging.

## NPM Packages

- **express**: Web framework for building APIs.
- **jsonwebtoken**: Library for creating and verifying JWTs.
- **prisma**: ORM tool for PostgreSQL database interaction.
- **redis**: Redis client for Node.js.
- **nodemailer**: Module for sending emails.
- **rate-limit-redis**: Rate limiting with Redis for API requests.
- **winston**: Logging library for Node.js applications.

## Setup Instructions

1. Clone the repository:
    ```bash
    git clone https://github.com/jaydeepbariya/master_backend_app.git
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Update the `.env` file with your configuration:
    ```bash
    cp .env.example .env
    # Edit .env with your specific settings
    ```
4. Start the application:
    ```bash
    npm run start
    ```

## Redis Setup

Run Redis on Docker using the following link for more details:
[Redis Docker Hub](https://hub.docker.com/r/redis/redis-stack)

## License

[MIT License](LICENSE)
