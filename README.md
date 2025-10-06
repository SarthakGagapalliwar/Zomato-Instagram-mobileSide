# Zomato-Instagram-mobileSide

A mobile-first food discovery experience inspired by Instagram reels. The project pairs a React/Vite frontend with an Express + MongoDB backend so diners can explore short-form food videos, like/save dishes, and connect with food partners who manage their own storefront reels.

## 🧭 Project structure

```
./
├── backend/            # Express API, MongoDB models, business logic
├── frontend/           # React (Vite) single-page app
├── package.json        # Root dependency holder (shared UI libs)
└── README.md           # You are here
```

### Key technologies

- **Frontend:** React 19, Vite, React Router, Axios, mobile-first CSS.
- **Backend:** Node.js, Express 5, Mongoose, Multer (in-memory uploads), JWT with httpOnly cookies, ImageKit SDK.
- **Database & storage:** MongoDB for persistence, ImageKit for video hosting.

## ✨ Features at a glance

- Dual-account onboarding for diners (users) and food partners.
- Secure authentication with hashed passwords and JWT cookies.
- Infinite-style reel feed with auto-playing food videos, like/save counters, and partner deep-links.
- Saved items view that mirrors Instagram collections.
- Food partner profile page that aggregates their uploads.
- Protected APIs that infer the active account (user or partner) for likes/saves.
- Food partner upload workflow that stores video files via ImageKit.

## 🚀 Getting started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- MongoDB instance (local or hosted)
- ImageKit account for media hosting

### 1. Clone and install dependencies

```powershell
cd <your-workspace>
git clone https://github.com/SarthakGagapalliwar/Zomato-Instagram-mobileSide.git
cd Zomato-Instagram-mobileSide

# Backend deps
cd backend
npm install

# Frontend deps
cd ../frontend
npm install
```

### 2. Configure backend environment

Create `backend/.env` with the following keys:

```
PORT=3000                    # Optional; defaults to 3000 in server.js
MONGODB_URL=<your Mongo connection string>
JWT_SECRET=<random string for signing tokens>
IMAGE_PUBLIC_KEY=<ImageKit public API key>
IMAGE_PRIVATE_KEY=<ImageKit private API key>
IMAGE_URL_ENDPOINT=<ImageKit URL endpoint>
```

> The backend issues JWTs via httpOnly cookies. When serving the frontend from another origin, ensure `origin` in `src/app.js` matches the Vite dev server (default `http://localhost:5173`).

### 3. Run the services

Start the API (from `backend/`):

```powershell
npm run dev
```

Launch the frontend (from `frontend/`):

```powershell
npm run dev
```

The Vite dev server prints a local URL (default `http://localhost:5173`). The Express API listens on `http://localhost:3000`.

## 🧩 Core modules

| Area                | Files                                                                                      | Description                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Authentication      | `backend/src/controllers/auth.controller.js`, `backend/src/middlewares/auth.middleware.js` | Handles registration/login/logout for diners and partners, issues JWT cookies, and protects routes. |
| Feed & interactions | `backend/src/controllers/food.controller.js`, `backend/src/routes/food.routes.js`          | Serves reel data, toggles likes/saves, and hydrates saved collections.                              |
| Partner insights    | `backend/src/controllers/food-partner.controller.js`                                       | Returns partner details with their uploaded food items.                                             |
| Uploads             | `backend/src/services/storage.service.js`                                                  | Streams uploaded video buffers to ImageKit.                                                         |
| Frontend routing    | `frontend/src/router/AppRouter.jsx`                                                        | Declares SPA routes for feed, saved view, auth flows, uploads, and partner profiles.                |
| UI components       | `frontend/src/pages/**/*.jsx`, `frontend/src/components/`                                  | Implements reels UI, auth templates, bottom navigation, and upload forms.                           |

## 🔌 API overview

All endpoints are prefixed with `/api`:

| Method | Endpoint                          | Auth           | Purpose                                           |
| ------ | --------------------------------- | -------------- | ------------------------------------------------- |
| `POST` | `/api/auth/user/register`         | Public         | Register a new diner account                      |
| `POST` | `/api/auth/user/login`            | Public         | Authenticate a diner; sets `token` cookie         |
| `GET`  | `/api/auth/user/logout`           | Auth cookie    | Clear the diner session                           |
| `POST` | `/api/auth/food-partner/register` | Public         | Register a food partner                           |
| `POST` | `/api/auth/food-partner/login`    | Public         | Partner login                                     |
| `GET`  | `/api/auth/food-partner/logout`   | Auth cookie    | Clear the partner session                         |
| `POST` | `/api/food`                       | Partner cookie | Upload a food reel (multipart `video` field)      |
| `GET`  | `/api/food`                       | Any auth       | Fetch all reels with personalised like/save flags |
| `POST` | `/api/food/like`                  | Any auth       | Toggle like state for a reel                      |
| `POST` | `/api/food/save`                  | Any auth       | Toggle saved state                                |
| `GET`  | `/api/food/save`                  | Any auth       | Fetch the caller's saved reels                    |
| `GET`  | `/api/food-partner/:id`           | User cookie    | Fetch partner profile & reels                     |

Cookies issued on login must be sent with `withCredentials: true` (already configured in the frontend Axios calls).

## 🧪 Testing & quality

- No automated tests ship with this repository yet (`npm test` placeholders are present). Consider adding Jest/Vitest suites for controllers and React hooks.
- ESLint is configured for the frontend (`npm run lint`).

## 🗺️ Roadmap ideas

- Add optimistic UI for likes/saves when requests fail.
- Support comments and social sharing.
- Provide partner analytics (view counts, engagement rates).
- Add deployment recipes (Docker, CI/CD) and environment-specific configs.

## 🤝 Contributing

1. Fork the repository and create a feature branch.
2. Follow the coding conventions in existing files (Prettier/Vite defaults).
3. Submit a pull request with clear context and screenshots/GIFs for UI changes.

## 📄 License

This project is distributed under the ISC license (see `backend/package.json`). Update this section if you adopt a different license.
