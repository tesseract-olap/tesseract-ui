import {Button} from "@blueprintjs/core";
import React from "react";

const mimeTypes = {
  csv: "text/csv",
  json: "application/json",
  tsv: "text/tab-separated-values",
  txt: "text/plain"
};

/**
 * @typedef {import("@blueprintjs/core").IButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>} ButtonProps
 */

/** @type {React.FC<ButtonProps & {fileText: (() => string) | string, fileName: string}>} */
const ButtonDownload = ({fileText, fileName, ...props}) =>
  <Button
    {...props}
    onClick={evt => {
      evt.stopPropagation();
      const extension = fileName.split(".").pop();
      const content = typeof fileText === "function" ? fileText() : fileText;
      const blob = new Blob([content], {
        type: mimeTypes[extension] || "application/octet-stream"
      });
      const anchor = document.createElement("a");
      anchor.href = URL.createObjectURL(blob);
      anchor.download = fileName;
      anchor.click();
    }}
  />;

export default ButtonDownload;
