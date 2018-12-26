const responseHelper = require("../helpers/Response_Helper");
const userData = require("../datalayers/M_User_Data");
const authConfig = require("../config/Auth_Config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const M_user_Logic = {
  loginUserHandler: (req, res, nex) => {
    const userdata = {
      username: req.body.username,
      password: req.body.password
    };

    userData.readUserByUsername(user => {
      if (user) {
        if (bcrypt.compareSync(userdata.password, user.password)) {
          let token = jwt.sign(user, authConfig.secretKey);
          // Remove Password Property
          delete user.password;

          responseHelper.sendResponse(res, 200, { token: token });
        } else {
          responseHelper.sendResponse(
            res,
            404,
            "Email or Password Combination Didn't Match!"
          );
        }
      } else {
        responseHelper.sendResponse(
          res,
          404,
          "Email or Password Combination Didn't Match!"
        );
      }
    }, userdata.username);
  }
};

module.exports = M_user_Logic;
