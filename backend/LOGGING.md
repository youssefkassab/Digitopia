# Logging System Documentation

## Overview
This application uses Winston for comprehensive logging to track all requests, errors, and bad requests with full details.

## Log Files Location
All log files are stored in the `backend/logs/` directory:

- **`combined.log`** - All application logs (info, warnings, errors)
- **`error.log`** - Only error logs (5xx errors)
- **`bad-requests.log`** - Bad requests with full details (4xx errors)
- **`exceptions.log`** - Uncaught exceptions
- **`rejections.log`** - Unhandled promise rejections

## Log Rotation
- Maximum file size: 5MB
- Maximum files kept: 5 (older files are automatically deleted)

## What Gets Logged

### Bad Requests (4xx errors)
Every bad request is logged with:
- Timestamp
- HTTP method and URL
- Client IP address
- User agent
- Status code
- Error message and stack trace
- Request body, params, and query
- Request headers

### Server Errors (5xx errors)
Every server error is logged with:
- Timestamp
- HTTP method and URL
- Client IP address
- User agent
- Status code
- Error message and stack trace
- Request body, params, and query

### Request Logging
All requests are logged with:
- HTTP method and URL
- Status code
- Response time in milliseconds

## Log Levels
- `error` - Server errors (5xx)
- `warn` - Bad requests (4xx)
- `info` - Successful requests (2xx, 3xx)

## Configuration
Set the `LOG_LEVEL` environment variable to control logging verbosity:
```
LOG_LEVEL=info  # Default - logs everything
LOG_LEVEL=warn  # Only warnings and errors
LOG_LEVEL=error # Only errors
```

## Production vs Development
- **Production**: Logs only to files
- **Development**: Logs to both console and files

## Monitoring Logs
To monitor logs in real-time:
```bash
# Watch all logs
tail -f backend/logs/combined.log

# Watch only errors
tail -f backend/logs/error.log

# Watch bad requests
tail -f backend/logs/bad-requests.log
```

## Example Log Entry
```
2025-10-02 08:53:48 [WARN]: Bad Request
Metadata: {
  "timestamp": "2025-10-02T05:53:48.123Z",
  "method": "POST",
  "url": "/api/users/login",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "statusCode": 400,
  "error": "Invalid credentials",
  "stack": "Error: Invalid credentials\n    at ...",
  "requestBody": {
    "email": "user@example.com",
    "password": "[REDACTED]"
  },
  "requestParams": {},
  "requestQuery": {}
}
```
