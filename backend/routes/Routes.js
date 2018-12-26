const authenticate = require("../helpers/Auth_Helper").checkToken;
const unitLogic = require("../bisnislogics/M_Unit_Logic");
const souvenirLogic = require("../bisnislogics/M_Souvenir_Logic");
const tDesignLogic = require("../bisnislogics/T_Design_Logic");
const tDesignItemLogic = require("../bisnislogics/T_Design_Item_Logic.js");

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

  // Transaction Design Route
  // Made By: Dian Yuanda
  server.get("/api/design", tDesignLogic.readAllDesignHandler);
  server.get("/api/design/code", tDesignLogic.getCodeHandler);
  server.get("/api/design/:code", tDesignLogic.readByCodeHandler);
  server.post("/api/design", tDesignLogic.createDesignHandler);
  server.put("/api/design/:code", tDesignLogic.updateDesignHandler);
  server.put("/api/design/approve/:code", tDesignLogic.approveHandler);
  server.put("/api/design/close/:code", tDesignLogic.closeReqHandler);
  server.post("/api/design/upload_files", tDesignLogic.createDesignItemFile);
  server.get("/api/design/files/:itemId", tDesignLogic.getDesignFiles);
  server.get("/api/design/requester", tDesignLogic.getRequester);
  server.get("/api/design/staff", tDesignLogic.getStaff);
  //== End of Transaction Design Route

  // Transaction Design Item Route
  // Made By: Dian Yuanda
  server.get("/api/design/item/:code", tDesignItemLogic.readAllItemHandler);
  server.post("/api/design/item", tDesignItemLogic.createItemHandler);
  server.put("/api/design/item", tDesignItemLogic.updateItemHandler);
  server.del("/api/design/item/:itemId", tDesignItemLogic.deleteItemHandler);
  //== End of Transaction Design Item Route
};
