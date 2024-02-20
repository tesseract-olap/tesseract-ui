import {shimWorker} from "./workerify";

export default shimWorker(self => {
  self.onmessage = function(e) {
    const {data, sides} = e.data;
    const result = serializeTidyToArrays(data, sides);
    self.postMessage(result);
  };

  /**
   * Converts an array of tidy data into a pivotted table.
   *
   * @param {Record<string, number>[]} data
   * @param {Record<"rowProp" | "colProp" | "valProp", string>} sides
   * @returns {import("./types").JSONArrays}
   */
  // function serializeTidyToArrays(data, sides) {
  const serializeTidyToArrays = new Function("data", "sides", `
    const {valProp} = sides;
    const colProp = getIdProperty(sides.colProp);
    const rowProp = getIdProperty(sides.rowProp);

    /** @type {Set<string>} */ const colMembers = new Set();
    /** @type {Set<string>} */ const rowMembers = new Set();

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
      headers: [
        sides.rowProp,
        ...sortedCols.map(colId => colDict.get(colId) || colId)
      ],
      data: Array.from(rowMembers, rowId => [
        rowDict.get(rowId) || rowId,
        ...sortedCols.map(colId => {
          const items = getValueReference(colId, rowId);
          if (items.length === 0) return undefined;
          const value = items.reduce((sum, datum) => sum + datum[valProp], 0);
          return isNaN(value) ? undefined : value;
        })
      ])
    };

    /**
   * Gets the property name for the ID of the required property.
   * @type {(prop: string) => string}
   */
    function getIdProperty(prop) {
      const propid = "".concat(prop, " ID");
      return {}.hasOwnProperty.call(data[0], propid) ? propid : prop;
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
  `);
  // }
});
