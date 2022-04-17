const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const { headers } = req;
  const type = headers['content-type'];
  var id = req.params._id;

  try {
    var fragment = await Fragment.byId(req.user, id);

    if (fragment.type != type) {
      res.status(400).json(createErrorResponse(400, 'The type cannot be changed after created.'));
    } else {
      await fragment.save();
      await fragment.setData(req.body);
      res.status(200).json(createSuccessResponse({ fragment }));
    }
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
