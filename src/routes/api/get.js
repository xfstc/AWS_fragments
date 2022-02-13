// src/routes/api/get.js
const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
//const { crypto } = require('crypto');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...
  var expand = req.url.search('expand=1');
  if (expand > 0) {
    try {
      var fragment = await Fragment.byUser(req.user, true);

      res.status(200).json(
        createSuccessResponse({
          fragment,
        })
      );
    } catch (err) {
      logger.error(err);
    }
  } else {
    try {
      var fragments = await Fragment.byUser(req.user);

      res.status(200).json(
        createSuccessResponse({
          fragments,
        })
      );
    } catch (err) {
      logger.error(err);
    }
  }
};
