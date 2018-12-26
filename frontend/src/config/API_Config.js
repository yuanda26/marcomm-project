if (process.env.NODE_ENV === "production") {
  module.exports = require("./API_Host_Prod.json");
} else {
  module.exports = require("./API_Host_Dev.json");
}
