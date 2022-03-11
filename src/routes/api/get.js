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
    if (expand > 0) {
      var fragment = await Fragment.byUser(req.user, true);

      res.status(200).json(
        createSuccessResponse({
          fragment,
        })
      );
    } else {
      var fragments = await Fragment.byUser(req.user);

      res.status(200).json(
        createSuccessResponse({
          fragments,
        })
      );
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, err));
  }
};
