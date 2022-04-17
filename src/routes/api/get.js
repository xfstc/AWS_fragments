// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
//const { crypto } = require('crypto');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  var expand = req.url.search('expand=1');
  try {
    var fragment = await Fragment.byUser(req.user, expand > 0);

    res.status(200).json(
      createSuccessResponse({
        fragment,
      })
    );
  } catch (err) {
    res.status(404).json(createErrorResponse(404, err));
  }
};
