import {Button} from "@blueprintjs/core";
import {createElement} from "react";

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
export const ButtonDownload = props => {
  const {fileText, fileName, ...restProps} = props;
  return createElement(Button, {
    ...restProps,
    onClick: evt => {
      evt.stopPropagation();
      evt.preventDefault();

      Promise.resolve()
        .then(() => typeof fileText === "function" ? fileText() : fileText)
        .then(content => {
          const extension = fileName.split(".").pop();
          const blob = new window.Blob([content], {
            type: mimeTypes[extension] || "application/octet-stream"
          });

          const anchor = document.createElement("a");
          anchor.href = window.URL.createObjectURL(blob);
          anchor.download = fileName;

          const clickHandler = () => {
            setTimeout(() => {
              window.URL.revokeObjectURL(anchor.href);
              anchor.removeEventListener("click", clickHandler);
            }, 1000);
          };
          anchor.addEventListener("click", clickHandler, false);

          anchor.click();
        });
    }
  });
};
