'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongodb = require('mongodb');
module.exports = function (req, res, next) {
  var poll_option_id = req.body.poll_option_id;
  if (!poll_option_id) next();
  var db = req.app.get('db');
  var pollOptionCollection = db.collection('pollOption');
  (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var pollOption;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return pollOptionCollection.findOneAsync({
              _id: new mongodb.ObjectID(poll_option_id)
            });

          case 3:
            pollOption = _context.sent;

            if (!pollOption) res.rest.forbidden('pollOption Id does not exist');else next();
            _context.next = 11;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](0);

            if (_context.t0.message) _context.t0 = _context.t0.message;
            res.rest.forbidden(_context.t0);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 7]]);
  }))();
};
//# sourceMappingURL=pollOptionExistMiddleware.js.map