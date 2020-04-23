import {Button} from "@blueprintjs/core";
import React from "react";

/**
 * @typedef {import("@blueprintjs/core").IButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>} ButtonProps
 */

/**
 * @typedef OwnProps
 * @property {string} content
 * @property {string} fileName
 */


/** @type {React.FC<ButtonProps & OwnProps>} */
const ButtonDownload = ({content, fileName, ...props}) =>
  <Button
    {...props}
    onClick={evt => {
      evt.stopPropagation();
      evt.preventDefault();
      const anchor = document.createElement("a");

      if ((/^[a-z]{2,6}\:\/\//).test(content)) {
        anchor.href = content;
      }
      else {
        const mimeTypes = {
          csv: "text/csv",
          json: "application/json",
          tsv: "text/tab-separated-values",
          txt: "text/plain"
        };
        const extension = fileName.split(".").pop();
        const blob = new Blob([content], {
          type: mimeTypes[extension] || "application/octet-stream"
        });
        anchor.href = URL.createObjectURL(blob);
      }

      anchor.download = fileName;
      anchor.click();
    }}
  />;

export default ButtonDownload;
