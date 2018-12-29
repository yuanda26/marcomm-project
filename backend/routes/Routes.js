const authenticate = require("../helpers/Auth_Helper").checkToken;
const companyLogic = require("../bisnislogics/M_Company_Logic");
const userLogic = require("../bisnislogics/M_User_Logic");
const unitLogic = require("../bisnislogics/M_Unit_Logic");
const souvenirLogic = require("../bisnislogics/M_Souvenir_Logic");
const productLogic = require("../bisnislogics/M_Product_Logic");
const employeeLogic = require("../bisnislogics/M_Employee_Logic");
const roleLogic = require("../bisnislogics/M_Role_Bisnis_Logic");
const accessLogic = require("../bisnislogics/M_Menu_Access_Bisnis_Logic");
const tDesignLogic = require("../bisnislogics/T_Design_Logic");
const tDesignItemLogic = require("../bisnislogics/T_Design_Item_Logic.js");
const event = require("../bisnislogics/T_Event_Logic");
const tSouvenirLogic = require("../bisnislogics/T_Souvenir_Logic");
const tSouvenirItemLogic = require("../bisnislogics/T_Souvenir_Item_Logic");

module.exports = server => {
  // Root Route
  server.get("/", (req, res, next) => {});

  // Master Company Route
  // Made By: Deovani Anugrah
  server.get("/api/company", authenticate, companyLogic.readAllCompany);
  server.get(
    "/api/company/:companyId",
    authenticate,
    companyLogic.readCompanyByID
  );
  server.post("/api/company", authenticate, companyLogic.createCompany);
  server.put(
    "/api/company/:companyId",
    authenticate,
    companyLogic.updateCompany
  );
  server.del(
    "/api/company/:companyId",
    authenticate,
    companyLogic.deleteCompany
  );
  //== End of Company Route

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
  // Made By: Dian Yuanda
  server.get("/api/souvenir", authenticate, souvenirLogic.readAllSouvenir);
  server.get(
    "/api/souvenir/:souvenirId",
    authenticate,
    souvenirLogic.readSouvenirById
  );
  server.post("/api/souvenir", authenticate, souvenirLogic.createSouvenir);
  server.put(
    "/api/souvenir/:souvenirId",
    authenticate,
    souvenirLogic.updateSouvenir
  );
  server.del("/api/souvenir/:code", authenticate, souvenirLogic.deleteSouvenir);
  //== End of Master Souvenir Route

  // Master Unit Route
  server.get("/api/unit", authenticate, unitLogic.readAllUnit);
  server.get("/api/unit/:unitId", authenticate, unitLogic.readOneById);
  server.post("/api/unit", authenticate, unitLogic.createUnit);
  server.put("/api/unit/:unitId", authenticate, unitLogic.updateUnit);
  server.del("/api/unit/:unitId", authenticate, unitLogic.deleteUnit);
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
  server.get(
    "/api/design/item/:code",
    authenticate,
    tDesignItemLogic.readAllItemHandler
  );
  server.post(
    "/api/design/item",
    authenticate,
    tDesignItemLogic.createItemHandler
  );
  server.put(
    "/api/design/item",
    authenticate,
    tDesignItemLogic.updateItemHandler
  );
  server.del(
    "/api/design/item/:itemId",
    authenticate,
    tDesignItemLogic.deleteItemHandler
  );
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
  server.get("/api/employee", employeeLogic.readAllHandler);
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
  server.get("/api/event", event.readAllHandler);
  server.get("/api/event/:eventId", event.readByIdHandler);
  server.get(
    // code, request_by, request_date, , status, created_date, created_by)
    "/api/event/:code/:request_by/:request_date/:status/:created_date/:created_by",
    event.searchHandler
  );
  server.post("/api/event", event.createHandler);
  server.put("/api/event/:eventId", event.updateHandler);
  server.del("/api/event/:eventId", event.deleteHandler);
  //== End of T Event Route

  // Master User Route - Login Process
  // Made By: Dian Yuanda
  server.post("/api/user/login", userLogic.loginUserHandler);
  //== End of T Event Route

  // Transaction Souvenir Route
  // Made By: Deovani Anugrah
  server.get("/api/tsouvenir", authenticate, tSouvenirLogic.readAllHandler);
  server.get(
    "/api/tsouvenir/:souvenirId",
    authenticate,
    tSouvenirLogic.readByIdHandler
  );
  server.post("/api/tsouvenir", authenticate, tSouvenirLogic.createHandlerItem);
  server.put(
    "/api/tsouvenir/:souvenirId",
    authenticate,
    tSouvenirLogic.updateHandler
  );
  //== End of Transaction Souvenir Route

  // Transaction Souvenir Item Route
  // Made By: Deovani Anugrah
  server.get(
    "/api/tsouveniritem",
    authenticate,
    tSouvenirItemLogic.readSouvenirAllHandler
  );
  server.get(
    "/api/tsouveniritemdetil",
    authenticate,
    tSouvenirItemLogic.readSouvenirItemAllHandler
  );
  server.get(
    "/api/tsouveniritem/:souvenirId",
    authenticate,
    tSouvenirItemLogic.readByIdHandler
  );
  server.post(
    "/api/tsouveniritem",
    authenticate,
    tSouvenirItemLogic.createHandlerItem
  );
  server.put(
    "/api/tsouveniritem/:souvenirId",
    authenticate,
    tSouvenirItemLogic.updateHandler
  );
  server.put(
    "/api/tsouveniritem/adminrequestapprove/:souvenirId",
    authenticate,
    tSouvenirItemLogic.approveHandler
  );
  server.put(
    "/api/tsouveniritem/adminrequestreject/:souvenirId",
    authenticate,
    tSouvenirItemLogic.rejectHandler
  );

  server.put(
    "/api/tsouveniritem/receivedsouvenir/:souvenirId",
    authenticate,
    tSouvenirItemLogic.receivedHandler
  );
  server.put(
    "/api/tsouveniritemsettlement/:souvenirId",
    authenticate,
    tSouvenirItemLogic.settlementHandler
  );
  server.put(
    "/api/tsouveniritem/adminapprovesettlement/:souvenirId",
    authenticate,
    tSouvenirItemLogic.approveSettlementHandler
  );
  server.put(
    "/api/tsouveniritem/colseorder/:souvenirId",
    authenticate,
    tSouvenirItemLogic.closeOrderHandler
  );
};
