const mongoose = require("mongoose");
const pino = require("pino")();

export default callback => {
  // connect to a database if needed, then pass it to `callback`:

  mongoose.connect("mongodb://localhost:27017/fcc_voting");
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    pino.info("Database connected");
  });

  callback(db);
};
