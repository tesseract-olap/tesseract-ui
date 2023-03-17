import * as MantineCore from "@mantine/core";
import * as OlapClnt from "@datawheel/olap-client";
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

  interface JSONArrays {
    headers: string[];
    data: [string, ...(number | undefined)[]][];
  }

  const __buildVersion: string;
}
