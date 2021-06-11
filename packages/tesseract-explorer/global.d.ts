import * as BpjsCore from "@blueprintjs/core";
import * as BpjsSelect from "@blueprintjs/select";
import * as OlapClnt from "@datawheel/olap-client";
import * as TesseractExplorer from "./index";

declare global {
  declare namespace TessExpl {
    export = TesseractExplorer;
  }
  declare namespace OlapClient {
    export = OlapClnt;
  }
  declare namespace BlueprintCore {
    export = BpjsCore;
  }
  declare namespace BlueprintSelect {
    export = BpjsSelect;
  }

  interface JSONArrays {
    headers: string[];
    data: [string, ...(number | undefined)[]][];
  }
}
