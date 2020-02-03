/**
 * @param {import("@datawheel/olap-client").Cube} cube
 * @param {(lvl: import("@datawheel/olap-client").Level) => boolean} finderFn
 */
export function findLevelBy(cube, finderFn) {
  for (const level of cube.levelIterator) {
    if (finderFn(level)) {
      return level;
    }
  }
  return undefined;
}
