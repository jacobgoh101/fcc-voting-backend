import axios from "axios";
const pino = require("pino")();

/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
export function toRes(res, status = 200) {
  return (err, thing) => {
    if (err) return res.status(500).send(err);

    if (thing && typeof thing.toObject === "function") {
      thing = thing.toObject();
    }
    res.status(status).json(thing);
  };
}

/* Social Token Validator */
const providers = {
  facebook: {
    url: "https://graph.facebook.com/me"
  },
  google: {
    url: "https://www.googleapis.com/oauth2/v3/tokeninfo"
  }
};
export const validateWithProvider = (network, socialToken) => {
  return new Promise(function(resolve, reject) {
    // Send a GET request to Facebook with the token as query string
    axios({
      method: "get",
      url: providers[network].url,
      params: { access_token: socialToken }
    })
      .then(res => {
        pino.info(res);
        if (res.status == 200) {
          resolve(res.data);
        }
      })
      .catch(err => {
        if (err) {
          reject(err);
        }
      });
  });
};
