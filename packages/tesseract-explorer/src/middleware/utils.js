import {ensureArray, sortByKey} from "../utils/array";
import {buildCut, buildDrilldown, buildMember, buildProperty} from "../utils/structs";
import {isActiveItem} from "../utils/validation";

/**
 * Updates the list of members of a CutItem
 * @param {object} p
 * @param {import("@datawheel/olap-client").Client} p.client
 * @param {import("@datawheel/olap-client").Cube} p.cube
 * @param {CutItem} p.cutItem
 * @param {string|undefined} p.locale
 */
export async function hydrateCutMembers({client, cube, cutItem, locale}) {
  const activeMembers = ensureArray(cutItem.members)
    .filter(isActiveItem)
    .map(member => `${member.key}`);
  const {level: levelName, hierarchy, dimension} = cutItem;

  try {
    for (const level of cube.levelIterator) {
      if (level.uniqueName === levelName || level.name === levelName) {
        const sameHie = hierarchy ? hierarchy === level.hierarchy.name : true;
        const sameDim = dimension ? dimension === level.dimension.name : true;
        if (sameDim && sameHie) {
          const rawMembers = await client.getMembers(level, {locale});
          const members = rawMembers.map(member => {
            const active = activeMembers.includes(`${member.key}`);
            return buildMember({name: member.caption, key: member.key, active});
          });
          return buildCut({
            ...cutItem,
            active: true,
            members: sortByKey(members, "key", false),
            membersLoaded: true
          });
        }
      }
    }
    throw new Error(
      `Couldn't find level from reference: {"dimension":"${dimension}", "hierarchy":"${hierarchy}", "level":"${levelName}"}`
    );
  }
  catch (error) {
    return buildCut({
      ...cutItem,
      error: error.message,
      membersLoaded: false
    });
  }
}

/**
 * Updates the list of properties of a DrilldownItem.
 * @param {object} p
 * @param {import("@datawheel/olap-client").Cube} p.cube
 * @param {DrilldownItem} p.drilldownItem
 * @returns {DrilldownItem}
 */
export function hydrateDrilldownProperties({cube, drilldownItem}) {
  const activeProperties = ensureArray(drilldownItem.properties)
    .filter(isActiveItem)
    .map(prop => prop.property);
  const {level: levelName, hierarchy, dimension} = drilldownItem;

  for (const level of cube.levelIterator) {
    if (level.uniqueName === levelName || level.name === levelName) {
      const sameHie = hierarchy ? hierarchy === level.hierarchy.name : true;
      const sameDim = dimension ? dimension === level.dimension.name : true;
      if (sameDim && sameHie) {
        const properties = level.properties.map(property => {
          const active = activeProperties.includes(property.name);
          return buildProperty({...property, active});
        });
        return buildDrilldown({...drilldownItem, properties});
      }
    }
  }
  return drilldownItem;
}
