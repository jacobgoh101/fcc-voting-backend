import {Router} from "express";
const authMiddleware = require('../middleware/authMiddleware');
const Promise = require("bluebird");
const mongodb = Promise.promisifyAll(require('mongodb'));
const pino = require("pino")();
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = Promise.promisifyAll(BaseJoi.extend(Extension));
const pollSchema = require('../models/poll');

export default({config, db}) => {
  let api = Router();
  const pollCollection = db.collection("poll");
  const pollOptionCollection = db.collection("pollOption");
  const userCollection = db.collection("user");
  const voteCollection = db.collection("vote");

  api.get("/", (req, res) => {
    (async() => {
      try {
        let result = await pollCollection
          .find({})
          .toArrayAsync();

        let promiseArr = result.map(async(poll, index) => {
          let user = await userCollection.findOneAsync({
            _id: new mongodb.ObjectID(poll.created_by)
          });
          if (user.email) 
            result[index].created_by_email = user.email;
          else 
            result[index].created_by_email = "";
          return result[index];
        });

        result = await Promise.all(promiseArr);
        res
          .rest
          .success(result);
      } catch (err) {
        if (err.message) 
          err = err.message;
        res
          .rest
          .forbidden(err);
      }
    })();
  });

  api.get("/:id", (req, res) => {
    const id = req.params.id;
    (async() => {
      try {
        let poll = await pollCollection.findOneAsync({
          _id: new mongodb.ObjectID(id)
        });
        let user = await userCollection.findOneAsync({
          _id: new mongodb.ObjectID(poll.created_by)
        });
        poll.created_by_email = user.email;
        let options = await pollOptionCollection
          .find({
          poll_id: String(poll._id)
        })
          .toArrayAsync();
        poll['options'] = options;
        let votes = await voteCollection
          .find({
          poll_id: String(poll._id)
        })
          .toArrayAsync();
        poll['votes'] = votes;
        res
          .rest
          .success(poll);
      } catch (err) {
        if (err.message) 
          err = err.message;
        res
          .rest
          .forbidden(err);
      }
    })();
  });

  api.get("/user/:userId", (req, res) => {
    const userId = req.params.userId;
    (async() => {
      try {
        let polls = await pollCollection
          .find({created_by: userId})
          .toArrayAsync();
        res
          .rest
          .success(polls);
      } catch (err) {
        if (err.message) 
          err = err.message;
        res
          .rest
          .forbidden(err);
      }
    })();
  });

  api.post("/", authMiddleware, (req, res) => {
    const data = req.body;
    if (!data.created_date) 
      data.created_date = new Date();
    if (!data.created_by) 
      data.created_by = req.userId;
    
    (async() => {
      try {
        await Joi.validateAsync(data, pollSchema);
        await pollCollection.insertOneAsync(data);
        res
          .rest
          .success(data);
      } catch (err) {
        if (err.message) 
          err = err.message;
        res
          .rest
          .forbidden(err);
      }
    })();
  });

  api.delete("/:poll_id", authMiddleware, (req, res) => {
    const poll_id = req.params.poll_id;
    const userId = req.userId;

    (async() => {
      try {
        // check if this user is owner
        let poll = await pollCollection.findOneAsync({
          _id: new mongodb.ObjectID(poll_id),
          created_by: userId
        });
        if (!poll) {
          res
            .rest
            .forbidden('This is not the creator of this poll.');
          return;
        }

        await pollCollection.deleteOneAsync({
          _id: new mongodb.ObjectID(poll_id)
        });
        await pollOptionCollection.deleteManyAsync({poll_id: poll_id});
        await voteCollection.deleteManyAsync({poll_id: poll_id});
        res
          .rest
          .success(`Poll ${poll_id} deleted`);
      } catch (err) {
        if (err.message) 
          err = err.message;
        res
          .rest
          .forbidden(err);
      }
    })();
  });

  return api;
};