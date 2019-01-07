if (process.env.NODE_ENV === "production") {
  module.exports = require("./Host_Prod.json").host;
} else {
  module.exports = require("./Host_Dev.json").host;
}
