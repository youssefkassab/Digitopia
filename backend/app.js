require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./router/user.router');
const courseRoutes = require('./router/course.router');
const messageRoutes = require('./router/message.router');
const adminRoutes = require('./router/admin.router');
const askRoutes = require("./router/ask.router");
const searchRoutes = require("./router/search.router");
const structureRoutes = require("./router/genrateStructure.router");
const uploadRoutes = require("./router/uploadFile.router");
const embeddingRoutes = require("./router/embedding.router");
const gameRoutes = require("./router/game.router");
const config = require('./config/config');
const PORT = config.PORT;
const helmet = require('helmet');
const compression = require('compression');
const hpp = require('hpp');
const path = require('path');
const logger = require('./utils/logger');

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
// Removed conflicting bodyParser.json() and fileUpload() middleware


app.set('trust proxy', 1);

// CORS configuration - use environment variable or default to localhost for development
const corsOrigins = config.CORS_ORIGIN 
  ? config.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "connect-src": ["'self'", "https://hemmx.ai:3001"],
    },
  },
}));
app.use(hpp());
app.use(compression());
app.use(express.json({ limit: '1mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log response after it's sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    
    if (res.statusCode >= 500) {
      logger.error(logMessage);
    } else if (res.statusCode >= 400) {
      logger.warn(logMessage);
    } else {
      logger.info(logMessage);
    }
  });
  
  next();
});
// Import Sequelize models to trigger DB sync and logging
require('./db/models');

// Swagger UI disabled in production
if (config.NODE_ENV !== 'production') {
  try {
    const swaggerUi = require('swagger-ui-express');
    const YAML = require('yamljs');
    const swaggerPath = path.join(__dirname, 'Swagger', 'openapi.yaml');
    const swaggerDocument = YAML.load(swaggerPath);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    logger.info('Swagger UI enabled at /docs');
  } catch (e) {
    logger.warn('Swagger UI not enabled. Install swagger-ui-express and yamljs to enable.');
  }
}

//main api
// Middleware to set proper headers for game content
app.use(['/games'], (req, res, next) => {
  // Set CSP headers to allow game content
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self'; " +
    "font-src 'self'; " +
    "object-src 'none'; " +
    "media-src 'self'; " +
    "frame-src 'self';"
  );

  // Set other security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  next();
});

// Serve static files from public directory
app.use('/games', express.static(path.join(__dirname, 'public/games')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// Serve frontend static files (after build)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API routes
app.use('/api/users',userRoutes);
app.use('/api/courses',courseRoutes);
app.use('/api/messages',messageRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/game',gameRoutes);
app.use("/ask", askRoutes);
app.use("/search", searchRoutes);
app.use("/genrateStructure", structureRoutes);
app.use("/uploadFile", uploadRoutes);
app.use("/embedding", embeddingRoutes);


// Serve frontend for all non-API routes (SPA support)
// app.get('*', (req, res, next) => {
//   // Skip if it's an API route
//   if (req.path.startsWith('/api') || req.path.startsWith('/ask') || 
//       req.path.startsWith('/search') || req.path.startsWith('/genrateStructure') || 
//       req.path.startsWith('/uploadFile') || req.path.startsWith('/embedding') ||
//       req.path.startsWith('/games') || req.path.startsWith('/img')) {
//     return next();
//   }
  
//   // Serve index.html for all other routes (React Router support)
//   res.sendFile(path.join(__dirname, '../frontend/dist/index.html'), (err) => {
//     if (err) {
//       logger.error('Error serving index.html:', { error: err.message });
//       res.status(404).json({ error: 'Frontend not found. Please build the frontend first.' });
//     }
//   });
// });

// 404 handler for API routes
app.use((req, res) => {
  logger.logBadRequest(req, new Error('Route not found'), 404);
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  
  // Log bad requests (4xx errors) with full details
  if (statusCode >= 400 && statusCode < 500) {
    logger.logBadRequest(req, err, statusCode);
  } 
  // Log server errors (5xx errors) with full details
  else {
    logger.logError(req, err, statusCode);
  }
  
  // Send error response
  const errorResponse = {
    error: err.message || 'Internal server error',
    ...(config.NODE_ENV !== 'production' && { stack: err.stack })
  };
  
  res.status(statusCode).json(errorResponse);
});

// Handle unhandled rejections and exceptions at process level
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
  process.exit(1);
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT} in ${config.NODE_ENV} mode`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  // Gracefully shutdown
  server.close(() => {
    process.exit(1);
  });
});
