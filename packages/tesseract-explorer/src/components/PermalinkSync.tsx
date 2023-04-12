import {useEffect, useRef} from "react";
import {useActions} from "../hooks/settings";
import {selectCurrentQueryItem} from "../state/queries";
import {selectOlapCubeMap} from "../state/server";
import {useSelector} from "../state/store";
import {serializePermalink} from "../utils/permalink";

/** */
export function PermalinkSync() {
  const actions = useActions();

  const cubeMap = useSelector(selectOlapCubeMap);
  const {params, isDirty} = useSelector(selectCurrentQueryItem);

  const listener = useRef((evt: PopStateEvent) => {
    evt.state && actions.resetAllParams(evt.state);
  });

  useEffect(() => {
    window.addEventListener("popstate", listener.current);
    () => window.removeEventListener("popstate", listener.current);
  }, []);

  useEffect(() => {
    // We want to update the Permalink only when we are sure the current Query
    // is successful: this is when `isDirty` changes from `false` to `true`
    if (isDirty === true || cubeMap[params.cube] == null) return;

    const nextPermalink = serializePermalink(params);

    if (window.location.search.slice(1) !== nextPermalink) {
      const nextLocation = `${window.location.pathname}?${nextPermalink}`;
      window.history.pushState(params, "", nextLocation);
    }
  }, [cubeMap, isDirty]);

  return null;
}
