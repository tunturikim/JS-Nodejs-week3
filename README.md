# JavaScript Project Template
 
A starter template for plain JavaScript projects (HTML + JS in the browser) with formatting and linting preconfigured:
 
- **EditorConfig**: consistent indentation, line endings and encoding across editors
- **Prettier**: automatic code formatting
- **ESLint**: finds errors and enforces coding conventions
## Requirements
 
- [Node.js](https://nodejs.org/) (LTS version). Check with `node -v`. Node is installed once on your computer, not per project.
- [Git](https://git-scm.com/)
- Visual Studio Code with these extensions:
  - Prettier - Code formatter
  - ESLint
  - EditorConfig for VS Code
## Getting started
 
1. Click **Use this template** > **Create a new repository** on GitHub.
2. Clone your new repository:
```bash
   git clone https://github.com/<username>/<repository>.git
   cd <repository>
```
 
3. Install dependencies (creates the `node_modules` folder, which is not stored in Git):
```bash
   npm install
```
 or 
 ```bash
   npm.cmd install
```
4. Open the folder in VS Code and start coding.
Run `npm install` once after every fresh clone. You do not need to run it every time you open the project.
 
## VS Code settings
 
Open settings with `Ctrl + ,` and check:
 
- **Editor: Default Formatter** is set to **Prettier**
- **Editor: Format On Save** is enabled
## Project structure
 
```
.
├── .editorconfig        # Editor style rules
├── .prettierrc.json     # Prettier configuration
├── eslint.config.js     # ESLint configuration
├── .gitignore
├── package.json         # Project info and dependencies
├── example.html         # Sample HTML page
└── main.js              # Sample JavaScript file
```
 
## Usage
 
Open `example.html` in a browser (or use the VS Code Live Server extension). JavaScript is loaded as a module:
 
```html
<script type="module" src="main.js" defer></script>
```
 
Output from `console.log()` appears in the browser developer tools console (`F12`).
 
For course assignments, put each assignment in its own folder with its own HTML and JS files, and include the assignment number in the file and folder names, for example `assignment1/assignment1.html` and `assignment1/assignment1.js`.
 
## Linting
 
Run ESLint manually on all files:
 
```bash
npx eslint .
```
 
Automatically fix what can be fixed:
 
```bash
npx eslint . --fix
```
 
## Notes
 
- `node_modules`, `.vscode`, `.idea` and `.DS_Store` are ignored by Git (see `.gitignore`).
- If ESLint warnings do not show up in the editor, make sure `npm install` has been run in the project folder.
 

## Authentication and authorization (assignment 6)

Required `.env` variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` and `JWT_SECRET` (long random string used to sign tokens).

Passwords are stored as bcrypt hashes. `POST /api/v1/auth/login` returns a JWT (valid 24 h). Send it to protected routes in the header `Authorization: Bearer <token>`.

| Route | Access |
| --- | --- |
| `POST /api/v1/auth/login` | public |
| `GET /api/v1/auth/me` | valid token |
| `GET /api/v1/cats`, `GET /api/v1/cats/:id` | public |
| `POST /api/v1/cats` | valid token; the owner is always the logged-in user |
| `PUT`/`DELETE /api/v1/cats/:id` | the cat's owner or an admin |
| `GET /api/v1/users`, `GET /api/v1/users/:id`, `POST /api/v1/users` | public |
| `PUT`/`DELETE /api/v1/users/:id` | the user themselves or an admin |

Status codes: missing token `401`, invalid or expired token `403`, wrong credentials `401`, modifying another user `403`, modifying a cat you do not own `404` (cat not found or not yours).

Only admins can change a user's `role` or a cat's `owner`.

## Validation and error handling (assignment 7)

- All errors are returned as JSON: `{"error": {"message": "...", "status": 400}}`. Controllers and middlewares pass errors on with `next(error)` and `src/middlewares/error-handlers.js` handles them (`notFoundHandler`, `errorHandler`, `validationErrors`).
- Input is validated and sanitized with [express-validator](https://express-validator.github.io/docs/):
  - Users (`POST`, `PUT`): name, username (3-20 alphanumeric), email, password (min 8 chars), role (`user` or `admin`).
  - Cats (`POST`, `PUT`): cat_name (3-50 chars), weight (0.1-100), birthdate (ISO date). The owner comes from the token.
  - Login: username and password required.
  - `:id` route parameters must be positive integers.
- File uploads (multer): images and videos only, max 10 MB. Thumbnails are created for images.
- Invalid input returns `400`, unknown routes `404`, unexpected errors `500` (details only in the server log).
