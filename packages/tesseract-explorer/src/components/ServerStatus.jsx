import React from "react";
import {Intent, AnchorButton} from "@blueprintjs/core";

function ServerStatus(props) {
  if (props.status === "ok") {
    return (
      <AnchorButton
        intent={Intent.SUCCESS}
        minimal={true}
        text={`Running tesseract v${props.version}`}
      />
    );
  }
  if (props.status === "unavailable") {
    return (
      <AnchorButton
        intent={Intent.WARNING}
        minimal={true}
        text={`Running tesseract v${props.version}`}
      />
    );
  }
  return <AnchorButton disabled={true} text="Retrieving server info..." />;
}

export default ServerStatus;
