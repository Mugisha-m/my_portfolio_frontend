# Albert Mugisha Portfolio Platform

Full-stack portfolio platform with a React/Vite frontend, Node.js/Express backend, PostgreSQL via Prisma, Cloudinary media uploads, JWT admin authentication, contact handling, analytics, GitHub cache, and admin dashboard APIs.

## Project Structure

```text
my portfolio/
  frontend/   React + Vite portfolio UI
  backend/    Express API, Prisma schema, seed script, env template
  README.md
```

Older static HTML pages are kept in `frontend/legacy-static/`. Source images are kept in `frontend/source-photos/`; the optimized runtime images are in `frontend/public/images/`.

## Local URLs

- Frontend: `http://localhost:5173`
- API health: `http://localhost:4001/api/health`

## Environment

1. Copy `backend/.env.example` to `backend/.env`.
2. Fill in:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - Cloudinary credentials
   - SMTP values if contact email notifications are required
   - reCAPTCHA values if spam protection is enabled

Do not commit real `.env` files. The example file intentionally contains placeholders only.

## Commands

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Production build check:

```bash
npm run build
```

Production database migration:

```bash
npm run prisma:deploy
```

Production API start:

```bash
npm start
```

## Deployment Notes

- Deploy `frontend/` as a static Vite app after `npm run build --workspace frontend`.
- Deploy `backend/` as the Node API after `npm run build --workspace backend`.
- Set `CLIENT_URL` in the backend environment to the deployed frontend URL.
- Set `VITE_API_URL` in the frontend environment to the deployed API base URL if the frontend and backend are not behind the same `/api` origin.
- Run `npm run prisma:deploy` against the production database before starting the API.
