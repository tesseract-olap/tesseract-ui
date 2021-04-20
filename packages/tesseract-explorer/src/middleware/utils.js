import {ensureArray} from "../utils/array";
import {buildDrilldown, buildMember, buildProperty} from "../utils/structs";
import {isActiveItem} from "../utils/validation";

/**
 * Updates the list of members of a CutItem
 * @param {object} p
 * @param {OlapClient.Cube} p.cube
 * @param {TessExpl.Struct.CutItem} p.cutItem
 * @param {string|undefined} p.locale
 * @returns {Promise<TessExpl.Struct.MemberRecords>}
 */
export function fetchCutMembers({cube, cutItem, locale}) {
  const ds = cube.datasource;
  const {level: levelName, hierarchy, dimension, members: activeMembers} = cutItem;

  for (const level of cube.levelIterator) {
    if (level.uniqueName === levelName || level.name === levelName) {
      const sameHie = hierarchy ? hierarchy === level.hierarchy.name : true;
      const sameDim = dimension ? dimension === level.dimension.name : true;
      if (sameDim && sameHie) {
        return ds.fetchMembers(level, {locale})
          .then(members => {
            /** @type {TessExpl.Struct.MemberRecords} */ const memberRecords = {};
            let i = members.length;
            while (i--) {
              const member = members[i];
              const active = activeMembers.includes(`${member.key}`);
              memberRecords[member.key] = buildMember({name: member.caption, key: member.key, active});
            }
            return memberRecords;
          });
      }
    }
  }

  const levelRef = JSON.stringify({dimension, hierarchy, level: levelName});
  throw new Error(`Couldn't find level from reference: ${levelRef}`);
}

/**
 * Updates the list of properties of a DrilldownItem.
 * @param {OlapClient.Cube} cube
 * @param {TessExpl.Struct.DrilldownItem} drilldownItem
 * @returns {TessExpl.Struct.DrilldownItem}
 */
export function hydrateDrilldownProperties(cube, drilldownItem) {
  const activeProperties = ensureArray(drilldownItem.properties)
    .filter(isActiveItem)
    .map(prop => prop.name);
  const {level: levelName, hierarchy, dimension} = drilldownItem;

  for (const level of cube.levelIterator) {
    if (level.uniqueName === levelName || level.name === levelName) {
      const sameHie = hierarchy ? hierarchy === level.hierarchy.name : true;
      const sameDim = dimension ? dimension === level.dimension.name : true;
      if (sameDim && sameHie) {
        const properties = level.properties.map(property => buildProperty({
          active: activeProperties.includes(property.name),
          level: property.level.uniqueName,
          name: property.name
        }));
        const dimType = level.dimension.dimensionType;
        return buildDrilldown({...drilldownItem, dimType, properties});
      }
    }
  }
  return drilldownItem;
}
