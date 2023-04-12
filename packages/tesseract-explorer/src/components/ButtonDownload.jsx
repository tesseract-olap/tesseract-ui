import {Button, Text} from "@mantine/core";
import React, {useCallback} from "react";

/**
 * @template T
 * @typedef {T | (() => T)} ContentOrGenerator
 */

/**
 * @typedef ButtonDownloadProps
 * @property {string} children
 * @property {ContentOrGenerator<import("../utils/types").FileDescriptor | Promise<import("../utils/types").FileDescriptor>>} provider
 */

const mimeTypes = {
  csv: "text/csv",
  json: "application/json",
  tsv: "text/tab-separated-values",
  txt: "text/plain",
  xls: "application/vnd.ms-excel"
};

/** @type {React.FC<ButtonDownloadProps>} */
export const ButtonDownload = props => {
  const {provider, ...buttonProps} = props;

  const onClick = useCallback(evt => {
    evt.stopPropagation();
    evt.preventDefault();

    const anchor = document.createElement("a");
    const content = typeof provider === "function" ? provider() : provider;

    Promise.resolve(content).then(file => {
      const blob = typeof file.content !== "string"
        ? file.content
        : new window.Blob([file.content], {
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
  }, [provider]);

  return <Button
    {...buttonProps}
    fullWidth
    onClick={onClick}
    variant="default"
  >
    <Text fz="xs">
      {props.children}
    </Text>
  </Button>;
};
