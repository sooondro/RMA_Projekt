const {
  registerUser,
  loginUser,
  refreshToken,
} = require("../services/auth.services.js");

exports.postRegisterUser = async (req, res, next) => {
  const { email, password, name, surname } = req.body;

  try {
    await registerUser(email, name, surname, password);
    res.status(200).json({
      confirmation: "success",
      message: "User registered",
    });
  } catch (error) {
    next(error);
  }
};

exports.postLoginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const data = await loginUser(email, password);

    res.status(200).json({
      confirmation: "Success",
      message: "JWT created",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

exports.postRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (refreshToken == null) {
    const err = new Error("Refresh Token is required!");
    err.statusCode = 403;
    return next(err);
  }
  try {
    const data = await refreshToken(refreshToken);

    return res.status(200).json({
      confirmation: "success",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
