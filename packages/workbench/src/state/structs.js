/* eslint-disable comma-dangle, no-unused-vars */

/**
 * @template T
 * @param {T} _value
 * @returns {Record<string, T>}
 */
export function buildTypedObject(_value) {
  return Object.create(null);
}

/**
 * @param {string} [key]
 * @param {Partial<TessBench.CubeItem>} [props]
 * @returns {TessBench.CubeItem}
 */
export function buildCube(key, props = {}) {
  return {
    key: key || Math.random().toString(32).slice(2),
    name: props.name || "",
    isPublic: props.isPublic ?? false,
    table_name: props.table_name || "",
    dimensions: props.dimensions || [],
    dimension_usages: props.dimension_usages || [],
    measures: props.measures || [],
    annotations: props.annotations || {},
  };
}
