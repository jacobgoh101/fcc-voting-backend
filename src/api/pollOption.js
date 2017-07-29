import {Router} from "express";
const authMiddleware = require('../middleware/authMiddleware');
const Promise = require("bluebird");
const mongodb = Promise.promisifyAll(require('mongodb'));
const pino = require("pino")();
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = Promise.promisifyAll(BaseJoi.extend(Extension));
const pollOptionSchema = require('../models/pollOption');

export default({config, db}) => {
  let api = Router();
  const pollOptionCollection = db.collection("pollOption");

  api.get("/", (req, res) => {
    pollOptionCollection
      .find({})
      .toArrayAsync()
      .then(result => {
        res
          .rest
          .success(result);
      })
      .catch(err => res.rest.unauthorized(err));
  });

  api.get("/:id", (req, res) => {
    const id = req.params.id;
    pollOptionCollection
      .findOneAsync({
      _id: new mongodb.ObjectID(id)
    })
      .then(result => {
        res
          .rest
          .success(result);
      })
      .catch(err => res.rest.unauthorized(err));
  });

  api.post("/", authMiddleware, (req, res) => {
    const data = req.body;
    if (!data.created_by) 
      data.created_by = req.userId;
    Joi
      .validateAsync(data, pollOptionSchema)
      .then(value => {
        return pollOptionCollection.insertOneAsync(data)
      })
      .then(result => {
        res
          .rest
          .success(data);
      })
      .catch(err => res.rest.unauthorized(err));
  });

  return api;
};