const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const authConfig = require("../config/auth.config.js");

const refreshTokenSchema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiryDate: Date,
});

refreshTokenSchema.statics.createToken = async function (user) {
  let expiredAt = new Date();

  expiredAt.setSeconds(
    expiredAt.getSeconds() + authConfig.jwtRefreshExpiration
  );

  let token = uuidv4();

  let object = new this({
    token: token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });

  let refreshToken = await object.save();

  return refreshToken.token;
};

refreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
};

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
