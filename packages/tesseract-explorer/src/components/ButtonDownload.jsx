import {Button} from "@blueprintjs/core";
import {createElement} from "react";

/**
 * @template T
 * @typedef {T | (() => T)} ContentOrGenerator
 */

/**
 * @typedef ButtonDownloadProps
 * @property {ContentOrGenerator<TessExpl.Struct.FileDescriptor | Promise<TessExpl.Struct.FileDescriptor>>} provider
 */

const mimeTypes = {
  csv: "text/csv",
  json: "application/json",
  tsv: "text/tab-separated-values",
  txt: "text/plain",
  xls: "application/vnd.ms-excel"
};

/** @type {React.FC<BlueprintCore.ButtonProps & ButtonDownloadProps>} */
export const ButtonDownload = props => {
  const {provider, ...buttonProps} = props;

  return createElement(Button, {
    ...buttonProps,
    onClick: evt => {
      evt.stopPropagation();
      evt.preventDefault();

      const anchor = document.createElement("a");

      const content = typeof provider === "function" ? provider() : provider;
      Promise.resolve(content)
        .then(file => {
          const blob = new window.Blob([file.content], {
            type: mimeTypes[file.extension] || "application/octet-stream"
          });
          const blobURL = window.URL.createObjectURL(blob);

          anchor.href = blobURL;
          anchor.download = `${file.name}.${file.extension}`;
          anchor.addEventListener("click", () => {
            setTimeout(() => {
              window.URL.revokeObjectURL(blobURL);
            }, 5000);
          }, false);
          anchor.click();
        }, error => {
          console.error("Error downloading content:", error.message);
        });
    }
  });
};
