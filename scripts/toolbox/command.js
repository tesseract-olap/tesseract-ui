const chproc = require("child_process");
const {promisify} = require("util");

module.exports = {
  exec: promisify(chproc.exec),
  spawn,
};


/**
 * A promisified version of child_process.spawn that streams output.
 * @param {string} command The command to run.
 * @param {string[]} args The arguments for the command.
 * @param {chproc.SpawnOptions} options The options for spawn.
 * @returns {Promise<void>}
 */
function spawn(command, args, options) {
  return new Promise((resolve, reject) => {
    const proc = chproc.spawn(command, args, { stdio: "inherit", ...options });
    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
    proc.on("error", (err) => {
      reject(err);
    });
  });
}
