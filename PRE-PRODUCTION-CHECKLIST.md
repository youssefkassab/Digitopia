# Pre-Production Checklist

## ✅ Completed Changes

### 1. **Logging System**
- ✅ All `console.log` replaced with `logger.info/warn/error`
- ✅ All `console.error` replaced with `logger.error`
- ✅ Winston logger configured with file output
- ✅ Log files in `backend/logs/` directory
- ✅ Bad requests logged with full details

### 2. **Code Cleanup**
- ✅ Removed development test scripts
- ✅ Swagger UI disabled in production
- ✅ Development dependencies separated

## ⚠️ CRITICAL - Must Do Before Upload

### 1. **Create .env File** 🔴 REQUIRED
You **MUST** create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Then edit `.env` and set:
- `NODE_ENV=production`
- `JWT_SECRET=` (generate a strong random string)
- `DB_HOST=` (your production database host)
- `DB_USER=` (your database username)
- `DB_PASSWORD=` (your database password)
- `DB_NAME=digitopia`
- `MONGO_URI=` (your MongoDB connection string)
- `GOOGLE_API_KEY=` (your Google AI API key)
- `CORS_ORIGIN=` (your production frontend URL)

**⚠️ NEVER commit .env file to git!**

### 2. **Update CORS Origins** 🔴 REQUIRED
In `backend/app.js` line 29-34, update CORS origins:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN.split(','), // Use environment variable
  credentials: true,
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Or set `CORS_ORIGIN` in `.env`:
```
CORS_ORIGIN=https://your-production-domain.com,https://www.your-production-domain.com
```

### 3. **Security Checks**
- ✅ No hardcoded passwords or API keys in code
- ⚠️ Verify `.env` file is in `.gitignore` (already done)
- ⚠️ Generate strong JWT_SECRET (at least 32 characters)
- ⚠️ Update database credentials for production
- ⚠️ Update CORS origins to production URLs

### 4. **Database Setup**
- ⚠️ Run migrations on production database:
  ```bash
  npm run migrate
  ```
- ⚠️ Verify database connection settings
- ⚠️ Ensure MongoDB is accessible

### 5. **Dependencies**
- ⚠️ Run `npm install` to install winston:
  ```bash
  cd backend
  npm install
  ```

## 📋 Files That Need Attention

### Files with localhost references:
1. **`backend/app.js`** (line 29-34) - CORS origins
   - Currently: `["http://localhost:5173","http://localhost:3000"]`
   - Change to: Your production URLs

### Files that need .env:
1. **`backend/config/config.js`** - Reads from `.env`
2. **`backend/utils/db.js`** - Needs `MONGO_URI`
3. **All controllers** - Need environment variables

## 🚀 Deployment Steps

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create and configure .env:**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

3. **Run database migrations:**
   ```bash
   npm run migrate
   ```

4. **Test the application:**
   ```bash
   npm start
   ```

5. **Monitor logs:**
   ```bash
   tail -f logs/combined.log
   ```

## 🔒 Security Best Practices

- ✅ Helmet enabled for security headers
- ✅ HPP protection enabled
- ✅ Rate limiting enabled
- ✅ CORS configured
- ✅ Error stack traces hidden in production
- ⚠️ **Set strong JWT_SECRET** (minimum 32 characters)
- ⚠️ **Use HTTPS in production**
- ⚠️ **Set secure database passwords**
- ⚠️ **Restrict CORS to specific domains**

## 📝 Environment Variables Required

```env
# Server
NODE_ENV=production
PORT=3000

# Database
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=digitopia
DB_PORT=3306

# MongoDB
MONGO_URI=mongodb://your_mongo_uri
AI_DB_NAME=digitopia_ai
AI_COLLECTION_NAME=embeddings

# Security
JWT_SECRET=your_very_long_random_secret_key_here

# APIs
GOOGLE_API_KEY=your_google_api_key

# CORS
CORS_ORIGIN=https://your-domain.com

# Logging (optional)
LOG_LEVEL=info
```

## ⚠️ Common Mistakes to Avoid

1. ❌ Uploading .env file to git
2. ❌ Using localhost URLs in production
3. ❌ Weak JWT_SECRET
4. ❌ Not running migrations
5. ❌ Not installing dependencies
6. ❌ Leaving CORS open to all origins (*)

## ✅ Final Checklist Before Upload

- [ ] Created `.env` file with all required variables
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Generated strong JWT_SECRET (32+ characters)
- [ ] Updated CORS origins to production URLs
- [ ] Verified database credentials
- [ ] Ran `npm install` to install winston
- [ ] Ran database migrations
- [ ] Tested application locally
- [ ] Verified logs are being created
- [ ] Removed any test/debug code
- [ ] Verified `.env` is in `.gitignore`
- [ ] Set up MongoDB connection
- [ ] Configured Google API key

## 📞 Need Help?

Check these files for reference:
- `PRODUCTION.md` - Production setup guide
- `LOGGING.md` - Logging documentation
- `CHANGES.md` - Summary of all changes
- `.env.example` - Environment variable template
