const Promise = require("bluebird");
const mongodb = Promise.promisifyAll(require("mongodb"));
const pino = require("pino")();

export default callback => {
  // connect to a database if needed, then pass it to `callback`:

  var MongoClient = mongodb.MongoClient;

  var url = process.env.DB_CONN_URL;

  MongoClient.connect(url, function(err, db) {
    if (err) {
      pino.error("Unable to connect to the mongoDB server. Error:", err);
    } else {
      pino.info("Connection established to", url);

      callback(db);

      // db.close();
    }
  });
};
