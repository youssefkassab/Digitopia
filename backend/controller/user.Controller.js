const env = require( '../config/config')

const getuser = (req, res) => {
  res.send('User Routeres Home', env.API_KEY);
};
const createuser = (req, res) => {
  const user = req.body;
  res.status(201).send(`User ${user.name} created`);
};

module.exports = {
  getuser,
  createuser
}