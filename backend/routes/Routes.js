const authenticate = require("../helpers/Auth_Helper").checkToken;
const unitLogic = require("../bisnislogics/M_Unit_Logic");

module.exports = server => {
  // Root Route
  server.get("/", (req, res, next) => {});

  // Master Unit Route
  server.get("/api/unit", unitLogic.readAllUnit);
  server.get("/api/unit/:unitId", unitLogic.readOneById);
  server.post("/api/unit", unitLogic.createUnit);
  server.put("/api/unit/:unitId", unitLogic.updateUnit);
  server.del("/api/unit/:unitId", unitLogic.deleteUnit);
  //==End of Master Unit Route
};
