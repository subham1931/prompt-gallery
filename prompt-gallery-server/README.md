# Prompt Gallery Server

Node/Express + MongoDB API for the gallery client and admin CMS. Deploy on Render.

## Local setup

```bash
cd prompt-gallery-server
cp .env.example .env
# fill MONGODB_URI + Cloudinary + origins
npm install
npm run seed
npm run dev
```

API defaults to `http://localhost:4000`.

## Endpoints

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/health` | Health check |
| GET | `/api/prompts` | `q`, `category`, `tool`, `trending`, `status` (`published` default, `all` / `draft` for admin), `sort`, `limit` |
| GET | `/api/prompts/:slug` | Detail |
| POST | `/api/prompts` | Create (no auth MVP) |
| PUT | `/api/prompts/:id` | Update |
| DELETE | `/api/prompts/:id` | Delete |
| GET | `/api/categories` | List + published counts |
| POST | `/api/upload` | Multipart field `image` → Cloudinary |

## Render deploy

1. **MongoDB Atlas** — free cluster, Network Access `0.0.0.0/0`, copy connection string.
2. **Cloudinary** — free account; copy cloud name, API key, API secret.
3. **Render** → New Web Service → repo `prompt-gallery` → Root Directory `prompt-gallery-server` → Build `npm install` → Start `npm start`.
4. Set env vars (see `.env.example`): `MONGODB_URI`, Cloudinary keys, `CLIENT_ORIGIN`, `ADMIN_ORIGIN`.
5. After first deploy, open a Render shell (or run locally against Atlas) and run `npm run seed`.
6. Set `VITE_API_URL` on both Vercel apps to `https://your-service.onrender.com` and redeploy.

## Security note

Write routes are open for MVP. Add JWT before production hardening.
