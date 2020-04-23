import {AnchorButton, Classes, Code, Drawer, H3, InputGroup, Intent, ButtonGroup} from "@blueprintjs/core";
import classNames from "classnames";
import React, { Fragment} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {connect} from "react-redux";
import {UI_DEBUG_TOGGLE} from "../actions/ui";
import {selectAggregationState, selectQueryState, selectUiState} from "../selectors/state";
import JsonRenderer from "./JsonRenderer";
import ButtonDownload from "./ButtonDownload";

/**
 * @typedef StateProps
 * @property {string} aggregateUrl
 * @property {boolean} isOpen
 * @property {string} javascriptCall
 * @property {string} logicLayerUrl
 * @property {import("../reducers").QueryState} query
 */

/**
 * @typedef DispatchProps
 * @property {(event?: React.SyntheticEvent<HTMLElement, Event> | undefined) => void} closeDrawerHandler
 */

/** @type {React.FC<StateProps & DispatchProps>} */
const DebugDrawer = props => {
  const {query, javascriptCall, aggregateUrl, logicLayerUrl} = props;
  const baseFileName = query.drilldowns.map(item => item.level).join("-");

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
          {(logicLayerUrl || aggregateUrl) &&
            <Fragment>
              <H3>Download dataset</H3>

              <ButtonGroup>
                {aggregateUrl && <ButtonDownload
                  content={aggregateUrl.replace("aggregate.jsonrecords", "aggregate.csv")}
                  fileName={`${baseFileName}.csv`}
                  text="CSV file"
                />}
                {aggregateUrl && !logicLayerUrl && <ButtonDownload
                  content={aggregateUrl.replace("aggregate.jsonrecords", "aggregate.xls")}
                  fileName={`${baseFileName}.xls`}
                  text="XLS file"
                />}
                {aggregateUrl && <ButtonDownload
                  content={aggregateUrl}
                  fileName={`${baseFileName}-records.json`}
                  text="JSON Tidy file"
                />}
                {logicLayerUrl && <ButtonDownload
                  content={logicLayerUrl.replace("data.jsonrecords", "data.jsonarrays")}
                  fileName={`${baseFileName}-arrays.json`}
                  text="JSON Arrays file"
                />}
              </ButtonGroup>
            </Fragment>
          }

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

          <H3>
            <Code>olap-client</Code>
          </H3>
          <pre className={classNames(Classes.CODE_BLOCK, "jscall")}>{javascriptCall}</pre>

          <H3>Query state</H3>
          <JsonRenderer name="query" value={query} defaultExpanded={true} />
        </div>
      </PerfectScrollbar>
    </Drawer>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, {}, import("../reducers").ExplorerState>} */
const mapState = state => {
  const aggregationState = selectAggregationState(state);
  return {
    aggregateUrl: aggregationState.aggregateUrl,
    isOpen: selectUiState(state).debugDrawer,
    javascriptCall: aggregationState.jsCall,
    logicLayerUrl: aggregationState.logicLayerUrl,
    query: selectQueryState(state)
  };
};

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, {}>} */
const mapDispatch = dispatch => ({
  closeDrawerHandler() {
    dispatch({type: UI_DEBUG_TOGGLE, payload: false});
  }
});

export default connect(mapState, mapDispatch)(DebugDrawer);
