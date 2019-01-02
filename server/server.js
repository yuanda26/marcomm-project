const restify = require("restify");
const morgan = require("morgan");
const corsMidlleware = require("restify-cors-middleware");
const databaseConnection = require("./models/Database");
const multer = require("multer");

// Connect to Database
databaseConnection.connect((err, db) => {
  if (err != null) {
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

    // Multer Upload Config
    // Set Storage Engine
    const storage = multer.diskStorage({
      destination: "./public/uploads/",
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.toLowerCase());
      }
    });

    // Initialize Upload Method
    const uploads = multer({
      storage: storage,
      limits: {
        fileSize: 1000000
      },
      fileFilter: (req, file, callback) => {
        checkFileType(file, callback);
      }
    }).array("uploads");

    // Check File Type Function
    checkFileType = (file, callback) => {
      // Allowed Extentions
      const filetypes = /jpeg|jpg|png|gif/;
      // Check Extentions
      const extname = filetypes.test(
        path.extname(file.originalname).toLocaleLowerCase()
      );
      // Check MIME Types
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype && extname) {
        return callback(null, true);
      } else {
        callback("Error: Images Only!");
      }
    };

    // Route
    require("./routes/Routes")(server);

    // Close Design Request - Upload Files
    server.post("/api/design/upload_files", (req, res, next) => {
      uploads(req, res, err => {
        if (err) {
          console.log(err);
        } else {
          res.send(req.files);
        }
      });
    });

    // Server Static Assets if in Production
    if (process.env.NODE_ENV === "production") {
      // Set static folder
      server.get(
        "*",
        restify.plugins.serveStatic({
          directory: "../frontend/public/build",
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
