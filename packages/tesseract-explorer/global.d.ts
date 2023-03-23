import * as MantineCore from "@mantine/core";
import * as OlapClnt from "@datawheel/olap-client";
import * as MantineReactTable from "mantine-react-table";
import * as TesseractExplorer from "./index";

declare global {
  namespace TessExpl {
    export = TesseractExplorer;
  }
  namespace OlapClient {
    export = OlapClnt;
  }
  namespace MantineCore {
    export = MtCore;
  }
  namespace MantineReactTable {
    export = MtRtTable;
  }

  interface JSONArrays {
    headers: string[];
    data: [string, ...(number | undefined)[]][];
  }
}
