const restify = require("restify");
const morgan = require("morgan");
const corsMidlleware = require("restify-cors-middleware");
const databaseConnection = require("./models/Database");
const path = require("path");
const multer = require("multer");

// Connect to Database
databaseConnection.connect((err, db) => {
  if (err !== null) {
    process.exit();
  } else {
    // Create Server
    const server = restify.createServer();
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
    require("./routes/Routes")(server, restify);

    // Set Multer
    // Set Storage Engine
    const storage = multer.diskStorage({
      destination: path.resolve(__dirname, "./public/uploads/"),
      filename: (req, file, cb) => {
        cb(null, file.originalname.toLowerCase());
      }
    });

    // Initialize Uploads Instance
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

    // Close Design Request - Upload Files
    server.post("/api/design/uploads", (req, res, next) => {
      uploads(req, res, err => {
        if (err) {
          if (err) throw new Error();
        } else {
          res.send({
            data: {
              code: 200,
              message:
                "Upload Succeed! Transaction Design Request Has Been Closed."
            }
          });
        }
      });
    });

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
      console.log(`[SERVER] Running on Port http://localhost:${port}/`);
    });
  }
});
