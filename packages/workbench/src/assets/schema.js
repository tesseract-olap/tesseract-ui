export function validate(element, index, elements) {
  const validator = elementValidator[element.name];
  return validator ? validator(element, index, elements) : false;
}

function validateAttribute(parentName, attrs, property, typing) {
  return typings[typing](attrs[property]) ||
  printWarn(parentName, `Invalid ${property}: ${attrs[property]}`);
}

function validateValue() {

}

function printWarn(elName, message) {
  console.warn(elName, message);
}

const typings = {
  Aggregator: value => value && ["SUM", "COUNT", "AVG"].includes(value),
  String: value => value && typeof value === "string",
  "Option<String>": value => !value || typeof value === "string",
  "Option<DimensionType>": value => !value || ["geo", "time", "standard"].includes(value),
  "Option<MeasureType>": value => !value || (typeof value === "object" && (typeof value.error === "object" || typeof value.standard === "object")),
  "MemberType": value => value && ["text", "nontext"].includes(value),
};

const elementValidator = {
  Annotation: ({attributes, elements, name, type}, index, siblings) => {
    validateAttribute(name, attributes, "name", "String");

    return elements.length === 1 && validateAttribute(name, elements[0], "text", "String");
  },

  ColumnDef: ({attributes, elements, name, type}, index, siblings) => {
    validateAttribute(name, attributes, "name", "String");
    validateAttribute(name, attributes, "key_type", "MemberType");
    validateAttribute(name, attributes, "key_column_type", "Option<String>");
    validateAttribute(name, attributes, "caption_set", "Option<String>");

    return !Array.isArray(elements) || elements.every(validate);
  },

  Cube: ({attributes, elements, name, type}, index, siblings) => {
    validateAttribute(name, attributes, "name", "String");
    validateAttribute(name, attributes, "public", "Option<String>");

    return !Array.isArray(elements) || elements.every(validate);
  },

  Dimension: ({attributes, elements, name, type}, index, siblings) => {
    validateAttribute(name, attributes, "name", "String");
    validateAttribute(name, attributes, "foreign_key", "Option<String>");
    validateAttribute(name, attributes, "default_hierarchy", "Option<String>");
    validateAttribute(name, attributes, "type", "Option<DimensionType>");

    return !Array.isArray(elements) || elements.every(validate);
  },

  DimensionUsage: ({attributes, elements, name, type}, index, siblings) => {
    validateAttribute(name, attributes, "source", "String");
    validateAttribute(name, attributes, "name", "Option<String>");
    validateAttribute(name, attributes, "foreign_key", "String");

    return !Array.isArray(elements) || elements.every(validate);
  },

  Hierarchy: ({attributes, elements, name, type}, index, siblings) => {
    validateAttribute(name, attributes, "name", "String");
    validateAttribute(name, attributes, "primary_key", "Option<String>");
    validateAttribute(name, attributes, "default_member", "Option<String>");

    return !Array.isArray(elements) || elements.every(validate);
  },

  InlineTable: ({attributes, elements, name, type}, index, siblings) => {
    validateAttribute(name, attributes, "alias", "String");

    return !Array.isArray(elements) || elements.every(validate);
  },

  Level: ({attributes, elements, name, type}, index, siblings) => {},

  Measure: ({attributes, elements, name, type}, index, siblings) => {
    validateAttribute(name, attributes, "name", "String");
    validateAttribute(name, attributes, "column", "String");
    validateAttribute(name, attributes, "aggregator", "Aggregator");
    validateAttribute(name, attributes, "type", "Option<MeasureType>");
  },

  Property: ({attributes, elements, name, type}, index, siblings) => {
    validateAttribute(name, attributes, "name", "String");
    validateAttribute(name, attributes, "column", "String");
    validateAttribute(name, attributes, "caption_set", "Option<String>");

    return !Array.isArray(elements) || elements.every(validate);
  },

  Row: ({attributes, elements, name, type}, index, siblings) => {
    return !Array.isArray(elements) || elements.every(validate);
  },

  Schema: ({attributes, elements, name, type}, index, siblings) => {
    validateAttribute(name, attributes, "name", "String");
    validateAttribute(name, attributes, "default_locale", "Option<String>");

    return !Array.isArray(elements) || elements.every(validate);
  },

  SharedDimension: ({attributes, elements, name, type}, index, siblings) => {
    validateAttribute(name, attributes, "name", "String");
    validateAttribute(name, attributes, "default_hierarchy", "Option<String>");
    validateAttribute(name, attributes, "type", "Option<DimensionType>");

    return !Array.isArray(elements) || elements.every(validate);
  },

  Table: ({attributes, elements, name, type}, index, siblings) => {
    validateAttribute(name, attributes, "name", "String");
    validateAttribute(name, attributes, "schema", "Option<String>");
    validateAttribute(name, attributes, "primary_key", "Option<String>");

    return true;
  },

  Value: ({attributes, elements, name, type}, index, siblings) => {
    validateAttribute(name, attributes, "column", "String");

    return elements.length === 1 && validateAttribute(name, elements[0], "text", "String");
  },
};
