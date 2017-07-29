import {Router} from "express";
const authMiddleware = require('../middleware/authMiddleware');
const pollExistMiddleware = require('../middleware/pollExistMiddleware');
const pollOptionExistMiddleware = require('../middleware/pollOptionExistMiddleware');
const Promise = require("bluebird");
const mongodb = Promise.promisifyAll(require('mongodb'));
const pino = require("pino")();
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = Promise.promisifyAll(BaseJoi.extend(Extension));
const voteSchema = require('../models/vote');

export default({config, db}) => {
  let api = Router();
  const voteCollection = db.collection("vote");

  api.get("/", (req, res) => {
    voteCollection
      .find({})
      .toArrayAsync()
      .then(result => {
        res
          .rest
          .success(result);
      })
      .catch(err => res.rest.forbidden(err));
  });

  api.get("/:id", (req, res) => {
    const id = req.params.id;
    voteCollection
      .findOneAsync({
      _id: new mongodb.ObjectID(id)
    })
      .then(result => {
        res
          .rest
          .success(result);
      })
      .catch(err => res.rest.forbidden(err));
  });

  api.post("/", [
    authMiddleware, pollExistMiddleware, pollOptionExistMiddleware
  ], (req, res) => {
    const data = req.body;
    if (!data.created_date) 
      data.created_date = new Date();
    if (!data.created_by) 
      data.created_by = req.userId;
    
    // check if this user already vote for this poll
    voteCollection
      .findOneAsync({created_by: data.created_by, poll_id: data.poll_id})
      .then(vote => {
        if (vote) 
          throw "This user has already vote for this poll";
        else {
          return Joi.validateAsync(data, voteSchema);
        }
      })
      .then(value => {
        return voteCollection.insertOneAsync(data)
      })
      .then(result => {
        res
          .rest
          .success(data);
      })
      .catch(err => res.rest.forbidden(err));
  });

  api.put("/", [
    authMiddleware, pollExistMiddleware, pollOptionExistMiddleware
  ], (req, res) => {
    const data = req.body;
    if (!data.created_by) 
      data.created_by = req.userId;
    
    // check if this user already vote for this poll
    voteCollection
      .findOneAsync({created_by: data.created_by, poll_id: data.poll_id})
      .then(vote => {
        if (vote) {
          data.created_date = vote.created_date;
          return Joi.validateAsync(data, voteSchema);
        } else {
          throw "This user hasn't vote for this poll yet";
        }
      })
      .then(value => {
        // return voteCollection.insertOneAsync(data);
        return voteCollection.updateOneAsync({
          created_by: data.created_by,
          poll_id: data.poll_id
        }, data)
      })
      .then(result => {
        res
          .rest
          .success(data);
      })
      .catch(err => res.rest.forbidden(err));
  });

  return api;
};