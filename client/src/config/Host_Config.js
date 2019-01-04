if (process.env.NODE_ENV === "production") {
  module.exports = require("./Host_Prod.json");
} else {
  module.exports = require("./Host_Dev.json");
}
