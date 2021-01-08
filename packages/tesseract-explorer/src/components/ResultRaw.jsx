import classNames from "classnames";
import React, {Fragment} from "react";
import {FormGroup, Classes} from "@blueprintjs/core";
import {DebugURL} from "./DebugURL";
import {RawObject} from "react-raw-object";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {TessExpl.Struct.QueryResult} result
 */

const ResultRaw = ({className, result: {data, headers, sourceCall, urlAggregate, urlLogicLayer}}) =>
  <div className={classNames("data-raw", className)}>
    {urlLogicLayer && <FormGroup className="sourceurl" label="LogicLayer API URL">
      <DebugURL url={urlLogicLayer} />
    </FormGroup>}

    {urlAggregate && <FormGroup className="sourceurl" label="Aggregate API URL">
      <DebugURL url={urlAggregate} />
    </FormGroup>}

    <FormGroup className="headers" label="Response headers">
      <RawObject object={headers} depthExpanded={1} />
    </FormGroup>

    {sourceCall && <FormGroup className="sourcecall" label={<Fragment>{"Javascript source for "}<a href="https://www.npmjs.com/package/@datawheel/olap-client">olap-client</a></Fragment>}>
      <pre className={classNames(Classes.CODE_BLOCK, "jscall")}>{sourceCall}</pre>
    </FormGroup>}
  </div>;


export default ResultRaw;
