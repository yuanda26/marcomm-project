const restify = require("restify");
const morgan = require("morgan");
const corsMidlleware = require("restify-cors-middleware");
const databaseConnection = require("./models/Database");
const path = require("path");

// Connect to Database
databaseConnection.connect((err, db) => {
  if (err !== null) {
    process.exit();
  } else {
    // Create Server
    const server = restify.createServer();
    // Body Parser Middleware
    server.use(restify.plugins.queryParser()); // parse query data from url
    server.use(restify.plugins.bodyParser({ mapParams: false })); // parsing data from form input

    // CORS Middleware
    const cors = corsMidlleware({
      origins: ["*"],
      allowHeaders: ["Authorization"]
    });
    server.pre(cors.preflight);
    server.use(cors.actual);

    // Morgan Middleware
    server.use(morgan("dev"));

    // Route
    require("./routes/Routes")(server);

    // Server Static Assets if in Production
    if (process.env.NODE_ENV === "production") {
      // Set static folder
      server.get(
        "*",
        restify.plugins.serveStatic({
          directory: path.resolve(__dirname, "../client/public/build"),
          default: "index.html"
        })
      );
    }

    const port = process.env.PORT || 4000;
    server.listen(port, () => {
      console.log("[DATABASE] Has Been Connected!");
      console.log(`[SERVER] Running on Port ${port}!`);
    });
  }
});
