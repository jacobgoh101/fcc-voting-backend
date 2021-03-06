'use strict';

var Promise = require("bluebird");
var BaseJoi = require('joi');
var Extension = require('joi-date-extensions');
var Joi = Promise.promisifyAll(BaseJoi.extend(Extension));

var schema = Joi.object().keys({
    created_by: Joi.string().required(),
    poll_id: Joi.string().required(),
    poll_option_id: Joi.string().required(),
    created_date: Joi.date().required()
});

module.exports = schema;
//# sourceMappingURL=vote.js.map