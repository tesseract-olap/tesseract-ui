import pluralize from "pluralize";

export function safeRegExp(pattern, flags) {
  let regex;
  try {
    regex = new RegExp(pattern, flags);
  } catch (e) {
    pattern = pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    regex = new RegExp(pattern, flags);
  }
  return regex;
}

export function getTopItemsSummary(top) {
  if (top.amount > 0) {
    const pluralMsrName = pluralize(top.measure.name, top.amount);
    return `Showing the top ${top.amount} ${pluralMsrName} by ${top.level
      .name} (${top.descendent ? "desc" : "asc"})`;
  }
}
