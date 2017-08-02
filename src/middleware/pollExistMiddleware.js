const mongodb = require('mongodb');
module.exports = (req, res, next) => {
  const poll_id = req.body.poll_id;
  if (!poll_id) 
    next();
  const db = req
    .app
    .get('db');
  const pollCollection = db.collection('poll');
  (async() => {
    try {
      let poll = await pollCollection.findOneAsync({
        _id: new mongodb.ObjectID(poll_id)
      })
      if (!poll) 
        res.rest.forbidden('Poll Id does not exist');
      else 
        next()
    } catch (err) {
      if (err.message) 
        err = err.message;
      res
        .rest
        .forbidden(err)
    }
  })();
};
