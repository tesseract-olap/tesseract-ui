import common from "../assets/d3plus-common.d.ts";
import format from "../assets/d3plus-format.d.ts";
import text from "../assets/d3plus-text.d.ts";
import legend from "../assets/d3plus-legend.d.ts";
import timeline from "../assets/d3plus-timeline.d.ts";
import hierarchy from "../assets/d3plus-hierarchy.d.ts";
import viz from "../assets/d3plus-viz.d.ts";
import react from "../assets/d3plus-react.d.ts";

/**
 * Retrieves all the strings to configure typings in the monaco editor instance.
 */
export function fetchTypings() {
  return Promise.all([
    {content: common},
    {content: format},
    {content: text},
    {content: legend},
    {content: timeline},
    {content: hierarchy},
    {content: viz},
    {content: react}
  ]);
}
