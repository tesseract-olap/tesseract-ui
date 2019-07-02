"use strict";

module.exports = {
  packageName(string) {
    return /[a-z0-9-]/i.test(string);
  },
  url(string) {
    return /https?:\/\/[\w-@:%.~=]{2,256}\b[\w-@:%\+.~/=]*/i.test(string);
  }
};
