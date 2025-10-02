# ✅ Final Pre-Upload Checklist for cPanel

## 🎯 Quick Status

**Project**: Digitopia  
**Target**: cPanel (hemmx.org)  
**Status**: ✅ Ready for Upload  

---

## ✅ Completed Items

### Code Changes
- ✅ All console.log replaced with logger
- ✅ All console.error replaced with logger
- ✅ Winston logger configured
- ✅ CORS uses environment variable
- ✅ Swagger disabled in production
- ✅ npm test script restored
- ✅ Production mode enabled

### Configuration
- ✅ `.env` file exists
- ✅ `NODE_ENV=production` set
- ✅ Database credentials configured
- ✅ MongoDB URI configured
- ✅ CORS_ORIGIN ready (needs to be added to .env)
- ✅ JWT_SECRET set

### Files Ready
- ✅ `.env.production` - Clean version created
- ✅ `package.json` - Test script restored
- ✅ All dependencies listed
- ✅ `.gitignore` - Excludes sensitive files

---

## 📦 What to Upload

### ✅ Upload These:
```
backend/
├── app.js
├── package.json
├── config/
├── controller/
├── db/
├── middleware/
├── router/
├── utils/
├── validation/
├── public/
└── Swagger/ (optional)
```

### ❌ Do NOT Upload:
```
❌ node_modules/     (install on server)
❌ .git/             (not needed)
❌ logs/             (will be created)
❌ .env              (create manually on server)
```

---

## 🔧 On cPanel - Do These Steps

### 1. Fix .env File (IMPORTANT!)
Your current `.env` has line breaks. Use the clean version:

**In cPanel File Manager:**
1. Create new file: `.env`
2. Copy content from `.env.production`
3. Or manually type (no line breaks!):

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

### 2. Setup Node.js App
- Application root: Your backend folder path
- Startup file: `app.js`
- Node version: 18.x or higher
- Mode: Production

### 3. Install Dependencies
```bash
npm install --production
```

### 4. Run Migrations
```bash
npm run migrate
```

### 5. Start Application
Click "Start" or "Restart" in Setup Node.js App

---

## 🔍 Verification Steps

After deployment, test these:

### API Endpoints
- [ ] `GET /api/users` - Returns users
- [ ] `GET /api/courses` - Returns courses
- [ ] `POST /api/users/login` - Login works
- [ ] `GET /api/game` - Returns games

### Logs
- [ ] `logs/combined.log` exists
- [ ] `logs/error.log` exists
- [ ] `logs/bad-requests.log` exists
- [ ] Logs are being written

### Database
- [ ] MySQL connection working
- [ ] MongoDB connection working
- [ ] Migrations completed
- [ ] Tables created

### CORS
- [ ] Frontend can connect
- [ ] No CORS errors in browser
- [ ] Credentials working

---

## ⚠️ Important Notes

### .env File Issue
Your current `.env` has line breaks in the middle of values. This will cause errors!

**Solution**: Use `.env.production` file I created - it's clean and properly formatted.

### CORS Configuration
Added `CORS_ORIGIN` to support your domain:
- `https://hemmx.org`
- `https://www.hemmx.org`

### Port Configuration
- Default: 3000
- cPanel may assign different port
- Check in Setup Node.js App

---

## 📋 Quick Command Reference

```bash
# Navigate to backend
cd /home/username/public_html/your-path/backend

# Install dependencies
npm install --production

# Run migrations
npm run migrate

# View logs
tail -f logs/combined.log

# Check status
pm2 status  # or check cPanel interface
```

---

## 🚀 Upload Order

1. **Upload all backend files** (except node_modules, .git, logs)
2. **Create .env file** on server (use .env.production content)
3. **Setup Node.js App** in cPanel
4. **Install dependencies** (npm install)
5. **Run migrations** (npm run migrate)
6. **Start application**
7. **Test endpoints**
8. **Monitor logs**

---

## ✅ Everything is Ready!

- ✅ Code is production-ready
- ✅ Logging configured
- ✅ Environment variables set
- ✅ npm test script restored
- ✅ Clean .env.production file created
- ✅ Documentation complete

**Follow `CPANEL-DEPLOYMENT.md` for detailed steps!**

---

## 📞 If Something Goes Wrong

1. Check `.env` file format (no line breaks!)
2. Verify Node.js version (18.x+)
3. Check logs: `logs/error.log`
4. Verify database credentials
5. Check MongoDB whitelist includes server IP
6. Restart application in cPanel

**You're all set! Upload and deploy! 🎉**
