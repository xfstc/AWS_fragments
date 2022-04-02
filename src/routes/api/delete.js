const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const id = req.params._id;
    await Fragment.delete(req.user, id);
    res.status(200).json(createSuccessResponse());
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
