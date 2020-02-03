import {Menu} from "@blueprintjs/core";
import React, {memo} from "react";
import {connect} from "react-redux";
import {selectOlapTimeDimension} from "../state/selectors";
import {shallowEqualExceptFns} from "../utils/validation";
import HierarchyMenuItem from "./MenuItemHierarchy";

/**
 * @typedef OwnProps
 * @property {string[]} [selectedItems]
 * @property {(level: OlapLevel) => any} onItemSelect
 */

/**
 * @typedef StateProps
 * @property {OlapHierarchy[]} hierarchies
 */

/** @type {React.FC<OwnProps & StateProps>} */
const TimeDimensionMenu = ({hierarchies, onItemSelect, selectedItems}) =>
  <Menu>
    {hierarchies.map(hie =>
      <HierarchyMenuItem
        hierarchy={hie}
        key={hie.uri}
        onItemSelect={onItemSelect}
        selectedItems={selectedItems}
      />
    )}
  </Menu>;

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => {
  const timeDimension = selectOlapTimeDimension(state);
  return {
    hierarchies: timeDimension ? timeDimension.hierarchies : []
  };
};

export default connect(mapState)(memo(TimeDimensionMenu, shallowEqualExceptFns));
