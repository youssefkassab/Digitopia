const express = require('express');
const app = express();
const cors = require('cors');
const Auth = require('./midelware/auth.midelware');
const userRoutes = require('./routeres/user.routeres');
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api',Auth,userRoutes);
app.use('/api/users', userRoutes);
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
