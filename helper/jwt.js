const jwt = require("jsonwebtoken");

const privatekey = process.env.SECRET;

function tokenCreate(payload) {
  return jwt.sign(payload, privatekey, {
    expiresIn: "1h",
  });
}

function tokenVerify(token) {
  return jwt.verify(token, privatekey);
}

module.exports = {
  tokenCreate,
  tokenVerify,
};
