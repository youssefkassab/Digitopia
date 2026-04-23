# Render.com Deployment Guide

## Quick Settings

| Setting | Value |
|---------|-------|
| **Root Directory** | *(leave empty)* |
| **Build Command** | `cd frontend && npm install && npm run build && cd ../backend && npm install` |
| **Start Command** | `cd backend && node app.js` |

---

## Step-by-Step Deployment

### 1. Create New Web Service on Render

1. Go to [render.com](https://render.com) dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the **Digitopia** repository

### 2. Configure Service Settings

Fill in these fields:

| Field | Value |
|-------|-------|
| **Name** | `digitopia` (or your preferred name) |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | *(leave empty)* |
| **Runtime** | `Node` |
| **Build Command** | `cd frontend && npm install && npm run build && cd ../backend && npm install` |
| **Start Command** | `cd backend && node app.js` |

### 3. Add Environment Variables

Click **"Advanced"** → **"Environment Variables"** and add:

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_ENV` | `production` | ✅ |
| `PORT` | `10000` | ✅ |
| `JWT_SECRET` | *(generate random string)* | ✅ |
| `DB_HOST` | *(your MySQL host)* | ✅ |
| `DB_USER` | *(your MySQL user)* | ✅ |
| `DB_PASSWORD` | *(your MySQL password)* | ✅ |
| `DB_NAME` | `digitopia` | ✅ |
| `MONGO_URI` | *(your MongoDB URI)* | ✅ |
| `GOOGLE_API_KEY` | *(your Google API key)* | ✅ |
| `CORS_ORIGIN` | `https://your-app-name.onrender.com` | ✅ |
| `LOG_LEVEL` | `info` | Optional |

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Update Frontend API URL

Before deploying, update `frontend/.env.production`:

```env
# Replace with your actual Render URL
VITE_API_URL=https://digitopia.onrender.com/api
VITE_ADMIN_API_URL=https://digitopia.onrender.com/api
```

Then commit and push:
```bash
git add frontend/.env.production
git commit -m "Update API URL for Render deployment"
git push origin main
```

### 5. Database Setup

#### MySQL (using Render PostgreSQL or external):
If using external MySQL, whitelist Render's IP ranges or set `0.0.0.0/0` for initial testing.

#### MongoDB:
Ensure your MongoDB Atlas (or other provider) allows connections from Render:
1. Go to MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0` (restrict later)

### 6. Run Database Migrations

After first deploy, open Render Shell:
```bash
cd backend
npx sequelize-cli db:migrate
```

Or add to your local environment and run:
```bash
cd backend
npm run migrate
```

---

## Post-Deploy Verification

Test these endpoints after deployment:

```bash
# Health check
curl https://your-app.onrender.com/api/users

# Should return JSON response
```

---

## Troubleshooting

### Build fails?
- Check Node version (should be 18.x or higher)
- Verify all dependencies are in package.json

### Frontend 404 errors?
- Ensure `frontend/dist` exists after build
- Check that `../frontend/dist` path is correct in `backend/app.js`

### Database connection fails?
- Verify environment variables are set correctly
- Check database firewall allows Render IP
- Test connection string locally first

### CORS errors?
- Update `CORS_ORIGIN` to match your exact Render URL
- Include `https://` prefix

---

## Free Tier Limits

- **Web Service**: 512 MB RAM, sleeps after 15 min inactivity
- **Bandwidth**: 100 GB/month
- **Builds**: 500 minutes/month

For production, consider upgrading to paid tier for:
- Always-on service
- More RAM/CPU
- Custom domains

---

## Files Created for Render

- ✅ `frontend/.env.production` - Updated with Render URL placeholder
- ✅ `backend/.env.example` - Template for environment variables
- ✅ `RENDER_DEPLOYMENT.md` - This guide

---

## Next Steps

1. ✅ Update `frontend/.env.production` with your actual Render URL
2. ✅ Commit and push changes
3. ✅ Create Web Service on Render
4. ✅ Add all environment variables
5. ✅ Deploy
6. ✅ Run database migrations
7. ✅ Test the application

**Your app is ready for Render.com!** 🚀
