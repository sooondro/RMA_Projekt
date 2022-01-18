const jwt = require("jsonwebtoken");

const authConfig = require("../config/auth.config.js");

const { TokenExpiredError } = jwt;

const catchError = (err, next) => {
  if (err instanceof TokenExpiredError) {
    return next(err);
  }

  next(err);
};

const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, authConfig.secret, (err, decodedToken) => {
    if (err) {
      return catchError(err, next);
    }
    req.userId = decodedToken.userId;
    next();
  });
};

module.exports = isAuth;
