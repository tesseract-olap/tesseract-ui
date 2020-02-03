import {createSelector} from "reselect";
import {serializePermalink} from "../utils/permalink";
import { selectCurrentQueryParams } from "../state/params/selectors";

export const selectPermalink = createSelector(selectCurrentQueryParams, serializePermalink);
