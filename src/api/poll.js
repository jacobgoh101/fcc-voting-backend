import {Router} from "express";
const authMiddleware = require('../middleware/authMiddleware');
const Promise = require("bluebird");
const mongodb = Promise.promisifyAll(require('mongodb'));
const pino = require("pino")();
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = Promise.promisifyAll(BaseJoi.extend(Extension));

const schema = Joi
  .object()
  .keys({
    name: Joi
      .string()
      .required(),
    created_by: Joi
      .string()
      .required(),
    created_date: Joi
      .date()
      .required()
  });

export default({config, db}) => {
  let api = Router();
  const pollCollection = db.collection("poll");

  api.get("/", (req, res) => {
    pollCollection
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
    pollCollection
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
    if (!data.created_date) 
      data.created_date = new Date();
    if (!data.created_by) 
      data.created_by = req.userId;
    Joi
      .validateAsync(data, schema)
      .then(value => {
        return pollCollection.insertOneAsync(data)
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