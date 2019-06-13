import React from "react";
import cn from "classnames";

function RawTabPanel(props) {
  let output = "[]";

  if (props.data) {
    if (props.data.length > 30) {
      const slicedData = props.data.slice(0, 20);
      const remainingLength = props.data.length - 20;
      output = JSON.stringify(slicedData, null, 4).replace(
        "}\n]",
        `},\n    {...and other ${remainingLength} items}\n]`
      );
    }
    else {
      output = JSON.stringify(props.data, null, 4);
    }
  }

  return (
    <div className={cn("data-raw", props.className)}>
      <pre className="bp3-code-block code-block">{output}</pre>
    </div>
  );
}

export default RawTabPanel;
