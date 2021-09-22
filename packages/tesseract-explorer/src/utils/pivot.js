/**
 * @template T
 * @typedef {(initial: string, set: T[]) => [string, ...T[]]} Concatter
 */

/**
 * Converts an array of tidy data into a pivotted table.
 *
 * @param {Record<string, number>[]} data
 * @param {Record<"rowProp" | "colProp" | "valProp", string>} sides
 *
 * @param {object} cls
 * This is to provide some raw structs needed in the function,
 * without having them modified by the transpiler.
 * @param {typeof Array} cls.Array
 * @param {typeof Map} cls.Map
 * @param {typeof Set} cls.Set
 * @param {Concatter<number | undefined>} cls.cc
 *
 * @returns {JSONArrays}
 */
export function serializeTidyToArrays(data, sides, {Array, Map, Set, cc}) {
  const {valProp} = sides;
  const colProp = getIdProperty(sides.colProp);
  const rowProp = getIdProperty(sides.rowProp);

  const colMembers = new Set();
  const rowMembers = new Set();

  /** @type {Map<string, string>} */ const colDict = new Map();
  /** @type {Map<string, string>} */ const rowDict = new Map();

  /** @type {Map<string, Record<string, number>[]>} */
  const valReference = new Map();

  const n = data.length;
  let i = 0;
  while (i < n) {
    const datum = data[i++];

    const colId = datum[colProp];
    const rowId = datum[rowProp];
    colMembers.add(colId);
    rowMembers.add(rowId);
    getValueReference(colId, rowId).push(datum);

    const colLabel = datum[sides.colProp];
    const rowLabel = datum[sides.rowProp];
    colDict.set(colId, colLabel);
    rowDict.set(rowId, rowLabel);
  }

  const sortedCols = Array.from(colMembers).sort();

  return {
    headers: cc(rowProp, sortedCols.map(colId => colDict.get(colId) || colId)),
    data: Array.from(rowMembers, rowId =>
      cc(rowDict.get(rowId) || rowId, sortedCols.map(colId => {
        const items = getValueReference(colId, rowId);
        if (items.length === 0) return undefined;
        const value = items.reduce((sum, datum) => sum + datum[valProp], 0);
        return isNaN(value) ? undefined : value;
      }))
    )
  };

  /**
   * Gets the property name for the ID of the required property.
   * @type {(prop: string) => string}
   */
  function getIdProperty(prop) {
    return {}.hasOwnProperty.call(data[0], `${prop} ID`) ? `${prop} ID` : prop;
  }

  /**
   * Retrieves the container array for the elements in the data that match a
   * specified (col, row) tuple. If this array was not previously defined, is
   * created.
   * @type {(colId: string, rowId: string) => Record<string, number>[]}
   */
  function getValueReference(colId, rowId) {
    const key = "".concat("<", colId, ">x<", rowId, ">");
    const value = valReference.get(key);
    if (value !== undefined) return value;
    const defaultValue = [];
    valReference.set(key, defaultValue);
    return defaultValue;
  }
}

/**
 * @param {Record<string, any>[]} data
 * @param {{rowProp: string, colProp: string, valProp: string}} sides
 * @returns {Promise<JSONArrays>}
 */
export function serializeToArray(data, sides) {
  // If the browser doesn't support Blobs or WebWorkers
  if (!Blob || !Worker) {
    return new Promise(resolve => {
      const result = serializeTidyToArrays(data, sides, {
        Array,
        Set,
        Map,
        cc: (initial, set) => [initial, ...set]
      });
      resolve(result);
    });
  }

  const scriptBody = `
self.onmessage = function(e) {
  const {data, sides} = e.data;
  const result = (${serializeTidyToArrays})(data, sides, {Array, Map, Set, cc});
  self.postMessage(result);
};
function cc(initial, set) {
  return [initial, ...Array.from(set)];
}
`;
  const blob = new Blob([scriptBody], {type: "text/javascript"});
  return new Promise((resolve, reject) => {
    const scriptURL = window.URL.createObjectURL(blob);
    const worker = new Worker(scriptURL);
    worker.addEventListener("message", evt => {
      resolve(evt.data);
      window.URL.revokeObjectURL(scriptURL);
      worker.terminate();
    });
    worker.addEventListener("error", error => {
      reject(error);
      window.URL.revokeObjectURL(scriptURL);
      worker.terminate();
    });
    worker.postMessage({data, sides});
  });
}

/**
 * Outputs a CSV-like string.
 * @param {JSONArrays} matrix
 * @param {TessExpl.Formatter} formatter
 * @param {"csv" | "tsv"} format
 * @returns {string}
 */
export function stringifyMatrix(matrix, formatter, format) {
  const joint = {csv: ",", tsv: "\t"}[format];
  const safeQuoter = value => {
    const str = `${value}`.trim();
    return str.includes(joint) ? JSON.stringify(str) : str;
  };
  const safeFormatter = value =>
    value === undefined ? "" : safeQuoter(formatter(value));

  return [
    matrix.headers.map(safeQuoter).join(joint),
    ...matrix.data.map(row =>
      [safeQuoter(row[0]), ...row.slice(1).map(safeFormatter)].join(joint)
    )
  ].join("\n");
}
