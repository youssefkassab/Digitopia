const express = require('express');
const app = express();
const cors = require('cors');
const Auth = require('./middleware/auth.middleware');
const limit = require('./middleware/limit.middleware'); 
const userRoutes = require('./router/user.router');
const courseRoutes = require('./router/course.router');
const messageRoutes = require('./router/message.router');
const config = require('./config/config');
const PORT = config.PORT;
// Import Sequelize models to trigger DB sync and logging
require('./db/models');
app.use(express.json());
app.use(cors());
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
