import {createSelector} from "reselect";
import {serializePermalink} from "../utils/permalink";
import {selectQueryState} from "./state";

export const selectPermalink = createSelector(selectQueryState, serializePermalink);
