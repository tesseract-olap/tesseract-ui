import React from "react";
import urljoin from "url-join";
import {Drawer, Code, InputGroup, Classes, H3} from "@blueprintjs/core";
import {connect} from "react-redux";

import {UI_DEBUG_TOGGLE} from "../actions/ui";
import {buildJavascriptCall, buildLogicLayerUrl, buildAggregateUrl} from "../utils/debug";
import {countActive} from "../utils/array";
import PerfectScrollbar from "react-perfect-scrollbar";

function DebugDrawer(props) {
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
      <PerfectScrollbar>
        <div className="debug-drawer-content">
          <H3>
            Javascript call for <Code>tesseract-client</Code>
          </H3>
          <pre className={Classes.CODE_BLOCK}>{buildJavascriptCall(props.query)}</pre>

          {aggregateUrl && (
            <React.Fragment>
              <H3>Tesseract Aggregate API URL</H3>
              <InputGroup leftIcon="globe" readOnly={true} value={aggregateUrl} />
            </React.Fragment>
          )}

          {logicLayerUrl && (
            <React.Fragment>
              <H3>Tesseract LogicLayer API URL</H3>
              <InputGroup leftIcon="globe" readOnly={true} value={logicLayerUrl} />
            </React.Fragment>
          )}

          <H3>Query state</H3>
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
      </PerfectScrollbar>
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
      return dispatch({type: UI_DEBUG_TOGGLE, payload: false});
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DebugDrawer);
