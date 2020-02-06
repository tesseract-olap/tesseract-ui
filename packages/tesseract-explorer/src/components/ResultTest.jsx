import {FormGroup} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {selectDrilldownItems} from "../state/params/selectors";
import TransferInput from "./TransferInput";

const ResultTest = props => {
  console.log("ResultTest", "props", props);
  return (
    <FormGroup label="Members" helperText="Members restrict the data returned by the server to the datums whose cut level match these properties.">
      <TransferInput items={props.items} />
    </FormGroup>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => {
  const drilldown = selectDrilldownItems(state).find(item => item.properties.length > 0);
  return {
    items: drilldown ? drilldown.properties : []
  };
};

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
const mapDispatch = (dispatch) => ({

});
export default connect(mapState)(ResultTest);
