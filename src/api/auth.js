import { Router } from "express";
import { validateWithProvider, createJwt, verifyJwt } from "../lib/util";
const pino = require("pino")();

export default ({ config, db }) => {
  let api = Router();

  api.post("/", (req, res) => {
    // Grab the social network and token
    var network = req.body.network;
    var socialToken = req.body.socialToken;

    // Validate the social token with Facebook
    validateWithProvider(network, socialToken)
      .then(function(profile) {
        res.rest.success({
          message: "Authenticated as: " + profile.email,
          token: createJwt(profile)
        });
      })
      .catch(function(err) {
        res.rest.unauthorized("Failed!" + err.message);
      });
  });

  return api;
};
