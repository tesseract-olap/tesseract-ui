import {loadingActions} from "./loading";
import {queriesActions} from "./queries";
import {serverActions} from "./server";
import * as thunks from "./thunks";

export {LoadingState} from "./loading";
export {QueriesState} from "./queries";
export {ServerState} from "./server";
export {ExplorerState, ExplorerStore, reducer, storeFactory, thunkExtraArg, useDispatch, useSelector} from "./store";
export {loadingActions, queriesActions, serverActions, thunks};

export type ExplorerActionMap = typeof actions;

export const actions = {
  ...serverActions,
  ...loadingActions,
  ...queriesActions,
  ...thunks
};
