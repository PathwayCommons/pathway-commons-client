'use strict';

var uuidV4 = require('uuid/v4');
var validateString = require('./private/helpers.js').validateString;

const idPrefix = "pathwaycommons-js-lib:";

var _id = new WeakMap();

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

  if(_id.get(this) === undefined) {
    _id.set(this, userId);
  }
}

module.exports = {
  id: (userId) => {
    if(!((userId === undefined) && (_id.get(this) !== undefined))) {
      setId(userId);
    }
    return _id.get(this);
  }
}
