"use strict";

module.exports = {
  packageName(string) {
    return /[a-z0-9-]/i.test(string);
  },
  url(string) {
    return /(https?):\/\/[\w@:%.\+~#=]{2,253}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i.test(
      string
    );
  }
};
