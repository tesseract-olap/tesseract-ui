export function checkDrilldowns(query) {
  const drilldowns = query.drilldowns;
  const issues = new Set();

  if (drilldowns.length === 0) {
    issues.add("The query needs at least one drilldown.");
  }

  const dimensions = new Set();
  for (let i = 0; i < drilldowns.length; i++) {
    const item = drilldowns[i];
    if (item.active) {
      const dimName = item.drillable.dimension.name;
      if (dimensions.has(dimName)) {
        issues.add("Only one drilldown per dimension allowed.");
      }
      dimensions.add(dimName);
    }
  }

  return Array.from(issues);
}

export function checkMeasures(query) {
  const measures = query.measures;
  const issues = [];

  let activeMeasures = 0;
  for (let i = 0; i < measures.length; i++) {
    const item = measures[i];
    if (item.active) {
      activeMeasures++;
    }
  }

  if (activeMeasures === 0) {
    issues.push("At least one measure must be selected.");
  }

  return issues;
}
