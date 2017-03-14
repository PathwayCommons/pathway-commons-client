'use strict';

var uuidV4 = require('uuid/v4');
var validateString = require('./private/helpers.js').validateString;

const idPrefix = "pathwaycommons-js-lib:";

const _id = new WeakMap();
const key = {};

const setId = (userId) => {
  if (validateString(userId)) {
    userId = idPrefix + userId;
  }
  else if (userId === null) {
    userId = "";
  }
  else {
    userId = idPrefix + uuidV4();
  }

  if(_id.get(key) === undefined) {
    _id.set(key, userId);
  }
}

module.exports = {
  id: (userId) => {
    if(!((userId === undefined) && (_id.get(key) !== undefined))) {
      setId(userId);
    }
    return _id.get(key);
  }
}
