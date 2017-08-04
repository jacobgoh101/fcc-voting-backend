"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require("express");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authMiddleware = require('../middleware/authMiddleware');
var Promise = require("bluebird");
var mongodb = Promise.promisifyAll(require('mongodb'));
var pino = require("pino")();
var BaseJoi = require('joi');
var Extension = require('joi-date-extensions');
var Joi = Promise.promisifyAll(BaseJoi.extend(Extension));
var pollSchema = require('../models/poll');

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  var pollCollection = db.collection("poll");
  var pollOptionCollection = db.collection("pollOption");
  var userCollection = db.collection("user");
  var voteCollection = db.collection("vote");

  api.get("/", function (req, res) {
    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
      var result, promiseArr;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return pollCollection.find({}).toArrayAsync();

            case 3:
              result = _context2.sent;
              promiseArr = result.map(function () {
                var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(poll, index) {
                  var user;
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return userCollection.findOneAsync({
                            _id: new mongodb.ObjectID(poll.created_by)
                          });

                        case 2:
                          user = _context.sent;

                          if (user.email) result[index].created_by_email = user.email;else result[index].created_by_email = "";
                          return _context.abrupt("return", result[index]);

                        case 5:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, undefined);
                }));

                return function (_x, _x2) {
                  return _ref3.apply(this, arguments);
                };
              }());
              _context2.next = 7;
              return Promise.all(promiseArr);

            case 7:
              result = _context2.sent;

              res.rest.success(result);
              _context2.next = 15;
              break;

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](0);

              if (_context2.t0.message) _context2.t0 = _context2.t0.message;
              res.rest.forbidden(_context2.t0);

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, undefined, [[0, 11]]);
    }))();
  });

  api.get("/:id", function (req, res) {
    var id = req.params.id;
    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
      var poll, user, options, votes;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return pollCollection.findOneAsync({
                _id: new mongodb.ObjectID(id)
              });

            case 3:
              poll = _context3.sent;
              _context3.next = 6;
              return userCollection.findOneAsync({
                _id: new mongodb.ObjectID(poll.created_by)
              });

            case 6:
              user = _context3.sent;

              poll.created_by_email = user.email;
              _context3.next = 10;
              return pollOptionCollection.find({
                poll_id: String(poll._id)
              }).toArrayAsync();

            case 10:
              options = _context3.sent;

              poll['options'] = options;
              _context3.next = 14;
              return voteCollection.find({
                poll_id: String(poll._id)
              }).toArrayAsync();

            case 14:
              votes = _context3.sent;

              poll['votes'] = votes;
              res.rest.success(poll);
              _context3.next = 23;
              break;

            case 19:
              _context3.prev = 19;
              _context3.t0 = _context3["catch"](0);

              if (_context3.t0.message) _context3.t0 = _context3.t0.message;
              res.rest.forbidden(_context3.t0);

            case 23:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, undefined, [[0, 19]]);
    }))();
  });

  api.get("/user/:userId", function (req, res) {
    var userId = req.params.userId;
    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
      var polls;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return pollCollection.find({ created_by: userId }).toArrayAsync();

            case 3:
              polls = _context4.sent;

              res.rest.success(polls);
              _context4.next = 11;
              break;

            case 7:
              _context4.prev = 7;
              _context4.t0 = _context4["catch"](0);

              if (_context4.t0.message) _context4.t0 = _context4.t0.message;
              res.rest.forbidden(_context4.t0);

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, undefined, [[0, 7]]);
    }))();
  });

  api.post("/", authMiddleware, function (req, res) {
    var data = req.body;
    if (!data.created_date) data.created_date = new Date();
    if (!data.created_by) data.created_by = req.userId;

    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return Joi.validateAsync(data, pollSchema);

            case 3:
              _context5.next = 5;
              return pollCollection.insertOneAsync(data);

            case 5:
              res.rest.success(data);
              _context5.next = 12;
              break;

            case 8:
              _context5.prev = 8;
              _context5.t0 = _context5["catch"](0);

              if (_context5.t0.message) _context5.t0 = _context5.t0.message;
              res.rest.forbidden(_context5.t0);

            case 12:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, undefined, [[0, 8]]);
    }))();
  });

  api.delete("/:poll_id", authMiddleware, function (req, res) {
    var poll_id = req.params.poll_id;
    var userId = req.userId;

    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
      var poll;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return pollCollection.findOneAsync({
                _id: new mongodb.ObjectID(poll_id),
                created_by: userId
              });

            case 3:
              poll = _context6.sent;

              if (poll) {
                _context6.next = 7;
                break;
              }

              res.rest.forbidden('This is not the creator of this poll.');
              return _context6.abrupt("return");

            case 7:
              _context6.next = 9;
              return pollCollection.deleteOneAsync({
                _id: new mongodb.ObjectID(poll_id)
              });

            case 9:
              _context6.next = 11;
              return pollOptionCollection.deleteManyAsync({ poll_id: poll_id });

            case 11:
              _context6.next = 13;
              return voteCollection.deleteManyAsync({ poll_id: poll_id });

            case 13:
              res.rest.success("Poll " + poll_id + " deleted");
              _context6.next = 20;
              break;

            case 16:
              _context6.prev = 16;
              _context6.t0 = _context6["catch"](0);

              if (_context6.t0.message) _context6.t0 = _context6.t0.message;
              res.rest.forbidden(_context6.t0);

            case 20:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, undefined, [[0, 16]]);
    }))();
  });

  return api;
};
//# sourceMappingURL=poll.js.map