const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  const { headers } = req;
  const type = headers['content-type'];

  if (!Fragment.isSupportedType(type) && Buffer.isBuffer(req.body) === false) {
    res.status(415).json(createErrorResponse(415, 'Type not supported'));
  } else {
    const ownerId = req.user;
    const fragment = new Fragment({ ownerId, type });
    try {
      await fragment.save();
      await fragment.setData(req.body);

      res.location(`${process.env.API_URL}/v1/fragments/${fragment.id}`);

      res.status(201).json(createSuccessResponse({ fragment }));
    } catch (err) {
      throw new Error(err);
    }
  }
};
