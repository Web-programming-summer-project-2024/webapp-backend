

# Social Media App Backend

This is the backend for a social media application that allows users to register, login, create posts, comment on posts, like posts, and filter/search posts.

## Team
- **Hajri**: Responsible for the entire backend development.

## Features
- User registration and login
- Password recovery using OTP
- Create, update, delete posts
- Comment on posts
- Like posts
- Search and filter posts

## Technologies
- Node.js
- Express.js
- PostgreSQL
- JWT for authentication
- Nodemailer for sending emails

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL

### Installation

1. Clone the repository
    ```sh
    git clone https://github.com/your-username/social-media-app-backend.git
    cd social-media-app-backend
    ```

2. Install NPM packages
    ```sh
    npm install
    ```

3. Set up your PostgreSQL database and add your connection string to a `.env` file
    ```env
    DATABASE_URL=your-database-url
    JWT_SECRET=your-jwt-secret
    EMAIL_SERVICE=your-email-service
    EMAIL_USERNAME=your-email-username
    EMAIL_PASSWORD=your-email-password
    ```

4. Create the necessary tables
    ```sh
    node dbSetup.js
    ```

5. Seed the database with an admin user and sample posts
    ```sh
    node seed-db.js
    ```

### Running the Server

Start the server
```sh
npm start
```

<br>
<br>



## Application Architecture

The backend is organized as follows:

- **Routes**: Define the API endpoints and map them to corresponding controller functions.
- **Controllers**: Handle the business logic, processing requests, and returning responses.
- **Models**: Interact with the database using SQL queries and return data to the controllers.
- **Middleware**: Custom functions to handle tasks such as authentication, validation, and error handling.
- **Utilities**: Common helper functions used across the application, such as generating tokens or sending emails.
- **Configuration**: Setup for environment variables and database connections.

### Directory Structure
```plaintext

/social-media-app-backend
│
├── /config               # Configuration files
│   └── db.js             # Database connection setup
│
├── /controllers          # Application logic controllers
│   ├── authController.js
│   ├── postController.js
│   └── userController.js
│
├── /middleware           # Custom middleware
│   ├── authMiddleware.js # JWT authentication middleware
│   ├── errorMiddleware.js # Global error handling
│   └── validationMiddleware.js # Validation middleware
│
├── /models               # Database interaction models
│   ├── Comment.js
│   ├── Like.js
│   ├── Post.js
│   └── User.js
│
├── /routes               # API routes
│   ├── authRoutes.js
│   ├── postRoutes.js
│   └── userRoutes.js
│
├── /utils                # Utility functions
│   ├── generateToken.js  # JWT token generation
│   └── sendEmail.js      # Email sending utility
│
├── /public               # Public assets (e.g., images)
│   └── images
│
├── .env                  # Environment variables
├── server.js             # Entry point to the application
├── dbSetup.js            # Script to create database tables
└── seed-db.js            # Script to seed the database with initial data
```
<br>


## API Endpoints

### Authentication

- **POST `/api/auth/register`**
  - **Description**: Register a new user.
  - **Body Parameters**:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

- **POST `/api/auth/login`**
  - **Description**: Login with email and password.
  - **Body Parameters**:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

- **POST `/api/auth/forgotpassword`**
  - **Description**: Initiate password recovery with email.
  - **Body Parameters**:
    ```json
    {
      "email": "string"
    }
    ```

- **POST `/api/auth/verify-otp`**
  - **Description**: Verify the OTP sent to the user's email.
  - **Body Parameters**:
    ```json
    {
      "otp": "string"
    }
    ```

- **PUT `/api/auth/resetpassword`**
  - **Description**: Reset the user's password using a verified OTP.
  - **Body Parameters**:
    ```json
    {
      "otp": "string",
      "newPassword": "string"
    }
    ```

### Posts

- **GET `/api/posts`**
  - **Description**: Retrieve all posts, sorted by date or likes.
  - **Query Parameters**:
    ```plaintext
    sortBy=recent|likes (optional)
    page=integer (optional)
    limit=integer (optional)
    ```

- **POST `/api/posts`**
  - **Description**: Create a new post.
  - **Body Parameters**:
    ```json
    {
      "title": "string",
      "description": "string",
      "image": "file" // optional, multipart/form-data
    }
    ```
  - **Headers**:
    ```plaintext
    Authorization: Bearer token (required)
    ```

- **GET `/api/posts/:id`**
  - **Description**: Retrieve a specific post by ID.
  - **Path Parameters**:
    ```plaintext
    id=integer
    ```

- **PUT `/api/posts/:id`**
  - **Description**: Update a specific post by ID.
  - **Path Parameters**:
    ```plaintext
    id=integer
    ```
  - **Body Parameters**:
    ```json
    {
      "title": "string",
      "description": "string",
      "image": "file" // optional, multipart/form-data
    }
    ```
  - **Headers**:
    ```plaintext
    Authorization: Bearer token (required)
    ```

- **DELETE `/api/posts/:id`**
  - **Description**: Delete a specific post by ID.
  - **Path Parameters**:
    ```plaintext
    id=integer
    ```
  - **Headers**:
    ```plaintext
    Authorization: Bearer token (required)
    ```

- **POST `/api/posts/:id/like`**
  - **Description**: Like a specific post.
  - **Path Parameters**:
    ```plaintext
    id=integer
    ```
  - **Headers**:
    ```plaintext
    Authorization: Bearer token (required)
    ```

### Comments

- **POST `/api/posts/:postId/comments`**
  - **Description**: Create a new comment on a specific post.
  - **Path Parameters**:
    ```plaintext
    postId=integer
    ```
  - **Body Parameters**:
    ```json
    {
      "text": "string"
    }
    ```
  - **Headers**:
    ```plaintext
    Authorization: Bearer token (required)
    ```

- **GET `/api/posts/:postId/comments`**
  - **Description**: Retrieve all comments for a specific post.
  - **Path Parameters**:
    ```plaintext
    postId=integer
    ```

- **DELETE `/api/posts/:postId/comments/:commentId`**
  - **Description**: Delete a specific comment by ID.
  - **Path Parameters**:
    ```plaintext
    postId=integer
    commentId=integer
    ```
<br>
<br>

# Database Schema

The database uses PostgreSQL and contains the following key tables:

### 1. **Users**
- `id` (Primary Key): Auto-incrementing integer.
- `email`: User's unique email address.
- `password`: Hashed password.
- `reset_password_token`: Token for password recovery.
- `reset_password_expire`: Expiry time for the password recovery token.
- `created_at`: Timestamp of user creation.

### 2. **Posts**
- `id` (Primary Key): Auto-incrementing integer.
- `title`: Title of the post.
- `description`: Content of the post.
- `author` (Foreign Key): References the `users` table.
- `date`: Timestamp when the post was created.
- `image_url`: URL of the image associated with the post.
- `likes`: Number of likes the post has received.

### 3. **Comments**
- `id` (Primary Key): Auto-incrementing integer.
- `text`: Content of the comment.
- `author` (Foreign Key): References the `users` table.
- `post_id` (Foreign Key): References the `posts` table.
- `date`: Timestamp when the comment was created.

### 4. **Likes**
- `id` (Primary Key): Auto-incrementing integer.
- `user_id` (Foreign Key): References the `users` table.
- `post_id` (Foreign Key): References the `posts` table.
- **Composite Unique Constraint**: Ensures a user can only like a post once.
