import React from "react";
import { ViewProps } from "@datawheel/tesseract-explorer";
import { VizbuilderProps } from "@datawheel/vizbuilder";

export type VizbuilderViewProps = ViewProps &
  Omit<VizbuilderProps, "queries"> & {
    formatters: Record<string, (value: number) => string>;
  };

const VizbuilderView: React.FC<VizbuilderViewProps>;

export default VizbuilderView;
