const authenticate = require("../helpers/Auth_Helper").checkToken;
const userLogic = require("../bisnislogics/M_User_Logic");
const unitLogic = require("../bisnislogics/M_Unit_Logic");
const souvenirLogic = require("../bisnislogics/M_Souvenir_Logic");
const productLogic = require("../bisnislogics/M_Product_Logic");
const employeeLogic = require("../bisnislogics/M_Employee_Logic");
const tDesignLogic = require("../bisnislogics/T_Design_Logic");
const tDesignItemLogic = require("../bisnislogics/T_Design_Item_Logic.js");
const tEvent = require("../bisnislogics/T_Event_Logic");
const roleLogic = require("../bisnislogics/M_Role_Bisnis_Logic");
const accessLogic = require("../bisnislogics/M_Menu_Access_Bisnis_Logic");
module.exports = server => {
  // Root Route
  server.get("/", (req, res, next) => {});

  // Master Role Route
  // Made By: Randika Alditia
  server.get("/api/role", authenticate, roleLogic.readAllRole);
  server.get("/api/role/:id", authenticate, roleLogic.readOneRole);
  server.post("/api/role", authenticate, roleLogic.createRole);
  server.put("/api/role/:id", authenticate, roleLogic.updateRole);
  server.del("/api/role/:id", authenticate, roleLogic.deleteRole);
  //== End of Master Role Route

  // Master Access Menu Route
  // Made By: Randika Alditia
  server.get("/api/access", authenticate, accessLogic.readAllAccess);
  server.get("/api/access/:id", authenticate, accessLogic.readOneAccess);
  server.put("/api/access/:id", authenticate, accessLogic.updateAccess);
  //== End of Master Access Menu Route

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
  server.get("/api/design", authenticate, tDesignLogic.readAllDesignHandler);
  server.get("/api/design/code", authenticate, tDesignLogic.getCodeHandler);
  server.get("/api/design/:code", authenticate, tDesignLogic.readByCodeHandler);
  server.post("/api/design", authenticate, tDesignLogic.createDesignHandler);
  server.put(
    "/api/design/:code",
    authenticate,
    tDesignLogic.updateDesignHandler
  );
  server.put(
    "/api/design/approve/:code",
    authenticate,
    tDesignLogic.approveHandler
  );
  server.put(
    "/api/design/close/:code",
    authenticate,
    tDesignLogic.closeReqHandler
  );
  server.post(
    "/api/design/upload_files",
    authenticate,
    tDesignLogic.createDesignItemFile
  );
  server.get(
    "/api/design/files/:itemId",
    authenticate,
    tDesignLogic.getDesignFiles
  );
  server.get("/api/design/requester", authenticate, tDesignLogic.getRequester);
  server.get("/api/design/staff", authenticate, tDesignLogic.getStaff);
  //== End of Transaction Design Route

  // Transaction Design Item Route
  // Made By: Dian Yuanda
  server.get("/api/design/item/:code", tDesignItemLogic.readAllItemHandler);
  server.post("/api/design/item", tDesignItemLogic.createItemHandler);
  server.put("/api/design/item", tDesignItemLogic.updateItemHandler);
  server.del("/api/design/item/:itemId", tDesignItemLogic.deleteItemHandler);
  //== End of Transaction Design Item Route

  // PRODUCT by Purwanto
  server.get("/api/product", productLogic.readAllHandler);
  server.get("/api/product/:productId", productLogic.readByIdHandler);
  server.get(
    // code, name, description, created_date, created_by
    "/api/product/:Code/:Name/:Description/:createdDate/:createdBy",
    productLogic.searchHandler
  );
  server.post("/api/product", productLogic.createHandler);
  server.put("/api/product/:productId", productLogic.updateHandler);
  server.del("/api/product/:productId", productLogic.deleteHandler);
  //== End of Master Product Item Route

  // Employee Route
  // Made By: Purwanto
  server.get("/api/employee", authenticate, employeeLogic.readAllHandler);
  server.get("/api/employee/:employeeId", employeeLogic.readByIdHandler);
  server.get(
    // empId, empName, company, createdDate, createdBy)
    "/api/employee/:empId/:empName/:company/:createdDate/:createdBy",
    employeeLogic.searchHandler
  );
  server.post("/api/employee", employeeLogic.createHandler);
  server.put("/api/employee/:employeeId", employeeLogic.updateHandler);
  server.del("/api/employee/:employeeId", employeeLogic.deleteHandler);
  //== End of Employee Route

  // T Event Route
  // Made By: Purwanto
  server.get("/api/tevent", tEvent.readAllHandler);
  server.get("/api/tevent/:teventId", tEvent.readByIdHandler);
  server.post("/api/tevent", tEvent.createHandler);
  server.put("/api/tevent/:teventId", tEvent.updateHandler);
  server.del("/api/tevent/:teventId", tEvent.deleteHandler);
  //== End of T Event Route

  // Master User Route - Login Process
  // Made By: Hanif Al Baaits
  server.post("/api/user/login", userLogic.loginUserHandler);
  //== End of T Event Route
};
