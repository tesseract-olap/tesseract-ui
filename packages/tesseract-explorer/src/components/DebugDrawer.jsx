import {
  AnchorButton,
  Classes,
  Code,
  Drawer,
  H3,
  InputGroup,
  Intent
} from "@blueprintjs/core";
import classNames from "classnames";
import React, {Fragment} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {connect} from "react-redux";
import {UI_DEBUG_TOGGLE} from "../state/ui/actions";
import JsonRenderer from "./JsonRenderer";

function DebugDrawer(props) {
  const {query, javascriptCall, aggregateUrl, logicLayerUrl} = props;

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
            <Code>olap-client</Code>
          </H3>
          <pre className={classNames(Classes.CODE_BLOCK, "jscall")}>{javascriptCall}</pre>

          {aggregateUrl && (
            <Fragment>
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
            </Fragment>
          )}

          {logicLayerUrl && (
            <Fragment>
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
            </Fragment>
          )}

          <H3>Query state</H3>
          <JsonRenderer name="query" value={query} defaultExpanded={true} />
        </div>
      </PerfectScrollbar>
    </Drawer>
  );
}

/** @param {ExplorerState} state */
function mapStateToProps(state) {
  return {
    aggregateUrl: state.explorerAggregation.aggregateUrl,
    isOpen: state.explorerUi.debugDrawer,
    javascriptCall: state.explorerAggregation.jsCall,
    logicLayerUrl: state.explorerAggregation.logicLayerUrl,
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
