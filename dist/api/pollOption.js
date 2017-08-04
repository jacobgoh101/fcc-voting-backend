'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authMiddleware = require('../middleware/authMiddleware');
var pollExistMiddleware = require('../middleware/pollExistMiddleware');
var Promise = require("bluebird");
var mongodb = Promise.promisifyAll(require('mongodb'));
var pino = require("pino")();
var BaseJoi = require('joi');
var Extension = require('joi-date-extensions');
var Joi = Promise.promisifyAll(BaseJoi.extend(Extension));
var pollOptionSchema = require('../models/pollOption');

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  var pollOptionCollection = db.collection("pollOption");

  api.get("/:id", function (req, res) {
    var id = req.params.id;
    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      var option;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return pollOptionCollection.findOneAsync({
                _id: new mongodb.ObjectID(id)
              });

            case 3:
              option = _context.sent;

              res.rest.success(option);
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
  });

  api.post("/", [authMiddleware, pollExistMiddleware], function (req, res) {
    var data = req.body;
    if (!data.created_by) data.created_by = req.userId;

    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return Joi.validateAsync(data, pollOptionSchema);

            case 3:
              _context2.next = 5;
              return pollOptionCollection.insertOneAsync(data);

            case 5:
              res.rest.success(data);
              _context2.next = 12;
              break;

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2['catch'](0);

              if (_context2.t0.message) _context2.t0 = _context2.t0.message;
              res.rest.forbidden(_context2.t0);

            case 12:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined, [[0, 8]]);
    }))();
  });

  return api;
};
//# sourceMappingURL=pollOption.js.map