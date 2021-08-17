import TesseractWorkbench from "./index";

declare global {
  namespace TessBench {
    export = TesseractWorkbench;
  }
}
