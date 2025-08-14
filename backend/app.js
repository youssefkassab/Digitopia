const express = require('express');
const app = express();
const cors = require('cors');
const Auth = require('./middleware/auth.middleware');
const limit = require('./middleware/limit.middleware'); 
const userRoutes = require('./router/user.router');
const courseRoutes = require('./router/course.router');
app.use(express.json());
app.use(cors());

app.use('/api/users',userRoutes);
app.use('/api/courses',courseRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
