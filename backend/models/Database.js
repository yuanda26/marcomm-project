const MongoClient = require("mongodb").MongoClient;
const dbConfig = require("../config/Db_Config");
let connection = null;

const DatabaseConnection = {
  connect: callback => {
    let url = `${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;
    MongoClient.connect(
      url,
      {
        useNewUrlParser: true
      },
      (err, db) => {
        if (!err) {
          connection = db.db(dbConfig.name);
        }
        callback(err, db);
      }
    );
  },
  getConnection: () => {
    return connection;
  }
};

module.exports = DatabaseConnection;
