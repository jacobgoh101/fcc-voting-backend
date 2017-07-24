import { Router } from "express";
import { validateWithProvider } from "../lib/util";
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
        res.rest.success("Authenticated as: " + profile.email);
      })
      .catch(function(err) {
        res.rest.unauthorized("Failed!" + err.message);
      });
  });

  return api;
};
