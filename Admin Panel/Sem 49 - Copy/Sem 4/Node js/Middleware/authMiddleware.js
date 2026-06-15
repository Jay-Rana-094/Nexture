const jwt = require("jsonwebtoken");
const JWT_SECRET = "mysecretkey123";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).send({ msg: "Token required" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ msg: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
};

module.exports = authMiddleware;
