import * as TesseractExplorer from "@datawheel/tesseract-explorer";

declare global {
  namespace TsExplorer {
    export = TesseractExplorer;
  }

  namespace TsDirector {}
}
