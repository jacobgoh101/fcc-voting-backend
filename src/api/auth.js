import { Router } from "express";
import { validateWithProvider, createJwt, verifyJwt } from "../lib/util";
const pino = require("pino")();
const assert = require("assert");

export default ({ config, db }) => {
  let api = Router();

  api.post("/", (req, res) => {
    // Grab the social network and token
    const network = req.body.network;
    const socialToken = req.body.socialToken;

    const userCollection = db.collection("user");

    let email = "";

    // Validate the social token with Facebook
    validateWithProvider(network, socialToken)
      .then(function(profile) {
        email = profile.email;
        return userCollection
          .find({
            email: email
          })
          .toArrayAsync();
      })
      .then(result => {
        console.log(result);
        if (result.length === 0) {
          return userCollection.insertOne({ email });
        }
        return;
      })
      .then(() => {
        res.rest.success({
          message: "Authenticated as: " + email,
          token: createJwt({ email })
        });
      })
      .catch(function(err) {
        res.rest.unauthorized("Failed!" + err.message);
      });
  });

  return api;
};
