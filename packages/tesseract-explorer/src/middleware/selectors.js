import {createSelector} from "reselect";
import {selectCurrentQueryParams} from "../state/params/selectors";
import {serializePermalink} from "../utils/permalink";

export const selectPermalink = createSelector(selectCurrentQueryParams, serializePermalink);
