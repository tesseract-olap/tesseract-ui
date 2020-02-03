/**
 * Retrieves all the strings to configure typings in the monaco editor instance.
 */
export function fetchTypings() {
  return Promise.all([
    // @ts-ignore
    import("../assets/d3plus-common.d.ts"),
    // @ts-ignore
    import("../assets/d3plus-format.d.ts"),
    // @ts-ignore
    import("../assets/d3plus-text.d.ts"),
    // @ts-ignore
    import("../assets/d3plus-legend.d.ts"),
    // @ts-ignore
    import("../assets/d3plus-timeline.d.ts"),
    // @ts-ignore
    import("../assets/d3plus-hierarchy.d.ts"),
    // @ts-ignore
    import("../assets/d3plus-viz.d.ts"),
    // @ts-ignore
    import("../assets/d3plus-react.d.ts")
  ]).then(results => results.map(r => ({content: r.default})));
}
