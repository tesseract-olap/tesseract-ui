import classNames from "classnames";
import React, {Fragment} from "react";
import {FormGroup, Classes} from "@blueprintjs/core";
import {DebugURL} from "./DebugURL";
import {RawObject} from "react-raw-object";
import ScrollArea from "react-shadow-scroll";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {TessExpl.Struct.QueryResult} result
 */

const ResultRaw = ({className, result: {data, headers, sourceCall, urlAggregate, urlLogicLayer}}) =>
  <div className={classNames("data-raw", className)}>
    <ScrollArea isShadow={false}>
      <div className="response-explorer">
        <FormGroup label="Response headers">
          <RawObject object={headers} depthExpanded={1} />
        </FormGroup>

        <FormGroup label="Response data">
          <RawObject object={data} depthExpanded={data.length > 600 ? 0 : 1} />
        </FormGroup>
      </div>
    </ScrollArea>

    <div className="debug-explorer">
      {urlLogicLayer && <FormGroup label="LogicLayer API URL">
        <DebugURL url={urlLogicLayer} />
      </FormGroup>}

      {urlAggregate && <FormGroup label="Aggregate API URL">
        <DebugURL url={urlAggregate} />
      </FormGroup>}

      {sourceCall && <FormGroup label={<Fragment>{"Javascript source for "}<a href="https://www.npmjs.com/package/@datawheel/olap-client">olap-client</a></Fragment>}>
        <pre className={classNames(Classes.CODE_BLOCK, "jscall")}>{sourceCall}</pre>
      </FormGroup>}
    </div>
  </div>;


export default ResultRaw;
