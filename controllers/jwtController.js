const jwt = require('jsonwebtoken');

const verifyToken = async (request, h) => {
  const token = request.state.token;

  if (!token) {
    return h.response({
      error: 'Unauthorized: No token provided'
    }).code(401).takeover();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    request.user = decoded;

    return h.continue;
  } catch (err) {
    return h.response({
      error: 'Invalid or expired token'
    }).code(401).takeover();
  }
};

module.exports = verifyToken;