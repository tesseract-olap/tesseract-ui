import { WorkbenchProps } from "./src/components/Workbench";

export = TesseractWorkbench;

declare namespace TesseractWorkbench {
  export const Workbench: React.FC<WorkbenchProps>;

  interface CubeItem {
    key: string;
    name: string;
    isPublic: boolean;
    table_name: string;
    dimensions: string[];
    dimension_usages: string[];
    measures: string[];
    annotations: Record<string, string>;
  }
}
