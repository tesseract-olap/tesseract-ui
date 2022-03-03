const chproc = require("child_process");
const {promisify} = require("util");

module.exports = {
  exec: promisify(chproc.exec),
  spawn: promisify(chproc.spawn),
};
