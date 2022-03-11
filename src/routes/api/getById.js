// src/routes/api/get.js
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
var md = require('markdown-it')();

/**
 * Get a fragment by id
 */
module.exports = async (req, res) => {
  try {
    var id = req.params._id;
    var index = id.indexOf('.');
    var ext = '';

    if (index > 0) {
      ext = id.substr(index + 1, id.length);
      id = id.substr(0, index);
    }

    var fragment = await Fragment.byId(req.user, id);
    var fragmentData = await fragment.getData();

    if (ext == 'txt') {
      fragmentData = fragmentData.toString();
    }
    if (ext == 'md') {
      fragmentData = md.render(fragmentData.toString());
    }

    res.status(200).setHeader('content-type', fragment.type).send(Buffer.from(fragmentData));
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
