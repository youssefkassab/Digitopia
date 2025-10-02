# cPanel Deployment Guide

## 🚀 Step-by-Step Deployment to cPanel

### Step 1: Prepare Files Locally

1. **Fix .env file** (if it has line breaks):
   ```bash
   cd backend
   # Copy the clean version
   cp .env.production .env
   ```

2. **Install dependencies**:
   ```bash
   npm install --production
   ```

3. **Create deployment package**:
   - Exclude: `node_modules/`, `.git/`, `logs/`, `.env` (will create on server)

---

### Step 2: Upload to cPanel

#### Option A: File Manager
1. Login to cPanel
2. Go to **File Manager**
3. Navigate to your domain's directory (e.g., `public_html/api` or `digitopia`)
4. Upload all files **EXCEPT**:
   - `node_modules/` (will install on server)
   - `.git/`
   - `logs/`
   - `.env` (will create manually)

#### Option B: FTP/SFTP
1. Use FileZilla or similar
2. Upload backend folder to your domain directory
3. Exclude same files as above

---

### Step 3: Setup on cPanel

#### 3.1 Create .env File
1. In cPanel File Manager, navigate to `backend/`
2. Click **+ File** → Create `.env`
3. Edit and paste this content:

```env
JWT_SECRET="djdjdksdkvhd2654fkdvjkf66bgl26ff23fj"
Ai_api="AIzaSyDYqzdUEkU3la7TSahvAnuBmD32olM-eaw"
DB_HOST="hemmx.org"
DB_USER="hemmxorg_edudevexerts"
DB_PASSWORD="@# IIUWHiiiiIIIIIlllIIll YTfwty763DKNBJHBS09987584 &@(^$^#%#$2 3uihskjQU8385ESjgvhgxvt #@"
DB_NAME="hemmxorg_3lm-Quest"
DB_PORT="3306"
PORT="3000"
NODE_ENV="production"
AI_DB_NAME="ai_3lm_quest"
AI_COLLECTION_NAME="curriculum"
REPLACE_AI_DB="false"
GOOGLE_API_KEY="AIzaSyDYqzdUEkU3la7TSahvAnuBmD32olM-eaw"
MONGO_URI="mongodb+srv://ai_3lm_quest:curriculum@cluster0.hrzbmww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
CORS_ORIGIN="https://hemmx.org,https://www.hemmx.org"
LOG_LEVEL="info"
```

#### 3.2 Setup Node.js Application
1. In cPanel, go to **Setup Node.js App**
2. Click **Create Application**
3. Configure:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: `/home/username/public_html/digitopia/backend` (adjust path)
   - **Application URL**: Your domain or subdomain
   - **Application startup file**: `app.js`
   - **Environment variables**: (optional, already in .env)

4. Click **Create**

#### 3.3 Install Dependencies
1. After creating the app, cPanel shows a command to run
2. Click **Run NPM Install** button, OR
3. Use Terminal:
   ```bash
   cd /home/username/public_html/digitopia/backend
   npm install --production
   ```

#### 3.4 Run Database Migrations
In cPanel Terminal:
```bash
cd /home/username/public_html/digitopia/backend
npm run migrate
```

#### 3.5 Start Application
1. In **Setup Node.js App**, click **Start App** or **Restart**
2. Application should now be running!

---

### Step 4: Configure Domain/Subdomain

#### Option A: Subdomain (Recommended)
1. In cPanel → **Subdomains**
2. Create: `api.hemmx.org`
3. Point to: `/home/username/public_html/digitopia/backend`
4. Node.js app will handle requests

#### Option B: Main Domain with Path
1. Use `.htaccess` to proxy requests
2. Example for `/api` path:
```apache
RewriteEngine On
RewriteRule ^api/(.*)$ http://localhost:3000/$1 [P,L]
```

---

### Step 5: Verify Deployment

1. **Check application status** in Setup Node.js App
2. **Test endpoints**:
   ```
   https://api.hemmx.org/api/users
   https://api.hemmx.org/api/courses
   ```
3. **Check logs**:
   - In cPanel File Manager: `backend/logs/combined.log`
   - Or via Terminal: `tail -f logs/combined.log`

---

## 🔧 Troubleshooting

### Application won't start?
1. Check Node.js version (18.x+)
2. Verify `.env` file exists and has correct format
3. Check application logs in cPanel
4. Verify `app.js` path is correct

### Database connection errors?
1. Verify database exists in cPanel → MySQL Databases
2. Check DB credentials in `.env`
3. Ensure database user has permissions
4. Test connection from cPanel → phpMyAdmin

### MongoDB connection errors?
1. Verify MONGO_URI is correct
2. Check MongoDB Atlas → Network Access
3. Add cPanel server IP to whitelist
4. Test connection string

### CORS errors?
1. Verify CORS_ORIGIN in `.env` matches your frontend URL
2. Include both `https://hemmx.org` and `https://www.hemmx.org`
3. Restart application after changes

### Port conflicts?
- cPanel usually assigns ports automatically
- Check assigned port in Setup Node.js App
- Update PORT in `.env` if needed

---

## 📋 Post-Deployment Checklist

- [ ] Application running in Setup Node.js App
- [ ] `.env` file created with correct values
- [ ] Dependencies installed (`node_modules/` exists)
- [ ] Database migrations completed
- [ ] Logs directory created (`backend/logs/`)
- [ ] Test API endpoints responding
- [ ] CORS working with frontend
- [ ] Database connections working
- [ ] MongoDB connections working
- [ ] SSL certificate installed (HTTPS)

---

## 🔄 Updating the Application

When you need to update:

1. **Upload new files** via File Manager/FTP
2. **Restart application** in Setup Node.js App
3. **Run migrations** if database changed:
   ```bash
   npm run migrate
   ```
4. **Check logs** for any errors

---

## 📊 Monitoring

### View Logs
```bash
# In cPanel Terminal
cd /home/username/public_html/digitopia/backend

# View all logs
tail -f logs/combined.log

# View errors only
tail -f logs/error.log

# View bad requests
tail -f logs/bad-requests.log
```

### Check Application Status
- cPanel → Setup Node.js App → Your app
- Green = Running
- Red = Stopped (click Start)

---

## 🔒 Security Notes

- ✅ `.env` file is NOT in git
- ✅ HTTPS enabled (SSL certificate)
- ✅ CORS restricted to your domains
- ✅ Database credentials secure
- ✅ JWT_SECRET is strong
- ✅ Error details hidden in production

---

## 🆘 Common cPanel Commands

```bash
# Navigate to app
cd /home/username/public_html/digitopia/backend

# Install dependencies
npm install --production

# Run migrations
npm run migrate

# View logs
tail -f logs/combined.log

# Check Node version
node --version

# Check npm version
npm --version

# List files
ls -la

# Check disk space
du -sh *
```

---

## ✅ Your Configuration

**Domain**: hemmx.org  
**Database**: hemmxorg_3lm-Quest  
**Database Host**: hemmx.org  
**MongoDB**: Atlas Cluster  
**Node.js**: Production mode  
**Port**: 3000 (or cPanel assigned)  

---

## 📞 Need Help?

1. Check cPanel error logs
2. Check application logs in `backend/logs/`
3. Verify all environment variables
4. Test database connections
5. Contact cPanel support if server issues

**Your application is ready for cPanel deployment! 🚀**
