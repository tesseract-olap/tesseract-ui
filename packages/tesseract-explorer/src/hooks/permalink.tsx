import {useEffect, useMemo} from "react";
import {queriesSlice, selectCurrentQueryItem} from "../state/queries";
import {selectOlapCubeMap} from "../state/server";
import {ExplorerStore} from "../state/store";
import {serializePermalink} from "../utils/permalink";

/** */
export function usePermalink(enabled: boolean | undefined, store: ExplorerStore) {
  const state = store.getState();
  const cubeMap = selectOlapCubeMap(state);
  const {params, isDirty} = selectCurrentQueryItem(state);

  const listener = useMemo(() => (evt: PopStateEvent) => {
    evt.state && store.dispatch(queriesSlice.actions.resetAllParams(evt.state));
  }, [store]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (enabled) {
      window.addEventListener("popstate", listener);
      return () => window.removeEventListener("popstate", listener);
    }
  }, []);

  useEffect(() => {
    // We want to update the Permalink only when we are sure the current Query
    // is successful: this is when `isDirty` changes from `false` to `true`
    if (!enabled || isDirty === true || cubeMap[params.cube] == null) return;

    const nextPermalink = serializePermalink(params);

    if (window.location.search.slice(1) !== nextPermalink) {
      const nextLocation = `${window.location.pathname}?${nextPermalink}`;
      window.history.pushState(params, "", nextLocation);
    }
  }, [cubeMap, isDirty]);

  return null;
}
