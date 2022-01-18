const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authConfig = require("../config/auth.config.js");

const User = require("../models/user.js");
const RefreshToken = require("../models/jwt-refresh-token.js");

exports.registerUser = async (email, name, surname, password) => {
  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      const error = new Error("User with given email already exists");
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      name: name,
      surname: surname,
      password: hashedPassword,
      admin: false,
    });
    await user.save();
  } catch (error) {
    throw error;
  }
};

exports.loginUser = async (email, password) => {
  try {
    const loadedUser = await User.findOne({ email: email });
    if (!loadedUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, loadedUser.password);
    if (!isEqual) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      authConfig.secret,
      { expiresIn: authConfig.jwtExpiration }
    );

    let refreshToken = await RefreshToken.createToken(loadedUser);

    return {
      token: token,
      refreshToken: refreshToken,
      userId: loadedUser._id.toString(),
    };
  } catch (error) {
    throw error;
  }
};

exports.refreshToken = async (requestToken) => {
  try {
    const refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      const err = new Error("Refresh token is not in database!");
      err.statusCode = 403;
      throw err;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();

      const err = new Error(
        "Refresh token was expired. Please make a new signin request"
      );
      err.statusCode = 403;
      throw err;
    }

    const newAccessToken = jwt.sign(
      {
        email: refreshToken.user.email,
        userId: refreshToken.user._id.toString(),
      },
      authConfig.secret,
      {
        expiresIn: authConfig.jwtExpiration,
      }
    );

    return {
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    };
  } catch (error) {
    throw error;
  }
};
