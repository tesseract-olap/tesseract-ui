import * as BpjsCore from "@blueprintjs/core";
import * as BpjsSelect from "@blueprintjs/select";
import * as OlapClnt from "@datawheel/olap-client";
import * as TesseractExplorer from "./index";

declare global {
  namespace TessExpl {
    export = TesseractExplorer;
  }
  namespace OlapClient {
    export = OlapClnt;
  }
  namespace BlueprintCore {
    export = BpjsCore;
  }
  namespace BlueprintSelect {
    export = BpjsSelect;
  }

  interface JSONArrays {
    headers: string[];
    data: [string, ...(number | undefined)[]][];
  }

  const __buildVersion: string;
}
