import {Classes, FormGroup} from "@blueprintjs/core";
import classNames from "classnames";
import React, {Fragment} from "react";
import {RawObject} from "react-raw-object";
import {useTranslation} from "../hooks/translation";
import {DebugURL} from "./DebugURL";

/** @type {React.FC<TessExpl.ViewProps>} */
const ResultRaw = props => {
  const {headers, sourceCall, urlAggregate, urlLogicLayer} = props.result;

  const {translate: t} = useTranslation();

  const jssourceLabel =
    <Fragment>
      {t("debug_view.jssource_prefix")}
      <a href="https://www.npmjs.com/package/@datawheel/olap-client">olap-client</a>
      {t("debug_view.jssource_suffix")}
    </Fragment>;

  return (
    <div className={classNames("data-raw", props.className)}>
      {urlLogicLayer && <FormGroup className="sourceurl" label={t("debug_view.url_logiclayer")}>
        <DebugURL url={urlLogicLayer} />
      </FormGroup>}

      {urlAggregate && <FormGroup className="sourceurl" label={t("debug_view.url_aggregate")}>
        <DebugURL url={urlAggregate} />
      </FormGroup>}

      <FormGroup className="headers" label={t("debug_view.httpheaders")}>
        <RawObject object={headers} depthExpanded={1} />
      </FormGroup>

      {sourceCall && <FormGroup className="sourcecall" label={jssourceLabel}>
        <pre className={classNames(Classes.CODE_BLOCK, "jscall")}>{sourceCall}</pre>
      </FormGroup>}
    </div>
  );
};

export default ResultRaw;
