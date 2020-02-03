import React from "react";

/** @type {React.FC<{}>} */
const PanelTitle = function(props) {
  return (
    <h2 className="panel-title">{props.children}</h2>
  );
}

export default PanelTitle;
