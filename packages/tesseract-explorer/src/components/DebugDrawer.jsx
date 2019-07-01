import {
  AnchorButton,
  Classes,
  Code,
  Drawer,
  H3,
  InputGroup,
  Intent
} from "@blueprintjs/core";
import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {connect} from "react-redux";

import {UI_DEBUG_TOGGLE} from "../actions/ui";
import {activeItemCounter} from "../utils/array";
import {buildAggregateUrl, buildJavascriptCall, buildLogicLayerUrl} from "../utils/debug";

function DebugDrawer(props) {
  const {query} = props;

  const activeDrilldowns = query.drilldowns.reduce(activeItemCounter, 0);
  const aggregateUrl = activeDrilldowns > 0 && buildAggregateUrl(query);
  const logicLayerUrl = activeDrilldowns > 0 && buildLogicLayerUrl(query);
  const javascriptCall = props.cube && buildJavascriptCall(query);

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
          <pre className={Classes.CODE_BLOCK}>{javascriptCall}</pre>

          {aggregateUrl && (
            <React.Fragment>
              <H3>Tesseract Aggregate API URL</H3>
              <InputGroup
                leftIcon="globe"
                readOnly={true}
                rightElement={
                  <AnchorButton
                    href={aggregateUrl}
                    icon="share"
                    intent={Intent.PRIMARY}
                    target="_blank"
                    text="Open"
                  />
                }
                value={aggregateUrl}
              />
            </React.Fragment>
          )}

          {logicLayerUrl && (
            <React.Fragment>
              <H3>Tesseract LogicLayer API URL</H3>
              <InputGroup
                leftIcon="globe"
                readOnly={true}
                rightElement={
                  <AnchorButton
                    href={logicLayerUrl}
                    icon="share"
                    intent={Intent.PRIMARY}
                    target="_blank"
                    text="Open"
                  />
                }
                value={logicLayerUrl}
              />
            </React.Fragment>
          )}

          <H3>Query state</H3>
          <details>
            <summary>Drilldowns</summary>
            <pre>{JSON.stringify(query.drilldowns, null, 2)}</pre>
          </details>
          <details>
            <summary>Measures</summary>
            <pre>{JSON.stringify(query.measures, null, 2)}</pre>
          </details>
          <details>
            <summary>Cuts</summary>
            <pre>{JSON.stringify(query.cuts, null, 2)}</pre>
          </details>
          <details>
            <summary>Growth</summary>
            <pre>{JSON.stringify(query.growth, null, 2)}</pre>
          </details>
          <details>
            <summary>RCA</summary>
            <pre>{JSON.stringify(query.rca, null, 2)}</pre>
          </details>
          <details>
            <summary>Top N</summary>
            <pre>{JSON.stringify(query.top, null, 2)}</pre>
          </details>
          <details>
            <summary>Options</summary>
            <pre>{JSON.stringify({parents: query.parents}, null, 2)}</pre>
          </details>
        </div>
      </PerfectScrollbar>
    </Drawer>
  );
}

/** @param {import("../reducers").ExplorerState} state */
function mapStateToProps(state) {
  return {
    cube: Boolean(state.explorerCubes.current),
    isOpen: state.explorerUi.debugDrawer,
    query: state.explorerQuery,
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
