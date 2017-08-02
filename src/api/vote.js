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

  api.get("/:id", (req, res) => {
    const id = req.params.id;
    (async() => {
      try {
        let vote = await voteCollection.findOneAsync({
          _id: new mongodb.ObjectID(id)
        });
        res
          .rest
          .success(vote);
      } catch (err) {
        if(err.message) err = err.message;
        res
          .rest
          .forbidden(err);
      }
    })();
  });

  api.post("/", [
    authMiddleware, pollExistMiddleware, pollOptionExistMiddleware
  ], (req, res) => {
    const data = req.body;
    if (!data.created_date) 
      data.created_date = new Date();
    if (!data.created_by) 
      data.created_by = req.userId;
    
    (async() => {
      try {
        // check if this user already vote for this poll
        let vote = await voteCollection.findOneAsync({created_by: data.created_by, poll_id: data.poll_id});
        if (vote) 
          throw "This user has already vote for this poll";
        
        await Joi.validateAsync(data, voteSchema);
        await voteCollection.insertOneAsync(data);
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

  api.put("/", [
    authMiddleware, pollExistMiddleware, pollOptionExistMiddleware
  ], (req, res) => {
    const data = req.body;
    if (!data.created_by) 
      data.created_by = req.userId;
    
    (async() => {
      try {
        // check if this user already vote for this poll
        let vote = voteCollection.findOneAsync({created_by: data.created_by, poll_id: data.poll_id});
        if (!vote) {
          throw "This user hasn't vote for this poll yet";
        }
        data.created_date = vote.created_date;
        await Joi.validateAsync(data, voteSchema);
        await voteCollection.updateOneAsync({
          created_by: data.created_by,
          poll_id: data.poll_id
        }, data);
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