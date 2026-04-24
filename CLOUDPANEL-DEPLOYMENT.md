# 🚀 CloudPanel Deployment Guide - Git Clone Method

## ✅ Project Ready for CloudPanel

**Domain**: hemmx.ai  
**Backend Port**: 3001  
**Deployment Method**: Git Clone  
**Frontend**: Served by backend at `/`  

---

## 📋 Pre-Deployment Checklist

- [x] Backend configured for port 3001
- [x] Frontend configured for hemmx.ai
- [x] Backend serves frontend from `/`
- [x] CORS configured for hemmx.ai
- [x] Production logging enabled
- [x] Environment variables ready
- [x] Git repository ready to clone

---

## 🚀 CloudPanel Deployment Steps

### Step 1: Prepare Your Repository

1. **Commit all changes**:
   ```bash
   git add .
   git commit -m "Production ready for CloudPanel"
   git push origin main
   ```

2. **Make sure `.env` is in `.gitignore`** ✅ (Already done)

---

### Step 2: Setup in CloudPanel

#### 2.1 Create Node.js Site
1. Login to CloudPanel
2. Go to **Sites** → **Add Site**
3. Select **Node.js**
4. Configure:
   - **Domain**: hemex.ai
   - **Node.js Version**: 18.x or higher
   - **App Port**: 3001
   - **App Root**: `/backend`
   - **App Start Command**: `node app.js`

#### 2.2 Clone Repository
1. SSH into your server:
   ```bash
   ssh user@your-server-ip
   ```

2. Navigate to site directory:
   ```bash
   cd /home/hemexai/htdocs/hemex.ai
   ```

3. Clone your repository:
   ```bash
   git clone https://github.com/youssefkassab/Digitopia.git .
   ```

---

### Step 3: Configure Environment

1. **Create `.env` file** in backend directory:
   ```bash
   cd backend
   nano .env
   ```

2. **Paste this content** (or copy from `.env.cloudpanel`):
   ```env
   JWT_SECRET="djdjdksdkvhd2654fkdvjkf66bgl26ff23fj"
   Ai_api="AIzaSyDYqzdUEkU3la7TSahvAnuBmD32olM-eaw"
   DB_HOST="hemex.ai"
   DB_USER="hemmxorg_edudevexerts"
   DB_PASSWORD="@# IIUWHiiiiIIIIIlllIIll YTfwty763DKNBJHBS09987584 &@(^$^#%#$2 3uihskjQU8385ESjgvhgxvt #@"
   DB_NAME="hemmxorg_3lm-Quest"
   DB_PORT="3306"
   PORT="3001"
   NODE_ENV="production"
   AI_DB_NAME="ai_3lm_quest"
   AI_COLLECTION_NAME="curriculum"
   REPLACE_AI_DB="false"
   GOOGLE_API_KEY="AIzaSyDYqzdUEkU3la7TSahvAnuBmD32olM-eaw"
   MONGO_URI="mongodb+srv://ai_3lm_quest:curriculum@cluster0.hrzbmww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
   CORS_ORIGIN="https://hemex.ai,https://www.hemex.ai"
   LOG_LEVEL="info"
   ```

3. **Save and exit** (Ctrl+X, Y, Enter)

---

### Step 4: Install Dependencies & Build

1. **Install backend dependencies**:
   ```bash
   cd /home/hemexai/htdocs/hemex.ai/backend
   npm install --production
   ```

2. **Build frontend**:
   ```bash
   cd /home/hemexai/htdocs/hemex.ai/frontend
   npm install
   npm run build
   ```

3. **Run database migrations**:
   ```bash
   cd /home/hemexai/htdocs/hemex.ai/backend
   npm run migrate
   ```

---

### Step 5: Start Application

#### Option A: Using CloudPanel Interface
1. Go to CloudPanel → Your Site
2. Click **Start** or **Restart**

#### Option B: Using PM2 (Recommended)
```bash
cd /home/hemmxai/htdocs/hemmx.ai/backend
pm2 start app.js --name "digitopia"
pm2 save
pm2 startup
```

---

### Step 6: Configure SSL

1. In CloudPanel → Your Site
2. Go to **SSL/TLS**
3. Click **Install Let's Encrypt Certificate**
4. Select: `hemex.ai` and `www.hemex.ai`
5. Click **Install**

---

## 🔄 Updating the Application

When you push updates to Git:

```bash
# SSH into server
ssh user@your-server-ip

# Navigate to project
cd /home/hemmxai/htdocs/hemmx.ai

# Pull latest changes
git pull origin main

# Update backend
cd backend
npm install --production

# Rebuild frontend
cd ../frontend
npm run build

# Restart application
cd ../backend
pm2 restart digitopia

# Or via CloudPanel: Click Restart button
```

---

## 📁 Directory Structure on Server

```
/home/hemmxai/htdocs/hemmx.ai/
├── backend/
│   ├── app.js              ← Entry point
│   ├── .env                ← Create this manually
│   ├── package.json
│   ├── node_modules/       ← After npm install
│   ├── logs/               ← Created automatically
│   └── ...
└── frontend/
    ├── dist/               ← After npm run build
    │   ├── index.html
    │   └── assets/
    └── ...
```

---

## 🌐 How It Works

1. **Backend runs on port 3001**
2. **Backend serves**:
   - API routes: `/api/*`, `/ask`, `/search`, etc.
   - Static files: `/games`, `/img`
   - **Frontend**: All other routes (`/`, `/about`, etc.)
3. **Nginx proxies** `https://hemex.ai` → `http://localhost:3001`
4. **Single domain** serves both frontend and backend!

---

## ✅ Verification

After deployment, test:

### Frontend
- [ ] `https://hemex.ai` - Shows React app
- [ ] `https://hemex.ai/about` - React routing works
- [ ] No 404 errors on refresh

### API
- [ ] `https://hemex.ai:3001/api/users` - Returns data
- [ ] `https://hemex.ai:3001/api/courses` - Returns data
- [ ] CORS working (no errors in browser console)

### Logs
- [ ] `backend/logs/combined.log` exists
- [ ] `backend/logs/error.log` exists
- [ ] Logs are being written

---

## 🔧 Troubleshooting

### Application won't start?
```bash
# Check logs
pm2 logs digitopia

# Or
tail -f /home/hemmxai/htdocs/hemmx.ai/backend/logs/error.log
```

### Frontend shows 404?
```bash
# Make sure frontend is built
cd /home/hemmxai/htdocs/hemmx.ai/frontend
npm run build

# Check if dist folder exists
ls -la dist/
```

### Database connection errors?
```bash
# Test database connection
cd /home/hemmxai/htdocs/hemmx.ai/backend
node -e "require('dotenv').config(); console.log(process.env.DB_HOST)"
```

### CORS errors?
- Check `CORS_ORIGIN` in `.env` matches your domain
- Restart application after changes

---

## 📊 Monitoring

### View Logs
```bash
# All logs
tail -f backend/logs/combined.log

# Errors only
tail -f backend/logs/error.log

# Bad requests
tail -f backend/logs/bad-requests.log

# PM2 logs
pm2 logs digitopia
```

### Check Status
```bash
# PM2 status
pm2 status

# Or in CloudPanel interface
```

---

## 🔒 Security Checklist

- [x] SSL certificate installed
- [x] `.env` not in Git
- [x] Strong JWT_SECRET
- [x] CORS restricted to hemex.ai
- [x] Error details hidden in production
- [x] Helmet security headers enabled
- [x] Rate limiting enabled

---

## 📝 Quick Commands Reference

```bash
# Navigate to project
cd /home/hemmxai/htdocs/hemmx.ai

# Pull updates
git pull origin main

# Install backend deps
cd backend && npm install --production

# Build frontend
cd ../frontend && npm run build

# Run migrations
cd ../backend && npm run migrate

# Restart app
pm2 restart digitopia

# View logs
pm2 logs digitopia
tail -f backend/logs/combined.log

# Check status
pm2 status
```

---

## 🎯 Summary

✅ **Single Server Setup**:
- One domain: `hemex.ai`
- One port: `3001`
- Backend serves API + Frontend
- Easy to deploy via Git
- Easy to update

✅ **What's Configured**:
- Frontend points to `https://hemex.ai:3001/api`
- Backend serves frontend from `/`
- CORS allows `hemex.ai`
- Logging to files
- Production optimized

**Your application is ready to deploy! 🚀**

---

## 📞 Need Help?

1. Check logs: `backend/logs/error.log`
2. Check PM2: `pm2 logs digitopia`
3. Verify .env file exists and is correct
4. Ensure frontend is built: `frontend/dist/`
5. Test database connection

**Happy Deploying! 🎉**
