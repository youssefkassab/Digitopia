const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./router/user.router');
const courseRoutes = require('./router/course.router');
const messageRoutes = require('./router/message.router');
const config = require('./config/config');
const PORT = config.PORT;
const helmet = require('helmet');
const compression = require('compression');
const hpp = require('hpp');
const morgan = require('morgan');

app.set('trust proxy', 1);
app.use(helmet());
app.use(hpp());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors({ origin: config.CORS_ORIGIN?.split(',') ?? '*', credentials: true }));
// Import Sequelize models to trigger DB sync and logging
require('./db/models');

// Swagger UI (dev-only by default). To disable, set ENABLE_SWAGGER=false or run in production.
const enableSwagger = (config.NODE_ENV !== 'production') && (process.env.ENABLE_SWAGGER !== 'false');
if (enableSwagger) {
  try {
    const path = require('path');
    const swaggerUi = require('swagger-ui-express');
    const YAML = require('yamljs');
    const swaggerPath = path.join(__dirname, 'Swagger', 'openapi.yaml');
    const swaggerDocument = YAML.load(swaggerPath);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('Swagger UI enabled at /docs');
  } catch (e) {
    console.warn('Swagger UI not enabled. Install swagger-ui-express and yamljs to enable.');
  }
}

//main api
app.use('/api/users',userRoutes);
app.use('/api/courses',courseRoutes);
app.use('/api/messages',messageRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Also handle unhandled rejections and exceptions at process level
process.on('unhandledRejection', (r) => console.error(r));
process.on('uncaughtException', (e) => { console.error(e); process.exit(1); });
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
