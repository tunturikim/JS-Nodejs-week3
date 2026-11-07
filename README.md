# Cat API (Node.js + Express)

REST API for cats and users, built for the Web Software Development course, week 3 ([course material](https://mattpe.github.io/wsk/#week-3---nodejs-express)).

Features: Express routing (MVC structure), MySQL database access with prepared statements, image upload with thumbnails, JWT authentication, role-based authorization, input validation and JSON error handling.

## Requirements

- [Node.js](https://nodejs.org/) (LTS)
- A MySQL / MariaDB database with the `wsk_users` and `wsk_cats` tables (course `cats-db.sql`)

## Setup

```bash
npm install
```

Create a `.env` file (see `.env.example`):

| Variable | Description |
| --- | --- |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Database connection |
| `JWT_SECRET` | Long random string used to sign tokens |

`.env` is ignored by Git and must never be committed.

## Running

```bash
npm run dev    # nodemon, restarts on changes
npm start      # plain node
```

The server runs at `http://127.0.0.1:3000/`. Static files are served from `public/`, uploaded files go to `uploads/` (contents ignored by Git). Lint with `npx eslint .`.

Ready-made requests for the VS Code REST Client are in [test/test-requests.http](test/test-requests.http).

## Project structure

```
src/
├── app.js                  # Express app, global middleware, error handlers
├── api/
│   ├── index.js            # Mounts routers under /api/v1
│   ├── routes/             # cat-router, user-router, auth-router
│   ├── controller/         # Request handling
│   └── model/              # Database queries (mock models kept for reference)
├── middlewares/
│   ├── authentication.js   # authenticateToken (JWT)
│   ├── error-handlers.js   # notFoundHandler, errorHandler, validationErrors
│   ├── upload.js           # multer config + sharp thumbnail
│   ├── logger.js
│   └── request-time.js
└── utils/database.js       # MySQL connection pool
```

## API

Base URL: `/api/v1`

| Method and path | Description | Access |
| --- | --- | --- |
| `POST /auth/login` | Log in with `username` and `password`, returns `{user, token}` (valid 24 h) | public |
| `GET /auth/me` | Returns the user stored in the token | valid token |
| `GET /cats` | List cats | public |
| `GET /cats/:id` | Get one cat | public |
| `POST /cats` | Add a cat (multipart form: `cat_name`, `weight`, `birthdate`, file field `image`). The owner is always the logged-in user | valid token |
| `PUT /cats/:id` | Update a cat | owner or admin |
| `DELETE /cats/:id` | Delete a cat | owner or admin |
| `GET /users` | List users | public |
| `GET /users/:id` | Get one user | public |
| `POST /users` | Register a user (password is stored as a bcrypt hash) | public |
| `PUT /users/:id` | Update a user | the user or admin |
| `DELETE /users/:id` | Delete a user | the user or admin |

Send the token in the header `Authorization: Bearer <token>`.

## Authentication and authorization

- Passwords are hashed with bcrypt (10 salt rounds). Login returns a JWT signed with `JWT_SECRET`; the password is never returned.
- `authenticateToken` verifies the token and stores the payload (`user_id`, `name`, `username`, `email`, `role`) in `res.locals.user`.
- Rules:
  - A regular user can update or delete only their own cats (`owner = user_id`, checked in the SQL query) and their own user account.
  - An admin can update or delete any cat or user.
  - Only an admin can change a user's `role` or a cat's `owner`.
- Status codes: missing token `401`, invalid or expired token `403`, wrong credentials `401`, modifying another user `403`, modifying a cat you do not own `404` (cat not found or not yours).

## Validation and error handling

- All errors are returned as JSON: `{"error": {"message": "...", "status": 400}}`. Controllers and middlewares pass errors on with `next(error)` and `src/middlewares/error-handlers.js` handles them. Unknown routes return `404`; unexpected errors return `500` (details only in the server log).
- Input is validated and sanitized with [express-validator](https://express-validator.github.io/docs/):
  - Users: name, username (3-20 letters or numbers), email, password (min 8 characters), role (`user` or `admin`).
  - Cats: cat_name (3-50 characters), weight (0.1-100), birthdate (ISO date).
  - Login: username and password required.
  - `:id` parameters must be positive integers. On `PUT` the body fields are optional.
- File uploads (multer): images and videos only, max 10 MB. A 160x160 PNG thumbnail (`<filename>_thumb`) is created for images using sharp.

## Assignments

Each week 3 assignment was developed in its own branch and merged to `main`:

| Branch | Topic |
| --- | --- |
| `assignment1` | Express hello world, static files, cats JSON |
| `assignment2` | Routers, controllers and mock models for cats and users |
| `assignment3` | File upload with multer |
| `assignment4` | Thumbnails with sharp middleware |
| `assignment5` | MySQL database access |
| `assignment6` | JWT authentication and authorization |
| `assignment7` | Input validation and error handling |
