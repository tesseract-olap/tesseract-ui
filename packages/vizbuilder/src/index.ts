import {Translation} from "@datawheel/vizbuilder";

export {createVizbuilderView} from "./components/VizbuilderView";

declare module "@datawheel/tesseract-explorer" {
  interface TranslationDict {
    vizbuilder: Translation;
  }
}
