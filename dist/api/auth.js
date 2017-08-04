"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require("express");

var _util = require("../lib/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pino = require("pino")();
var Promise = require("bluebird");
var BaseJoi = require('joi');
var Extension = require('joi-date-extensions');
var Joi = Promise.promisifyAll(BaseJoi.extend(Extension));

var schema = Joi.object().keys({
  email: Joi.string().email().required()
});

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  api.post("/", function (req, res) {
    // Grab the social network and token
    var network = req.body.network;
    var socialToken = req.body.socialToken;

    var userCollection = db.collection("user");

    var email = "";
    var data = {};

    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      var profile, users;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return (0, _util.validateWithProvider)(network, socialToken);

            case 3:
              profile = _context.sent;

              email = profile.email;
              data.email = email;
              _context.next = 8;
              return userCollection.find({ email: email }).toArrayAsync();

            case 8:
              users = _context.sent;

              if (!(users.length === 0)) {
                _context.next = 16;
                break;
              }

              _context.next = 12;
              return Joi.validateAsync(data, schema);

            case 12:
              _context.next = 14;
              return userCollection.insertOneAsync(data);

            case 14:
              _context.next = 17;
              break;

            case 16:
              data = users[0];

            case 17:
              res.rest.success({
                message: "Authenticated as: " + email,
                token: (0, _util.createJwt)(data),
                data: data
              });
              _context.next = 24;
              break;

            case 20:
              _context.prev = 20;
              _context.t0 = _context["catch"](0);

              if (_context.t0.message) _context.t0 = _context.t0.message;
              res.rest.forbidden(_context.t0);

            case 24:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 20]]);
    }))();
  });

  return api;
};
//# sourceMappingURL=auth.js.map