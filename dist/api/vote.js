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
var pollOptionExistMiddleware = require('../middleware/pollOptionExistMiddleware');
var Promise = require("bluebird");
var mongodb = Promise.promisifyAll(require('mongodb'));
var pino = require("pino")();
var BaseJoi = require('joi');
var Extension = require('joi-date-extensions');
var Joi = Promise.promisifyAll(BaseJoi.extend(Extension));
var voteSchema = require('../models/vote');

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  var voteCollection = db.collection("vote");

  api.get("/:id", function (req, res) {
    var id = req.params.id;
    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      var vote;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return voteCollection.findOneAsync({
                _id: new mongodb.ObjectID(id)
              });

            case 3:
              vote = _context.sent;

              res.rest.success(vote);
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

  api.post("/", [authMiddleware, pollExistMiddleware, pollOptionExistMiddleware], function (req, res) {
    var data = req.body;
    if (!data.created_date) data.created_date = new Date();
    if (!data.created_by) data.created_by = req.userId;

    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
      var vote;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return voteCollection.findOneAsync({ created_by: data.created_by, poll_id: data.poll_id });

            case 3:
              vote = _context2.sent;

              if (!vote) {
                _context2.next = 6;
                break;
              }

              throw "This user has already vote for this poll";

            case 6:
              _context2.next = 8;
              return Joi.validateAsync(data, voteSchema);

            case 8:
              _context2.next = 10;
              return voteCollection.insertOneAsync(data);

            case 10:
              res.rest.success(data);
              _context2.next = 17;
              break;

            case 13:
              _context2.prev = 13;
              _context2.t0 = _context2['catch'](0);

              if (_context2.t0.message) _context2.t0 = _context2.t0.message;
              res.rest.forbidden(_context2.t0);

            case 17:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined, [[0, 13]]);
    }))();
  });

  api.put("/", [authMiddleware, pollExistMiddleware, pollOptionExistMiddleware], function (req, res) {
    var data = req.body;
    if (!data.created_by) data.created_by = req.userId;

    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
      var vote;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return voteCollection.findOneAsync({ created_by: data.created_by, poll_id: data.poll_id });

            case 3:
              vote = _context3.sent;

              if (vote) {
                _context3.next = 6;
                break;
              }

              throw "This user hasn't vote for this poll yet";

            case 6:
              data.created_date = vote.created_date;
              _context3.next = 9;
              return Joi.validateAsync(data, voteSchema);

            case 9:
              _context3.next = 11;
              return voteCollection.updateOneAsync({
                created_by: data.created_by,
                poll_id: data.poll_id
              }, data);

            case 11:
              res.rest.success(data);
              _context3.next = 18;
              break;

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3['catch'](0);

              if (_context3.t0.message) _context3.t0 = _context3.t0.message;
              res.rest.forbidden(_context3.t0);

            case 18:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined, [[0, 14]]);
    }))();
  });

  return api;
};
//# sourceMappingURL=vote.js.map