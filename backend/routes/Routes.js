const authenticate = require("../helpers/Auth_Helper").checkToken;

module.exports = server => {
  // Root Route
  server.get("/", (req, res, next) => {});
};
