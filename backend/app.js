require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Auth = require('./middleware/auth.middleware');
const limit = require('./middleware/limit.middleware'); 
const userRoutes = require('./router/user.router');
const courseRoutes = require('./router/course.router');
const messageRoutes = require('./router/message.router');
// Import Sequelize models to trigger DB sync and logging
require('./db/models');
app.use(express.json());
app.use(cors());

app.use('/api/users',userRoutes);
app.use('/api/courses',courseRoutes);
app.use('/api/messages',messageRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
