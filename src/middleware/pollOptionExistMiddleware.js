const mongodb = require('mongodb');
module.exports = (req, res, next) => {
  const poll_option_id = req.body.poll_option_id;
  if (!poll_option_id) 
    next();
  const db = req
    .app
    .get('db');
  const pollOptionCollection = db.collection('pollOption');
  (async() => {
    try {
      let pollOption = await pollOptionCollection.findOneAsync({
        _id: new mongodb.ObjectID(poll_option_id)
      });
      if (!pollOption) 
        res.rest.forbidden('pollOption Id does not exist');
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
