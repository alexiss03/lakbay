# Deploy Lakbay on Free Hosting

This app is configured for free-tier style deployment on:
- Render (Blueprint via `render.yaml`)
- Fly.io (Docker via `fly.toml`)

Note: free-tier availability and limits can change by provider/account.

## 1) Create a free Neon Postgres database
1. Go to Neon and create a free project.
2. Copy the connection string (`postgres://...`) for `DATABASE_URL`.

## 2) Push schema to the database
Run locally once (with `DATABASE_URL` set):

```bash
DATABASE_URL="your_neon_connection_string" npm run db:push
```

## 3) Deploy Option A: Render
1. Push this repo to GitHub/GitLab.
2. In Render, click **New +** -> **Blueprint** and select this repo.
3. Render will read `/render.yaml` and create the web service.
4. In Render service env vars, set:
   - `DATABASE_URL` = your Neon connection string
   - `GOOGLE_MAPS_API_KEY` = your key (optional, but needed for live map)
5. Deploy.

## 4) Deploy Option B: Fly.io
1. Install `flyctl` and login:

```bash
fly auth login
```

2. (First deploy only) create app and volume-less service:

```bash
fly launch --no-deploy
```

If needed, set a unique app name in `/fly.toml`:
`app = "your-unique-name"`

3. Set required secrets:

```bash
fly secrets set DATABASE_URL="your_neon_connection_string"
fly secrets set SESSION_SECRET="your_long_random_secret"
fly secrets set GOOGLE_MAPS_API_KEY="your_maps_key"
```

4. Deploy:

```bash
fly deploy
```

5. Open app:

```bash
fly open
```

## 5) Required production checks
1. Open `/api/auth/debug` to confirm backend is up.
2. Open home page and verify map loads (if API key is set).
3. Log in and confirm yearly travel goals persist.

## Optional OAuth setup
If using Google/Facebook login, set these in your hosting environment:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`

Also update OAuth callback URLs to your production domain.
