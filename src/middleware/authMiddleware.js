const pino = require("pino")();
import {verifyJwt} from "../lib/util";
module.exports = (req, res, next) => {
  let jwt = req.get("Authorization");
  if (!jwt) 
    res.rest.unauthorized(("Unauthorized"));
  jwt = jwt.replace("JWT", "");
  jwt = jwt.trim();
  (async() => {
    try {
      const decoded = await verifyJwt(jwt);
      req.userEmail = decoded.email;
      req.userId = decoded._id;
      next();
    } catch (err) {
      next(err);
    }
  })();
};
