"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyJwt = exports.createJwt = exports.validateWithProvider = undefined;

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.toRes = toRes;

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pino = require("pino")();


/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
function toRes(res) {
  var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;

  return function (err, thing) {
    if (err) return res.status(500).send(err);

    if (thing && typeof thing.toObject === "function") {
      thing = thing.toObject();
    }
    res.status(status).json(thing);
  };
}

/* Social Token Validator */
var providers = {
  facebook: {
    url: "https://graph.facebook.com/me"
  },
  google: {
    url: "https://www.googleapis.com/oauth2/v3/tokeninfo"
  }
};
var validateWithProvider = exports.validateWithProvider = function validateWithProvider(network, socialToken) {
  return new _bluebird2.default(function (resolve, reject) {
    // Send a GET request to provider with the token as query string
    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      var res;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return (0, _axios2.default)({
                method: "get",
                url: providers[network].url,
                params: {
                  access_token: socialToken
                }
              });

            case 3:
              res = _context.sent;

              if (res.status == 200) {
                resolve(res.data);
              } else {
                reject('Fail to authenticate with provider.');
              }
              _context.next = 10;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);

              reject(_context.t0);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 7]]);
    }))();
  });
};

var createJwt = exports.createJwt = function createJwt(profile) {
  var payload = (0, _extends3.default)({}, profile);
  return _jsonwebtoken2.default.sign(payload, process.env.JWT_PRIVATE_KEY, {
    // expiresIn: '2h',
    issuer: process.env.JWT_ISSUER
  });
};

var verifyJwt = exports.verifyJwt = function verifyJwt(jwtString) {
  return new _bluebird2.default(function (resolve, reject) {
    _jsonwebtoken2.default.verify(jwtString, process.env.JWT_PRIVATE_KEY, {
      issuer: process.env.JWT_ISSUER
    }, function (err, decoded) {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
};
//# sourceMappingURL=util.js.map