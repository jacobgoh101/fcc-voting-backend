import {Router} from "express";
const authMiddleware = require('../middleware/authMiddleware');
const pollExistMiddleware = require('../middleware/pollExistMiddleware');
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

  api.get("/:id", (req, res) => {
    const id = req.params.id;
    (async() => {
      try {
        let option = await pollOptionCollection.findOneAsync({
          _id: new mongodb.ObjectID(id)
        });
        res
          .rest
          .success(option);
      } catch (err) {
        if(err.message) err = err.message;
        res
          .rest
          .forbidden(err);
      }
    })();
  });

  api.post("/", [
    authMiddleware, pollExistMiddleware
  ], (req, res) => {
    const data = req.body;
    if (!data.created_by) 
      data.created_by = req.userId;
    
    (async() => {
      try {
        await Joi.validateAsync(data, pollOptionSchema)
        await pollOptionCollection.insertOneAsync(data)
        res
          .rest
          .success(data);
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