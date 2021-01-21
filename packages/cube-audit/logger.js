function Logger(level) {
  this.level = level;
}

Logger.prototype.debug = function (...args) {
  ["debug"].includes(this.level) && console.debug(...args);
};

Logger.prototype.info = function (...args) {
  ["debug", "info"].includes(this.level) && console.log(...args);
};

Logger.prototype.error = function (...args) {
  console.error(...args);
};

module.exports = {Logger};
