const authenticate = require("../helpers/Auth_Helper").checkToken;
const unitLogic = require("../bisnislogics/M_Unit_Logic");
const souvenirLogic = require("../bisnislogics/M_Souvenir_Logic");

module.exports = server => {
  // Root Route
  server.get("/", (req, res, next) => {});

  // Master Souvenir Route
  server.get("/api/souvenir", souvenirLogic.readAllSouvenir);
  server.get("/api/souvenir/:souvenirId", souvenirLogic.readSouvenirById);
  server.post("/api/souvenir", souvenirLogic.createSouvenir);
  server.put("/api/souvenir/:souvenirId", souvenirLogic.updateSouvenir);
  server.del("/api/souvenir/:code", souvenirLogic.deleteSouvenir);
  //== End of Master Souvenir Route

  // Master Unit Route
  server.get("/api/unit", unitLogic.readAllUnit);
  server.get("/api/unit/:unitId", unitLogic.readOneById);
  server.post("/api/unit", unitLogic.createUnit);
  server.put("/api/unit/:unitId", unitLogic.updateUnit);
  server.del("/api/unit/:unitId", unitLogic.deleteUnit);
  //==End of Master Unit Route
};
