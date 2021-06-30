import * as TesseractExplorer from "../tesseract-explorer/";

declare global {
  namespace TessExpl {
    export = TesseractExplorer;
  }

  const __buildVersion: string;
}
