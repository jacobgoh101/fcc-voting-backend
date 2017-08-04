"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _package = require("../../package.json");

var _express = require("express");

var _facets = require("./facets");

var _facets2 = _interopRequireDefault(_facets);

var _auth = require("./auth");

var _auth2 = _interopRequireDefault(_auth);

var _poll = require("./poll");

var _poll2 = _interopRequireDefault(_poll);

var _pollOption = require("./pollOption");

var _pollOption2 = _interopRequireDefault(_pollOption);

var _vote = require("./vote");

var _vote2 = _interopRequireDefault(_vote);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // mount the facets resource
  api.use("/facets", (0, _facets2.default)({ config: config, db: db }));

  api.use("/auth", (0, _auth2.default)({ config: config, db: db }));

  api.use("/poll", (0, _poll2.default)({ config: config, db: db }));

  api.use("/pollOption", (0, _pollOption2.default)({ config: config, db: db }));

  api.use("/vote", (0, _vote2.default)({ config: config, db: db }));

  // perhaps expose some API metadata at the root
  api.get("/", function (req, res) {
    res.json({ version: _package.version });
  });

  return api;
};
//# sourceMappingURL=index.js.map