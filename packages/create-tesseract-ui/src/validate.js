"use strict";

function absoluteUrl(string) {
  return /https?:\/\/[\w-@:%.~=]{2,256}\b[\w-@:%\+.~/=]*/i.test(string);
}

function packageName(string) {
  return /[a-z0-9-]/i.test(string);
}

function relativeUrl(string) {
  return /^\/[\w-@:%\+.~/=]*/i.test(string);
}

function url(string) {
  return absoluteUrl(string) || relativeUrl(string);
}

module.exports = {
  absoluteUrl,
  packageName,
  relativeUrl,
  url
};
