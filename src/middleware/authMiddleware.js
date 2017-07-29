const pino = require("pino")();
import {verifyJwt} from "../lib/util";
module.exports = (req, res, next) => {
  let jwt = req.get("Authorization");
  if (!jwt) 
    res.rest.unauthorized(("Unauthorized"));
  jwt = jwt.replace("JWT", "");
  jwt = jwt.trim();
  verifyJwt(jwt).then(decoded => {
    req.userEmail = decoded['0'].email;
    req.userId = decoded['0']._id;
    next();
  }).catch(err => {
    next(err);
  });
};
