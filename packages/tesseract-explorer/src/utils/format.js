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
    const pluralLevelName = pluralize(top.level.name, top.amount);
    return `Showing the top ${top.amount} ${pluralLevelName} by ${top.measure
      .name} (${top.descendent ? "desc" : "asc"})`;
  }
}
