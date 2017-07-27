const pino = require("pino")();
import { verifyJwt } from "../lib/util";
export default (req, res, next) => {
  let jwt = req.get("Authorization");
  jwt = jwt.replace("JWT", "");
  jwt = jwt.trim();
  verifyJwt(jwt)
    .then(decoded => {
      req.userEmail = decoded.email;
      next();
    })
    .catch(err => {
      next(err);
    });
};
