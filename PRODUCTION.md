# Production Setup Guide

## Changes Made for Production

### 1. **Logging System**
- ✅ Added Winston logger for file-based logging
- ✅ All console output now goes to log files in `backend/logs/`
- ✅ Bad requests (4xx) logged with full error details
- ✅ Server errors (5xx) logged with full stack traces
- ✅ Automatic log rotation (5MB max, 5 files kept)

### 2. **Removed Development Code**
- ✅ Swagger UI disabled in production (only available in development)
- ✅ Removed test scripts from package.json
- ✅ Moved development dependencies to devDependencies
- ✅ Removed morgan (replaced with custom Winston logger)

### 3. **Production Scripts**
- `npm start` - Runs with Node (production)
- `npm run dev` - Runs with Nodemon (development)

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install --production
```

### 2. Configure Environment
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

Edit `.env` and set:
- `NODE_ENV=production`
- Database credentials
- JWT_SECRET (use a strong random string)
- GOOGLE_API_KEY
- Other required variables

### 3. Run Database Migrations
```bash
npm run migrate
```

### 4. Start the Application
```bash
npm start
```

## Log Files

All logs are stored in `backend/logs/`:
- **combined.log** - All logs
- **error.log** - Errors only (5xx)
- **bad-requests.log** - Bad requests (4xx) with full details
- **exceptions.log** - Uncaught exceptions
- **rejections.log** - Unhandled promise rejections

### Monitoring Logs
```bash
# Watch all logs
tail -f backend/logs/combined.log

# Watch errors only
tail -f backend/logs/error.log

# Watch bad requests
tail -f backend/logs/bad-requests.log
```

## Security Checklist

- ✅ Helmet enabled for security headers
- ✅ HPP protection against parameter pollution
- ✅ CORS configured with specific origins
- ✅ Rate limiting enabled
- ✅ Compression enabled
- ✅ Error stack traces hidden in production
- ✅ Swagger UI disabled in production
- ✅ Environment variables for sensitive data

## Performance Optimizations

- ✅ Compression middleware enabled
- ✅ JSON body size limited to 1MB
- ✅ Log rotation to prevent disk space issues
- ✅ Production mode removes development overhead

## What Gets Logged

### Every Bad Request (4xx) Includes:
- Timestamp
- HTTP method and URL
- Client IP address
- User agent
- Status code
- Error message and full stack trace
- Request body
- Request parameters
- Request query strings
- Request headers

### Every Server Error (5xx) Includes:
- Timestamp
- HTTP method and URL
- Client IP address
- User agent
- Status code
- Error message and full stack trace
- Request body
- Request parameters
- Request query strings

## Deployment Checklist

Before deploying to production:

1. ✅ Set `NODE_ENV=production` in `.env`
2. ✅ Configure all environment variables
3. ✅ Run database migrations
4. ✅ Test all API endpoints
5. ✅ Verify log files are being created
6. ✅ Check CORS origins match your frontend URL
7. ✅ Ensure JWT_SECRET is strong and unique
8. ✅ Set up log monitoring/alerting
9. ✅ Configure firewall rules
10. ✅ Set up SSL/TLS certificates

## Troubleshooting

### Logs not appearing?
- Check `backend/logs/` directory exists
- Verify write permissions
- Check `LOG_LEVEL` environment variable

### Application crashes?
- Check `backend/logs/exceptions.log`
- Check `backend/logs/error.log`
- Verify all environment variables are set

### High disk usage?
- Logs auto-rotate at 5MB
- Maximum 5 files per log type
- Old logs are automatically deleted

## Additional Resources

See `backend/LOGGING.md` for detailed logging documentation.
