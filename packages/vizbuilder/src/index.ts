import {Translation} from "@datawheel/vizbuilder";

import "./style.css";

export {createVizbuilderView} from "./components/VizbuilderView";

declare module "@datawheel/tesseract-explorer" {
  interface TranslationDict {
    vizbuilder: Translation;
  }
}
