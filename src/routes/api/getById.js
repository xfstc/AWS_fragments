// src/routes/api/get.js
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
//const sharp = require('sharp');
//const md = require('markdown-it');
const path = require('path');

/**
 * Get a fragment by id
 */
module.exports = async (req, res) => {
  var id = path.parse(req.url).name;
  var extname = path.extname(req.url);

  try {
    var fragment = await Fragment.byId(req.user, id);
    if (extname) {
      if (fragment.isSupportedExt(extname)) {
        res.setHeader('content-type', fragment.convertContentType(extname));
        res.status(200).send(await fragment.convertData(extname));
      } else {
        res
          .status(415)
          .json(
            createErrorResponse(415, `This fragment does not support conversions of ${extname}`)
          );
      }
    } else {
      var fragmentData = await fragment.getData();
      res.status(200).setHeader('content-type', fragment.type).send(fragmentData);
    }
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }

  // if (index > 0) {
  //   ext = id.substr(index + 1, id.length);
  //   id = id.substr(0, index);
  // }

  // try {
  //   var fragment = await Fragment.byId(req.user, id);
  //   var fragmentData = await fragment.getData();

  //   if (imageType.test(fragment.type) && index > 0) {
  //     var convertedImage;
  //     try {
  //       if (ext == 'jpg') {
  //         convertedImage = await sharp(fragmentData)
  //           .jpeg({ quality: 100, chromaSubsampling: '4:4:4' })
  //           .toBuffer();
  //       } else if (ext == 'png') {
  //         convertedImage = await sharp(fragmentData).png().toBuffer();
  //       } else if (ext == 'webp') {
  //         convertedImage = await sharp(fragmentData).webp({ lossless: true }).toBuffer();
  //       } else if (ext == 'gif') {
  //         convertedImage = await sharp(fragmentData).gif().toBuffer();
  //       }
  //     } catch (err) {
  //       logger.error(err);
  //       res.status(400).json(createErrorResponse(400, 'Convert failed.'));
  //     }
  //     res.status(200).setHeader('content-type', fragment.type).send(convertedImage);
  //   } else {
  //     if (fragment.type == 'text/plain' && ext == 'txt') {
  //       fragmentData = fragmentData.toString();
  //     }

  //     if ((fragment.type == 'text/markdown' && ext == 'md') || ext == 'html') {
  //       fragmentData = md.render(fragmentData.toString());
  //     } else if (fragment.type == 'text/markdown' && ext == 'txt') {
  //       fragmentData = fragmentData.toString();
  //     }

  //     if (fragment.type == 'text/html' && ext == 'html') {
  //       fragmentData = md.render(fragmentData.toString());
  //     } else if (fragment.type == 'text/html' && ext == 'txt') {
  //       fragmentData = fragmentData.toString();
  //     }

  //     if (fragment.type == 'application/json' && ext == 'json') {
  //       res.status(200).setHeader('content-type', fragment.type).json(fragment);
  //     } else if (fragment.type == 'application/json' && ext == 'txt') {
  //       fragmentData = fragmentData.toString();
  //     }

  //     res.status(200).setHeader('content-type', fragment.type).send(fragmentData);
  //   }
  // } catch (err) {
  //   logger.error(err);
  //   res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  // }
};
