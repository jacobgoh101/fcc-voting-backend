'use strict';

var Promise = require("bluebird");
var BaseJoi = require('joi');
var Extension = require('joi-date-extensions');
var Joi = Promise.promisifyAll(BaseJoi.extend(Extension));

var schema = Joi.object().keys({
    name: Joi.string().required(),
    created_by: Joi.string().required(),
    poll_id: Joi.string().required()
});

module.exports = schema;
//# sourceMappingURL=pollOption.js.map