import {Router} from "express";
import {validateWithProvider, createJwt, verifyJwt} from "../lib/util";
const pino = require("pino")();

export default({config, db}) => {
  let api = Router();

  api.post("/", (req, res) => {
    // Grab the social network and token
    const network = req.body.network;
    const socialToken = req.body.socialToken;

    const userCollection = db.collection("user");

    let email = "";
    let data = {};

    // Validate the social token with Facebook
    validateWithProvider(network, socialToken).then(function (profile) {
      email = profile.email;
      data.email = email;
      return userCollection
        .find({email: email})
        .toArrayAsync();
    }).then(result => {
      if (result.length === 0) {
        return userCollection.insertOneAsync(data);
      }else{
        data = result;
      }
      return;
    }).then(result => {
      res
        .rest
        .success({
          message: "Authenticated as: " + email,
          token: createJwt(data),
          data
        });
    })
      .catch(function (err) {
        res
          .rest
          .unauthorized("Failed!" + err.message);
      });
  });

  return api;
};
