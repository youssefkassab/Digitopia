const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized call me' });
  }

  // Here you would typically verify the token
  // For example, using jwt.verify(token, secretKey)
  
  next();
}

module.exports = auth;