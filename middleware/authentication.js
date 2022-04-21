const { tokenVerify } = require("../helper/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    const payloads = tokenVerify(access_token);
    const findUser = await User.findByPk(payloads.id);
    if (!findUser) {
      throw { name: "Invalid token" };
    } else {
      req.user = {
        id: findUser.id,
      };
    }
    console.log(req.user);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authentication;
