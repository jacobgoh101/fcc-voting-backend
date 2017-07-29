const mongodb = require('mongodb');
module.exports = (req, res, next) => {
  const poll_option_id = req.body.poll_option_id;
  if (!poll_option_id) 
    next();
  const db = req
    .app
    .get('db');
  const pollOptionCollection = db.collection('pollOption');
  pollOptionCollection
    .findOneAsync({
    _id: new mongodb.ObjectID(poll_option_id)
  })
    .then(result => {
      if (!result) 
        res.rest.forbidden('pollOption Id does not exist');
      else 
        next()
    })
    .catch(err => res.rest.forbidden(err));
};
