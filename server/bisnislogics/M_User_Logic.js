const responseHelper = require("../helpers/Response_Helper");
const userData = require("../datalayers/M_User_Data");
const authConfig = require("../config/Auth_Config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const M_user_Logic = {
  loginUserHandler: (req, res, nex) => {
    const userdata = {
      username: req.body.username,
      password: req.body.password
    };
    userData.readUserByUsername(user => {
      if (user) {
        if (bcrypt.compareSync(userdata.password, user.password)) {
          let token = jwt.sign(user, authConfig.secretKey, {
            expiresIn: "12h"
          });

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
  },
  readUserAllHandler: (req, res, next) => {
    userData.readUserAllData(items => {
      responseHelper.sendResponse(res, 200, items);
    });
  },
  readEmployeeFromUser: (req, res, next) => {
    userData.readEmployeeFromUser(items => {
      //sebelumnya dtl ganti userData
      responseHelper.sendResponse(res, 200, items);
      //responhelper jadi camelcase
    });
  },
  readUserByUsername: (req, res, next) => {
    let username = req.params.userid;
    userData.readUserByUsername(items => {
      responseHelper.sendResponse(res, 200, items);
    }, username);
  },
  deleteUserHandler: (req, res, next) => {
    let id = req.params.id;
    userData.deleteUserData(items => {
      responseHelper.sendResponse(res, 200, items);
    }, id);
  },
  createUserHandler: (req, res, next) => {
    let username = req.body.username;
    userData.readUserByUsername(docs => {
      if (docs) {
        responseHelper.sendResponse(res, 401, "User telah ada");
      } else {
        const newUser = {
          username: req.body.username,
          password: req.body.password,
          m_role_id: req.body.m_role_id,
          m_employee_id: req.body.m_employee_id,
          is_delete: false,
          created_by: req.body.created_by,
          created_date: moment().format("DD/MM/YYYY")
        };

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            userData.createUserData(function(items) {
              responseHelper.sendResponse(res, 200, items);
            }, newUser);
          });
        });
      }
    }, username);
  },
  updateUserById: (req, res, next) => {
    //param melalui object ID & tidak boleh ganti username
    let id = req.params.id;
    const data = {
      username: req.body.username,
      password: req.body.password,
      m_role_id: req.body.m_role_id,
      m_employee_id: req.body.m_employee_id,
      updated_by: req.body.updated_by,
      updated_date: moment().format("DD/MM/YYYY")
    };
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(data.password, salt, (err, hash) => {
        data.password = hash;
        userData.updateUserData(
          items => {
            responseHelper.sendResponse(res, 200, items);
          },
          data,
          id
        );
      });
    });
  },
  forgotPassword: (req, res, nex) => {
    let userId = req.params.userid;
    const formdata = {
      username: req.body.username,
      password: req.body.password,
      updated_date: moment().format("DD/MM/YYYY")
    };

    // Check Username is Exist
    userData.readUserByUsername(docs => {
      if (docs) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(formdata.password, salt, (err, hash) => {
            // Update Plain Password with Hashed Password
            formdata.password = hash;

            userData.rePassword(
              items => {
                responseHelper.sendResponse(res, 200, items);
              },
              formdata,
              userId
            );
          });
        });
      } else {
        responseHelper.sendResponse(res, 404, "User Not Found!");
      }
    }, formdata.username);
  }
};

module.exports = M_user_Logic;
