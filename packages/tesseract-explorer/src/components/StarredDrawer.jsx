import React from "react";
import urljoin from "url-join";
import {Drawer, Code, InputGroup} from "@blueprintjs/core";
import {connect} from "react-redux";

import {UI_STARRED_TOGGLE} from "../actions/ui";
import {buildJavascriptCall, buildLogicLayerUrl, buildAggregateUrl} from "../utils/debug";
import { countActive } from "../utils/array";

function StarredDrawer(props) {
  const {aggregateUrl, logicLayerUrl} = props;
  return (
    <Drawer
      className="debug-drawer"
      icon="code-block"
      isOpen={props.isOpen}
      onClose={props.closeDrawerHandler}
      size={Drawer.SIZE_STANDARD}
      title="Debug parameters"
    >
      <div className="bp3-running-text debug-drawer-content">
        <h3 className="bp3-heading">
          Javascript call for <Code>tesseract-client</Code>
        </h3>
        <pre>{buildJavascriptCall(props.query)}</pre>

        {aggregateUrl && (
          <React.Fragment>
            <h3 className="bp3-heading">Tesseract Aggregate API URL</h3>
            <InputGroup leftIcon="globe" readOnly={true} value={aggregateUrl} />
          </React.Fragment>
        )}

        {logicLayerUrl && (
          <React.Fragment>
            <h3 className="bp3-heading">Tesseract LogicLayer API URL</h3>
            <InputGroup leftIcon="globe" readOnly={true} value={logicLayerUrl} />
          </React.Fragment>
        )}

        <h3 className="bp3-heading">Query state</h3>
        <details>
          <summary>Drilldowns</summary>
          <pre>{JSON.stringify(props.query.drilldowns, null, 2)}</pre>
        </details>
        <details>
          <summary>Measures</summary>
          <pre>{JSON.stringify(props.query.measures, null, 2)}</pre>
        </details>
        <details>
          <summary>Cuts</summary>
          <pre>{JSON.stringify(props.query.cuts, null, 2)}</pre>
        </details>
        <details>
          <summary>Growth</summary>
          <pre>{JSON.stringify(props.query.growth, null, 2)}</pre>
        </details>
        <details>
          <summary>RCA</summary>
          <pre>{JSON.stringify(props.query.rca, null, 2)}</pre>
        </details>
        <details>
          <summary>Top N</summary>
          <pre>{JSON.stringify(props.query.top, null, 2)}</pre>
        </details>
        <details>
          <summary>Options</summary>
          <pre>{JSON.stringify({parents: props.query.parents}, null, 2)}</pre>
        </details>
      </div>
    </Drawer>
  );
}

function mapStateToProps(state) {
  const activeDrilldowns = state.explorerQuery.drilldowns.reduce(countActive, 0);
  return {
    aggregateUrl: activeDrilldowns > 0 && buildAggregateUrl(state.explorerQuery),
    logicLayerUrl: activeDrilldowns > 0 && buildLogicLayerUrl(state.explorerQuery),
    isOpen: state.explorerUi.debugDrawer,
    query: state.explorerQuery
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeDrawerHandler() {
      return dispatch({type: UI_STARRED_TOGGLE, payload: false});
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StarredDrawer);
