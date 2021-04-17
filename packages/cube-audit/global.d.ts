import * as OlapClnt from "@datawheel/olap-client";
import * as CubeAudit from ".";

declare global {
  declare namespace OlapClient {
    export = OlapClnt;
  }

  interface AuditorFactoryOptions extends CubeAudit.AuditorFactoryOptions {}

  interface Auditor extends CubeAudit.Auditor {}
  interface AuditorResult extends CubeAudit.AuditorResult {}

  interface CubeReport extends CubeAudit.CubeReport {}
  interface Issue extends CubeAudit.Issue {}
}
