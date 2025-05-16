const jwt = require('jsonwebtoken');

const protectRoute = (req, res, next) => {
  const authHeader = req.header('Authorization');  // Note: headers are case-sensitive
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  // Expect the header format: 'Bearer <token>'
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Malformed authorization header' });
  }

  const token = tokenParts[1];

  // Verify token
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded; // Attach the decoded user data to the request
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = protectRoute;
