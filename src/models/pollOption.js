const Promise = require("bluebird");
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = Promise.promisifyAll(BaseJoi.extend(Extension));

const schema = Joi
    .object()
    .keys({
        name: Joi
            .string()
            .required(),
        created_by: Joi
            .string()
            .required(),
        poll_id: Joi
            .string()
            .required()
    });

module.exports = schema;