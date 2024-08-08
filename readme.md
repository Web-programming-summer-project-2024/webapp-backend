

# Social Media App Backend

This is the backend for a social media application that allows users to register, login, create posts, comment on posts, like posts, and filter/search posts.

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
