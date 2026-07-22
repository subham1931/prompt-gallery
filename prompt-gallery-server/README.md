# Prompt Gallery Server

Node/Express + MongoDB API for the gallery client and admin CMS. Deploy on Render.

## Local setup

```bash
cd prompt-gallery-server
cp .env.example .env
# fill MONGODB_URI + Cloudinary + origins + JWT_SECRET + SUPERADMIN_*
npm install
npm run seed
npm run seed:superadmin
npm run dev
```

API defaults to `http://localhost:4000`.

## Auth roles

| Role | Access |
|------|--------|
| `user` | Public gallery signup/login, like prompts |
| `admin` | CMS: prompts, categories, uploads |
| `superadmin` | Everything admin can do + create/list/demote admins |

## Endpoints

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/signup` | Public user signup (`role: user`) |
| POST | `/api/auth/login` | Login (any role) |
| GET | `/api/auth/me` | Current user (Bearer) |
| GET | `/api/admins` | List admins (superadmin) |
| POST | `/api/admins` | Create admin (superadmin) |
| PATCH | `/api/admins/:id` | Demote admin → user (superadmin) |
| GET | `/api/prompts` | Published by default; `status=all\|draft` requires admin+ |
| GET | `/api/prompts/:slug` | Detail |
| POST/PUT/DELETE | `/api/prompts` | Admin+ |
| GET | `/api/categories` | List + published counts |
| POST | `/api/categories` | Admin+ |
| POST | `/api/upload` | Admin+ |

## Render deploy

1. **MongoDB Atlas** — free cluster, Network Access `0.0.0.0/0`, copy connection string.
2. **Cloudinary** — free account; copy cloud name, API key, API secret.
3. **Render** → New Web Service → repo `prompt-gallery` → Root Directory `prompt-gallery-server` → Build `npm install` → Start `npm start`.
4. Set env vars (see `.env.example`): `MONGODB_URI`, Cloudinary keys, `CLIENT_ORIGIN`, `ADMIN_ORIGIN`, `JWT_SECRET`, `SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD`, `SUPERADMIN_NAME`.
5. After first deploy, open a Render shell and run `npm run seed` then `npm run seed:superadmin`.
6. Set `VITE_API_URL` on both Vercel apps to `https://your-service.onrender.com` and redeploy.
