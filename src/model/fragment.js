// Use https://www.npmjs.com/package/nanoid to create unique IDs
const { nanoid } = require('nanoid');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
//const sharp = require('sharp');
const logger = require('../logger');
const md = require('markdown-it')();
const sharp = require('sharp');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (id) {
      this.id = id;
    } else {
      this.id = nanoid();
    }

    if (!ownerId) {
      throw new Error('Owner id cannot be empty');
    } else {
      this.ownerId = ownerId;
    }

    if (!type.length) {
      throw new Error('Type can not be empty.');
    } else {
      if (Fragment.isSupportedType(type)) {
        this.type = type;
      } else {
        throw new Error('Now can create text/* or application/json fragments');
      }
    }

    if (created) {
      this.created = created;
    } else {
      this.created = new Date().toISOString();
    }

    if (updated) {
      this.updated = updated;
    } else {
      this.updated = new Date().toISOString();
    }

    if (typeof size != 'number' || size < 0) {
      throw new Error('Size must be a positive number.');
    } else {
      this.size = size;
    }
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    try {
      logger.debug({ ownerId, expand }, 'Fragment.byUser()');
      const fragments = await listFragments(ownerId, expand);
      return expand ? fragments.map((fragment) => new Fragment(fragment)) : fragments;
    } catch (err) {
      // A user might not have any fragments (yet), so return an empty
      // list instead of an error when there aren't any.
      return [];
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    try {
      const result = await readFragment(ownerId, id);
      if (!result) {
        throw new Error('No fragment found.');
        //return Promise.reject(new Error('No fragment found.'));
      }

      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    try {
      if (!data) {
        return Promise.reject(new Error('Data cannot be empty.'));
      }
      this.updated = new Date().toISOString();
      this.size = data.length;
      await writeFragment(this);
      return writeFragmentData(this.ownerId, this.id, data);
    } catch (err) {
      Promise.reject(err);
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    const type = new RegExp('^text/*');
    return type.test(this.type);
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    return new Array(this.type.split(';')[0]);
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const textType = new RegExp('^text/*');
    if (
      textType.test(value) ||
      value == 'application/json' ||
      value == 'image/png' ||
      value == 'image/jpeg' ||
      value == 'image/webp' ||
      value == 'image/gif'
    ) {
      return true;
    }
    return false;
  }

  // Returns true if the extension name satisfies the conversion of the type
  isSupportedExt(extname) {
    if (this.type == 'text/plain' && extname == '.txt') {
      return true;
    } else if (this.type == 'text/markdown') {
      if (extname == '.md' || extname == '.html' || extname == '.txt') {
        return true;
      }
    } else if (this.type == 'text/html') {
      if (extname == '.html' || extname == '.txt') {
        return true;
      }
    } else if (this.type == 'application/json') {
      if (extname == '.json' || extname == '.txt') {
        return true;
      }
    } else if (
      this.type == 'image/png' ||
      this.type == 'image/jpeg' ||
      this.type == 'image/webp' ||
      this.type == 'image/gif'
    ) {
      if (extname == '.png' || extname == '.jpg' || extname == '.webp' || extname == '.gif') {
        return true;
      }
    } else {
      return false;
    }
  }

  convertContentType(extname) {
    if (extname == '.txt') {
      return 'text/plain';
    } else if (extname == '.md') {
      return 'text/markdown';
    } else if (extname == '.html') {
      return 'text/html';
    } else if (extname == '.json') {
      return 'application/json';
    } else if (extname == '.png') {
      return 'image/png';
    } else if (extname == '.jpg') {
      return 'image/jpeg';
    } else if (extname == '.webp') {
      return 'image/webp';
    } else if (extname == '.gif') {
      return 'image/gif';
    } else {
      return this.mimeType;
    }
  }

  async convertData(extname) {
    try {
      var data = await this.getData();
      var converted;
      if (extname == '.txt') {
        converted = data.toString();
      } else if (this.mimeType == 'text/markdown' && extname == '.html') {
        converted = md.render(data.toString());
      }
      if (extname == '.png') {
        converted = await sharp(data).png().toBuffer();
      } else if (extname == '.jpg') {
        converted = await sharp(data).jpeg({ quality: 100, chromaSubsampling: '4:4:4' }).toBuffer();
      } else if (extname == '.webp') {
        converted = await sharp(data).webp({ lossless: true }).toBuffer();
      } else if (extname == '.gif') {
        converted = await sharp(data).gif().toBuffer();
      }
      return converted;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports.Fragment = Fragment;
