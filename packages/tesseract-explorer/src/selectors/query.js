import {createSelector} from "reselect";
import {selectUiState} from "./state";
import ISO6391 from "iso-639-1";

export const selectLocaleOptions = createSelector(selectUiState, ui =>
  ISO6391.getLanguages(ui.localeOptions).map(locale => ({
    label: locale.nativeName,
    value: locale.code
  }))
);
