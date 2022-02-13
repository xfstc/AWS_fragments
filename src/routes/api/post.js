const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
//const { crypto } = require('crypto');

module.exports = (req, res) => {
  if (Buffer.isBuffer(req.body) === false) {
    res.status(415).json(createErrorResponse(415, 'Type not supported'));
  }

  const { headers } = req;
  const type = headers['content-type'];
  const ownerId = req.user;
  const fragment = new Fragment({ ownerId, type });
  fragment.save();
  fragment.setData(req.body);

  res.location(`${process.env.API_URL}/v1/fragments/${fragment.id}`);

  res.status(201).json(createSuccessResponse({ fragment }));
};
