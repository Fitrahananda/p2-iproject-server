const bcrypt = require("bcryptjs");

const decryption = (password, passwordUser) => {
  return bcrypt.compareSync(password, passwordUser);
};

const encrypt = (password) => {
  return bcrypt.hashSync(password, 8);
};
module.exports = { encrypt, decryption };
