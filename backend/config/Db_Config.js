if (process.env.NODE_ENV === "production") {
  module.exports = require("../config/Db_Config_Prod.json").local;
} else {
  module.exports = require("../config/Db_Config_Dev.json").local;
}
