# Quick Start - Production Deployment

## 🚀 5-Minute Setup

### Step 1: Create .env File
```bash
cd backend
cp .env.example .env
```

### Step 2: Edit .env File
Open `backend/.env` and set these **REQUIRED** values:

```env
NODE_ENV=production
JWT_SECRET=your_very_long_random_secret_at_least_32_characters_here
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
MONGO_URI=mongodb://your_mongodb_connection_string
GOOGLE_API_KEY=your_google_api_key
CORS_ORIGIN=https://your-production-domain.com
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Run Migrations
```bash
npm run migrate
```

### Step 5: Start Application
```bash
npm start
```

### Step 6: Monitor Logs
```bash
# In another terminal
tail -f logs/combined.log
```

---

## ⚠️ Don't Forget!

1. **Generate strong JWT_SECRET:**
   ```bash
   # Use this command to generate a random secret:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Update CORS origins** to your actual production URLs

3. **Never commit .env file** to git (already in .gitignore)

---

## 📋 Verification

After starting, verify:
- ✅ Server starts without errors
- ✅ Log files created in `backend/logs/`
- ✅ Database connection successful
- ✅ MongoDB connection successful
- ✅ API endpoints responding

---

## 🆘 Troubleshooting

**Server won't start?**
- Check `.env` file exists
- Verify all required variables are set
- Check `logs/error.log` for details

**Database errors?**
- Verify database credentials
- Ensure database exists
- Run migrations: `npm run migrate`

**MongoDB errors?**
- Check MONGO_URI format
- Verify MongoDB is accessible
- Check network/firewall settings

---

## 📚 Full Documentation

- `PRE-PRODUCTION-CHECKLIST.md` - Complete checklist
- `SCAN-RESULTS.md` - What was changed
- `PRODUCTION.md` - Detailed setup guide
- `LOGGING.md` - Logging documentation

---

## 🎯 That's It!

Your application should now be running in production mode with:
- ✅ File-based logging
- ✅ Error tracking
- ✅ Security enabled
- ✅ Production optimizations

Monitor your logs and enjoy! 🎉
