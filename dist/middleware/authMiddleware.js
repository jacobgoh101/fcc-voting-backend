"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _util = require("../lib/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pino = require("pino")();

module.exports = function (req, res, next) {
  var jwt = req.get("Authorization");
  if (!jwt) res.rest.unauthorized("Unauthorized");
  jwt = jwt.replace("JWT", "");
  jwt = jwt.trim();
  (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var decoded;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _util.verifyJwt)(jwt);

          case 3:
            decoded = _context.sent;

            req.userEmail = decoded.email;
            req.userId = decoded._id;
            next();
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);

            next(_context.t0);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 9]]);
  }))();
};
//# sourceMappingURL=authMiddleware.js.map