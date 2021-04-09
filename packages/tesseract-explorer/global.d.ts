import * as TesseractExplorer from "./index";

declare global {
  declare namespace TessExpl {
    export = TesseractExplorer;
  }
}
