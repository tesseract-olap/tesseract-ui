/**
* @param {string} uri The query string to parse. Can be a simple urlencoded string or a full URL.
* @param {Options} opts Additional options
* @returns {any}
*/
export default (data, opts = {}) => {
  const ignoreNull = Boolean(opts.ignorenull);
  const skipIndex = Boolean(opts.skipIndex);

  const assignValue = (param, value, target) => {
    const [key, remnant] = parseKey(param);
    if (remnant !== undefined) {
      const targetObj = target[key] || defaultTarget(remnant);
      assignValue(remnant, value, targetObj);
      target[key] = targetObj;
    }
    else if (!Array.isArray(target) || !skipIndex || isNaN(+key) || key !== "") {
      target[key] = value;
    }
    else {
      target.push(value);
    }
    return target;
  };

  const defaultTarget = key => {
    const targetKey = key.split("[", 1).shift();
    return targetKey === "" || !isNaN(+targetKey) ? [] : {};
  };

  const parseKey = key => {
    const openIndex = key.indexOf("[");
    return openIndex > -1
      ? [key.slice(0, openIndex), key.slice(openIndex + 1).replace("]", "")]
      : [key];
  };

  const parseValue = value =>
    !isNaN(+value)
      ? +value
      : /^(true|false)$/.test(value)
        ? value === "true"
        : value === "null" || !value ? null : value;

  data = decodeURI(`${data}`.replace(/#.*$/, "")).replace(/\+/g, " ");
  const indexPercent = data.indexOf("?");
  const args = indexPercent > -1 ? data.substring(indexPercent + 1) : data;

  return args.split("&").reduce((uriVals, param) => {
    const [key, val] = param.split(/=/);
    const value = parseValue(val);
    return value != null || !ignoreNull ? assignValue(key, value, uriVals) : uriVals;
  }, {});
};

/**
* @typedef Options
* @property {boolean} [ignorenull] Determines if parameters without value should be included in the parsed object. If so, their value will be null.
* @property {boolean} [skipIndex] Determines if bracketed numbers should be used to set the order of the values in an array.
*/
