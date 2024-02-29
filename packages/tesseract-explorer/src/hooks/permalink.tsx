import {useCallback, useEffect} from "react";
import {selectCurrentQueryItem} from "../state/queries";
import {selectOlapCubeMap} from "../state/server";
import {useSelector} from "../state/store";
import {serializePermalink} from "../utils/permalink";
import {QueryParams} from "../utils/structs";

/** */
export function usePermalink(
  isEnabled: boolean | undefined,
  options: {
    onChange(state: Partial<QueryParams>): void;
  }
) {
  const cubeMap = useSelector(selectOlapCubeMap);
  const {isDirty, panel, params} = useSelector(selectCurrentQueryItem);

  const listener = useCallback((evt: PopStateEvent) => {
    evt.state && options.onChange(evt.state);
  }, [options.onChange]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isEnabled) {
      window.addEventListener("popstate", listener);
      return () => window.removeEventListener("popstate", listener);
    }
  }, [isEnabled]);

  useEffect(() => {
    // We want to update the Permalink only when we are sure the current Query
    // is successful: this is when `isDirty` changes from `false` to `true`
    if (!isEnabled || isDirty || cubeMap[params.cube] == null) return;

    const currPermalink = window.location.search.slice(1);
    const nextPermalink = serializePermalink(params, panel);

    if (currPermalink !== nextPermalink) {
      const nextLocation = `${window.location.pathname}?${nextPermalink}`;
      const oldPanel = new URLSearchParams(window.location.search).get("panel");
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
