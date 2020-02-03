import {Classes, Code, Drawer, H3} from "@blueprintjs/core";
import classNames from "classnames";
import React, {Fragment} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {connect} from "react-redux";
import {UI_DEBUG_TOGGLE} from "../state/ui/actions";
import DebugURL from "./DebugURL";
import JsonRenderer from "./JsonRenderer";

const DebugDrawer = props => {
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
          {logicLayerUrl &&
            <Fragment>
              <H3>Tesseract LogicLayer API URL</H3>
              <DebugURL url={logicLayerUrl} />
              <DebugURL url={logicLayerUrl} />
            </Fragment>
          }

          {aggregateUrl &&
            <Fragment>
              <H3>Tesseract Aggregate API URL</H3>
              <DebugURL url={aggregateUrl} />
            </Fragment>
          }

          <H3>Query state</H3>
          <JsonRenderer name="query" value={query} defaultExpanded={false} />

          <H3>
            <Code>olap-client</Code>
          </H3>
          <pre className={classNames(Classes.CODE_BLOCK, "jscall")}>{javascriptCall}</pre>
        </div>
      </PerfectScrollbar>
    </Drawer>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  aggregateUrl: state.explorerAggregation.aggregateUrl,
  isOpen: state.explorerUi.debugDrawer,
  javascriptCall: state.explorerAggregation.jsCall,
  logicLayerUrl: state.explorerAggregation.logicLayerUrl,
  query: state.explorerQuery
});

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  closeDrawerHandler() {
    return dispatch({type: UI_DEBUG_TOGGLE, payload: false});
  }
});

export default connect(mapState, mapDispatch)(DebugDrawer);
