if (process.env.NODE_ENV === "production") {
  module.exports = require("./Db_Config_Prod.json").local;
} else {
  module.exports = require("./Db_Config_Dev.json").local;
}
