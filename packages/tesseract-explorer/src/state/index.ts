import {loadingActions} from "./loading";
import {queriesActions} from "./queries";
import {serverActions} from "./server";
import * as thunks from "./thunks";

export type {LoadingState} from "./loading";
export type {QueriesState} from "./queries";
export type {ServerState} from "./server";
export type {ExplorerState, ExplorerStore} from "./store";
export {reducer, storeFactory, thunkExtraArg, useDispatch, useSelector} from "./store";
export {loadingActions, queriesActions, serverActions, thunks};

export type ExplorerActionMap = typeof actions;

export const actions = {
  ...serverActions,
  ...loadingActions,
  ...queriesActions,
  ...thunks
};
