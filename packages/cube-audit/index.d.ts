import * as OlapClient from "@datawheel/olap-client";

export = CubeAudit;

declare namespace CubeAudit {
  const auditorFactory: (options: AuditorFactoryOptions) => Promise<Auditor>;

  const auditServer: (
    server: OlapClient.ServerConfig,
    callback?: (report: CubeReport) => void
  ) => Promise<AuditorResult>;

  interface AuditorFactoryOptions {
    loggingLevel: "debug" | "info" | "error";
    server: OlapClient.ServerConfig;
  }

  interface Auditor {
    (callback?: (report: CubeReport) => void): Promise<AuditorResult>;
  }

  interface AuditorResult {
    date: string;
    server: OlapClient.ServerStatus;
    cubes?: CubeReport[];
  }

  interface CubeReport {
    /**
     * The name of the cube this report refers to.
     */
    name: string;
    /**
     * The total amount of issues
     */
    issueCount: number;
    /**
     * The list of issues related to this cube overall
     */
    cubeIssues: Issue[];
    /**
     * The list of issues related to this cube's dimensions
     */
    dimensionIssues: Issue[];
    /**
     * The list of issues related to this cube's measures
     */
    measureIssues: Issue[];
  }

  interface Issue {
    /**
     * A text explaining the issue, and optionally a way to solve it.
     */
    description: string;
    /**
     * The object in the cube abstraction with the problem.
     */
    entity: string;
    /**
     * The priority level of the problem.
     */
    level: string;
    /**
     * The name of the object in the abstraction.
     */
    name: string;
    /**
     * The action to take to solve the problem.
     */
    solution?: string;
  }
}
