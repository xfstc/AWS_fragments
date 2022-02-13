// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a fragment by id
 */
module.exports = async (req, res) => {
  try {
    const id = req.params._id;
    var fragment = await Fragment.byId(req.user, id);
    var fragmentData = await fragment.getData();
    res.status(200).json(
      createSuccessResponse({
        fragmentData,
      })
    );
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
