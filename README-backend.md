# 🌍 Travel Blog App — Backend API

**Live API:** [my-blog-travel-app-backend.vercel.app](https://my-blog-travel-app-backend.vercel.app)

---

## 📋 Project Overview

This is the REST API backend powering the Travel Blog App — a platform for sharing travel stories and experiences. It handles authentication, blog post management, and data persistence.

---

## 👤 About the Developer

- **From:** Mallorca,Spain
- **Hobbies:** Traveling

---

## 🚀 Project Elevator Pitch

### What is it?

A RESTful API that serves the Travel Blog App frontend. It manages users, posts, and media, providing secure endpoints for all core app features.

### How does it work?

Built with **[Node.js + Express]**, the backend exposes JSON endpoints consumed by the frontend. It connects to a MongoDB database and handles authentication via **JWT tokens**.

### Why this project?

I wanted hands-on experience building a production-grade API from scratch — including auth, data modeling, error handling, and cloud deployment — to complement my frontend skills.

---

## ⚙️ Tech Stack

| Layer      | Technology   |
| ---------- | ------------ |
| Runtime    | Node.js      |
| Framework  | Express      |
| Database   | MongoDB      |
| Auth       | JWT + bcrypt |
| Deployment | Vercel       |

---

## 🛠️ Getting Started

### Prerequisites

- Node.js `>= 18.x`
- npm
- A MongoDB (local or cloud)

### Installation

```bash
# Clone the repository
git clone https://github.com/FD94/backend-BlogTravelApp
cd blog-travel-app-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables below)
```

### Running locally

```bash
npm run dev
```

API will be available at `http://localhost:5000`

---

## 🔧 Environment Variables

| Variable       | Description                                                          |
| -------------- | -------------------------------------------------------------------- |
| `DATABASE_URL` | MongoDB connection string or PostgreSQL URL                          |
| `JWT_SECRET`   | Secret key for signing JWT tokens                                    |
| `PORT`         | Port to run the server                                               |
| `FRONTEND_URL` | Allowed origin for CORS (e.g., `https://blog-travel-app.vercel.app`) |

---

## 📡 API Endpoints

> 🔒 Routes marked as **Protected** require a valid JWT token in the `Authorization` header:
>
> ```
> Authorization: Bearer <your_token>
> ```

---

### 🔐 Auth — `/auth`

| Method | Endpoint       | Auth         | Description                          |
| ------ | -------------- | ------------ | ------------------------------------ |
| `POST` | `/auth/signup` | Public       | Register a new user                  |
| `POST` | `/auth/login`  | Public       | Login and receive a JWT              |
| `GET`  | `/auth/verify` | 🔒 Protected | Verify a JWT and return user payload |

#### `POST /auth/signup`

Creates a new user account. Returns the user object and a signed JWT

**Request body:**

```json
{
	"name": "Jane Doe",
	"email": "jane@example.com",
	"password": "Secret123"
}
```

**Response `201`:**

```json
{
	"user": { "_id": "...", "email": "jane@example.com", "name": "Jane Doe" },
	"authToken": "<jwt>"
}
```

---

#### `POST /auth/login`

Authenticates an existing user. Returns a signed JWT

**Request body:**

```json
{
	"email": "jane@example.com",
	"password": "Secret123"
}
```

**Response `200`:**

```json
{
	"authToken": "<jwt>"
}
```

---

#### `GET /auth/verify` 🔒

Verifies the JWT sent in the `Authorization` header and returns the decoded user payload.

**Response `200`:**

```json
{
	"_id": "...",
	"email": "jane@example.com",
	"name": "Jane Doe"
}
```

---

### 📝 Posts — `/posts`

| Method   | Endpoint         | Auth         | Description             |
| -------- | ---------------- | ------------ | ----------------------- |
| `GET`    | `/posts`         | Public       | Get all posts           |
| `GET`    | `/posts/:postId` | 🔒 Protected | Get a single post by ID |
| `POST`   | `/posts`         | 🔒 Protected | Create a new post       |
| `PUT`    | `/posts/:postId` | 🔒 Protected | Update a post by ID     |
| `DELETE` | `/posts/:postId` | 🔒 Protected | Delete a post by ID     |

#### `GET /posts`

Returns a list of all blog posts.

**Response `200`:**

```json
[
	{
		"_id": "...",
		"title": "My trip to Japan",
		"description": "It was amazing...",
		"image": "https://...",
		"author": "..."
	}
]
```

---

#### `GET /posts/:postId` 🔒

Returns a single post by its ID.

**Response `200`:**

```json
{
	"_id": "...",
	"title": "My trip to Japan",
	"description": "It was amazing...",
	"image": "https://...",
	"author": "..."
}
```

---

#### `POST /posts` 🔒

Creates a new post. The author is automatically set from the JWT payload.

**Request body:**

```json
{
	"title": "My trip to Japan",
	"description": "It was amazing...",
	"image": "https://..."
}
```

**Response `201`:**

```json
{
	"_id": "...",
	"title": "My trip to Japan",
	"description": "It was amazing...",
	"image": "https://...",
	"author": "..."
}
```

---

#### `PUT /posts/:postId` 🔒

Updates an existing post by its ID. Returns the updated document.

**Request body** (any updatable fields):

```json
{
	"title": "Updated title",
	"description": "Updated description"
}
```

**Response `200`:** Returns the updated post object.

---

#### `DELETE /posts/:postId` 🔒

Deletes a post by its ID. Returns the deleted document.

**Response `200`:** Returns the deleted post object.

---

### 💬 Comments — `/comments`

| Method   | Endpoint               | Auth         | Description                   |
| -------- | ---------------------- | ------------ | ----------------------------- |
| `POST`   | `/comments`            | 🔒 Protected | Add a comment to a post       |
| `GET`    | `/comments/:postId`    | Public       | Get all comments for a post   |
| `DELETE` | `/comments/:commentId` | 🔒 Protected | Delete a comment (owner only) |

#### `POST /comments` 🔒

Creates a new comment on a post. The author is automatically set from the JWT payload.

**Request body:**

```json
{
	"text": "Great post!",
	"post": "<postId>"
}
```

**Response `201`:** Returns the new comment populated with `post` and `author` data.

---

#### `GET /comments/:postId`

Returns all comments for a given post, with `author` and `post` populated.

**Response `200`:**

```json
[
	{
		"_id": "...",
		"text": "Great post!",
		"author": { "_id": "...", "name": "Jane Doe" },
		"post": { "_id": "...", "title": "My trip to Japan" }
	}
]
```

---

#### `DELETE /comments/:commentId` 🔒

Deletes a comment by its ID. Only the **comment's author** can delete it.

**Response `200`:**

```json
{ "message": "Comentario eliminado" }
```

**Response `403`** if the requesting user is not the comment's author.

---

## 🔗 Links

| Resource         | URL                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------- |
| 🔌 Live API      | [my-blog-travel-app-backend.vercel.app](https://my-blog-travel-app-backend.vercel.app)       |
| 🌐 Frontend App  | [blog-travel-app.vercel.app](https://blog-travel-app.vercel.app)                             |
| 📁 Frontend Repo | [github.com/your-username/blog-travel-app](https://github.com/your-username/blog-travel-app) |

---

_Thank You for visiting! ✈️_
