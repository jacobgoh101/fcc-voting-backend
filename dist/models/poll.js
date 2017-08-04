'use strict';

var Promise = require("bluebird");
var BaseJoi = require('joi');
var Extension = require('joi-date-extensions');
var Joi = Promise.promisifyAll(BaseJoi.extend(Extension));

var schema = Joi.object().keys({
    name: Joi.string().required(),
    created_by: Joi.string().required(),
    created_date: Joi.date().required()
});

module.exports = schema;
//# sourceMappingURL=poll.js.map