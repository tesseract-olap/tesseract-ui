/**
 * Converts an array of tidy data into a pivotted table.
 * @param {Record<string, number>[]} data
 * @param {Record<"rowProp" | "colProp" | "valProp", string>} sides
 * @returns {JSONArrays}
 */
export function serializeTidyToArrays(data, sides) {
  const {colProp, rowProp, valProp} = sides;

  const colMembers = new Set();
  const rowMembers = new Set();
  const valReference = new Map([["", data.slice(0, 0)]]);

  const getReference = (colLabel, rowLabel) => {
    const key = `<${colLabel}>x<${rowLabel}>`;
    const value = valReference.get(key);
    if (value !== undefined) return value;
    const defaultValue = [];
    valReference.set(key, defaultValue);
    return defaultValue;
  };

  const n = data.length;
  let i = 0;
  while (i < n) {
    const datum = data[i++];
    const colLabel = datum[colProp];
    const rowLabel = datum[rowProp];

    colMembers.add(colLabel);
    rowMembers.add(rowLabel);
    getReference(colLabel, rowLabel).push(datum);
  }

  return {
    headers: [rowProp, ...colMembers],
    data: Array.from(rowMembers, rowLabel =>
      [rowLabel, ...Array.from(colMembers, colLabel => {
        const items = valReference.get(`<${colLabel}>x<${rowLabel}>`);
        if (!items || items.length === 0) return undefined;
        const value = items.reduce((sum, datum) => sum + datum[valProp], 0);
        return isNaN(value) ? undefined : value;
      })]
    )
  };
}

/**
 *
 * @param {Record<string, any>[]} data
 * @param {Record<"rowProp" | "colProp" | "valProp", string>} sides
 * @returns {Promise<JSONArrays>}
 */
export function serializeToArray(data, sides) {
  if (!Blob) {
    return new Promise(resolve => {
      const result = serializeTidyToArrays(data, sides);
      resolve(result);
    });
  }

  const scriptBody = `
self.onmessage = function(e) {
  const {data, sides} = e.data;
  const result = (${serializeTidyToArrays})(data, sides);
  self.postMessage(result);
};
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
  const safeFormatter = value => value === undefined
    ? ""
    : safeQuoter(formatter(value));

  return [
    matrix.headers.map(safeQuoter).join(joint),
    ...matrix.data.map(row => [
      safeQuoter(row[0]),
      ...row.slice(1).map(safeFormatter)
    ].join(joint))
  ].join("\n");
}
