import {Router} from "express";
import {validateWithProvider, createJwt, verifyJwt} from "../lib/util";
const pino = require("pino")();
const Promise = require("bluebird");
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = Promise.promisifyAll(BaseJoi.extend(Extension));

const schema = Joi
  .object()
  .keys({
    email: Joi
      .string()
      .email()
      .required()
  });

export default({config, db}) => {
  let api = Router();

  api.post("/", (req, res) => {
    // Grab the social network and token
    const network = req.body.network;
    const socialToken = req.body.socialToken;

    const userCollection = db.collection("user");

    let email = "";
    let data = {};

    (async() => {
      try {
        // Validate the social token 
        let profile = await validateWithProvider(network, socialToken);
        email = profile.email;
        data.email = email;
        let users = await userCollection
          .find({email: email})
          .toArrayAsync();
        if (users.length === 0) {
          await Joi.validateAsync(data, schema);
          await userCollection.insertOneAsync(data);
        } else {
          data = users[0];
        }
        res
          .rest
          .success({
            message: "Authenticated as: " + email,
            token: createJwt(data),
            data
          });
      } catch (err) {
        if(err.message) err = err.message;
        res
          .rest
          .forbidden(err);
      }
    })();
  });

  return api;
};
