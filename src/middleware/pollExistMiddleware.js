const mongodb = require('mongodb');
module.exports = (req, res, next) => {
  const poll_id = req.body.poll_id;
  if (!poll_id) 
    next();
  const db = req
    .app
    .get('db');
  const pollCollection = db.collection('poll');
  pollCollection
    .findOneAsync({
    _id: new mongodb.ObjectID(poll_id)
  })
    .then(result => {
      if (!result) 
        res.rest.forbidden('Poll Id does not exist');
      else 
        next()
    })
    .catch(err => res.rest.forbidden(err));
};
