import {useEffect, useMemo} from "react";
import {queriesSlice, selectCurrentQueryItem} from "../state/queries";
import {selectOlapCubeMap} from "../state/server";
import {useDispatch, useSelector} from "../state/store";
import {serializePermalink} from "../utils/permalink";

/** */
export function usePermalink(enabled: boolean | undefined) {
  const cubeMap = useSelector(selectOlapCubeMap);
  const {isDirty, panel, params} = useSelector(selectCurrentQueryItem);
  const dispatch = useDispatch();

  const listener = useMemo(() => (evt: PopStateEvent) => {
    evt.state && dispatch(queriesSlice.actions.resetAllParams(evt.state));
  }, []);

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
    if (!enabled || isDirty || cubeMap[params.cube] == null) return;

    const currPermalink = window.location.search.slice(1);
    const nextPermalink = serializePermalink(params, panel);

    if (currPermalink !== nextPermalink) {
      const nextLocation = `${window.location.pathname}?${nextPermalink}`;
      const oldPanel = (/[&]?panel=([\w\d-]+)[&]?/).exec(currPermalink);
      // If only the panel changed, use replaceState
      if (oldPanel && oldPanel[1] !== panel) {
        window.history.replaceState(params, "", nextLocation);
      }
      else {
        window.history.pushState(params, "", nextLocation);
      }
    }
  }, [cubeMap, isDirty, panel]);

  return null;
}
