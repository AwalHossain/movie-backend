# 🍿 MovieHub Application

<p align="center">
<span style="font-size: 80px;">📽️</span>
</p>

<p align="center">
 <img src="https://img.shields.io/badge/Node.js-15.3.1-black" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/MongoDB-6.x-green" alt="MongoDB">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

A robust backend for MovieHub - a real-time movie rating platform with authentication, movie management, and real-time updates using Socket.IO. Built with modern web technologies and featuring a responsive, user-friendly interface.

## 📋 Features

- **Authentication System**
  - JWT-based authentication with Access & Refresh tokens
  - Secure password hashing with bcrypt
  - Protected routes for movie creation and rating

- **Movie Management**
  - CRUD operations for movies
  - Advanced search, filtering, sorting, and pagination
  - Default image fallbacks

- **Rating & Reviews**
  - User ratings and reviews for movies
  - Prevention of duplicate reviews per user
  - Compound indexing for optimized queries

- **Real-time Updates**
  - Socket.IO integration for live updates
  - Real-time notifications for new movies
  - Instant review updates

- **Error Handling & Logging**
  - Comprehensive error handling
  - Winston-based logging system
  - Request validation

## 🛠️ Tech Stack

- **Core**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt, Passport
- **Real-time**: Socket.IO
- **Validation**: Zod
- **Logging**: Winston
- **Testing**: Jest

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/moviehub-backend.git
cd moviehub-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file with the following variables:

```env
# Server
PORT=8001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/moviehub

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:3000
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint           | Description                | Auth Required |
|--------|-------------------|----------------------------|--------------|
| POST   | `/api/v1/auth/register` | Register a new user       | No           |
| POST   | `/api/v1/auth/login`    | Login user                | No           |
| POST   | `/api/v1/auth/refresh-token` | Refresh access token | No (Requires refresh token cookie) |

### Movies

| Method | Endpoint         | Description                  | Auth Required |
|--------|-----------------|------------------------------|--------------|
| GET    | `/api/v1/movies` | Get all movies (with filtering) | No          |
| GET    | `/api/v1/movies/id/:id` | Get movie by ID           | No          |
| POST   | `/api/v1/movies` | Create a new movie           | Yes         |

### Reviews

| Method | Endpoint           | Description                 | Auth Required |
|--------|-------------------|------------------------------|--------------|
| POST   | `/api/v1/reviews` | Add a review to a movie      | Yes         |
| GET    | `/api/v1/reviews/movie/:movieId` | Get all reviews for a movie | No          |

## 🔄 Token Flow

The authentication system uses a dual-token approach:

1. **Access Token** (short-lived, 2 minutes):
   - Sent as a Bearer token in the Authorization header
   - Used to authenticate protected API endpoints
   - Payload contains user ID and role

2. **Refresh Token** (long-lived, 7 days):
   - Stored as an HttpOnly cookie
   - Used to obtain a new access token when expired
   - Enhanced security against XSS attacks

Flow:
1. User logs in with credentials → receives access token and refresh token
2. User makes requests with access token until expiration
3. When access token expires, client calls `/auth/refresh-token` endpoint
4. If refresh token is valid, a new access token is issued
5. If refresh token is expired or invalid, user must login again

## 🔌 Socket.IO Events

| Event Name | Direction | Description |
|------------|-----------|-------------|
| `authenticate` | Client → Server | Authenticate socket connection with user ID |
| `review:new` | Client → Server | Notify about new review submission |
| `movie:added` | Server → Client | Broadcast when a new movie is added |
| `movie:{id}:review` | Server → Client | Broadcast when a movie receives a new review |

## 📁 Project Structure

```
src/
├── app/
│   ├── middlewares/       # Authentication, error handling
│   ├── modules/
│   │   ├── movies/        # Movie-related components
│   │   ├── reviews/       # Review-related components
│   │   └── user/          # User authentication components
├── config/                # Configuration settings
├── error/                 # Error handling utilities
├── routes/                # API route definitions
├── shared/                # Shared utilities
├── socket.ts              # Socket.IO setup
├── types/                 # TypeScript type definitions
├── app.ts                 # Express application setup
└── server.ts              # Server entry point
```

## 🌟 Professional Touches

- **Database Indexing**: Strategic indexes for performance optimization
- **Mongoose Schema Validation**: Robust data validation at the model level
- **Real-time Architecture**: Socket.IO implementation with typed events
- **Error Handling**: Centralized error handling with custom error classes
- **Pagination & Filtering**: Advanced query capabilities
- **Type Safety**: Comprehensive TypeScript typings throughout the codebase
- **Security Features**: HTTP-only cookies, password hashing, and JWT token management

## 🚀 Deployment

This backend is deployed at: [https://moviehub-api.example.com](https://moviehub-api.example.com)

## 📝 License

MIT

## 🔗 Frontend Repository

The frontend repository for this project can be found at:
[https://github.com/yourusername/moviehub-frontend](https://github.com/yourusername/moviehub-frontend)

---

Built with ❤️ for the MovieHub Technical Task
