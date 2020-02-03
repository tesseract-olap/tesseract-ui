import {NonIdealState} from "@blueprintjs/core";
import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import AnimatedCube from "./AnimatedCube";
import ExplorerQuery from "../containers/ExplorerParams";
import ExplorerResults from "../containers/ExplorerResults";

const ExplorerContent = function({online, url, emptyDataset}) {
  if (online === false) {
    return typeof window === "object" && window.navigator.onLine === false ? (
      <NonIdealState
        className="explorer-error"
        icon="globe-network"
        title="You are not connected to the internet."
      />
    ) : (
      <NonIdealState
        className="explorer-error"
        icon="error"
        title="There's a problem contacting with the server"
        description={
          <span>
            {"Check the availability of the URL "}
            <a href={url} target="_blank" rel="noopener">
              {url}
            </a>.
          </span>
        }
      />
    );
  }
  else if (online === true) {
    return (
      <div className="explorer-content">
        <PerfectScrollbar className="explorer-params">
          <ExplorerQuery className="explorer-params-content" />
        </PerfectScrollbar>
        {emptyDataset ? (
          <NonIdealState
            className="explorer-error"
            icon="circle"
            title="The last query returned an empty dataset."
          />
        ) : (
          <ExplorerResults className="explorer-results" />
        )}
      </div>
    );
  }
  else {
    return <NonIdealState className="explorer-loading" icon={<AnimatedCube />} />;
  }
};

export default ExplorerContent;
