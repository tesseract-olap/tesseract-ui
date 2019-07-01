import React from "react";
import {Intent, AnchorButton} from "@blueprintjs/core";

function ServerStatus(props) {
  if (props.status === "ok") {
    return (
      <AnchorButton
        intent={Intent.SUCCESS}
        minimal={true}
        tabIndex={null}
        text={`Running tesseract v${props.version}`}
      />
    );
  }
  if (props.status === "unavailable") {
    return (
      <AnchorButton
        intent={Intent.WARNING}
        minimal={true}
        tabIndex={null}
        text="Server unavailable"
      />
    );
  }
  return (
    <AnchorButton disabled={true} tabIndex={null} text="Retrieving server info..." />
  );
}

export default ServerStatus;
