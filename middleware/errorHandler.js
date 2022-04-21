const error = (err, req, res, next) => {
  let error = "";
  let code = "";
  switch (err.name) {
    case "SequelizeUniqueConstraintError":
      error = "Email must be unique";
      code = 400;
      break;
    case "SequelizeValidationError":
      error = err.errors;
      error = error.map((e) => {
        return e.message;
      });
      error = error[0];
      code = 400;
      break;
    case "Email is required":
    case "Password is required":
    case "Please select gender":
    case "Please upload photo":
      error = err.name;
      code = 400;
      break;
    case "Invalid email/password":
      error = err.name;
      code = 401;
      break;
    case "Data not found":
    case "Add Profile First":
    case "Already have a profile":
    case "Photo is required":
    case "You can't add more":
    case "Wrong Email":
    case "Password not match":
      error = err.name;
      code = 404;
      break;
    case "You are not authorized":
      error = err.name;
      code = 403;
      break;
    case "Invalid token":
    case "JsonWebTokenError":
    case "TokenExpiredError":
      error = "Invalid token";
      code = 401;
      break;
    default:
      error = "Internal server error";
      code = 500;
      break;
  }
  res.status(code).json({
    message: error,
  });
};

module.exports = error;
