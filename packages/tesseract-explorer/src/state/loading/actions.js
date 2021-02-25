/**
 * Provides a quick API to dispatch actions that control the loading state of the UI.
 * @param {import("redux").Dispatch} dispatch
 * @param {import("redux").AnyAction} param1
 */
export function requestControl(dispatch, {type: trigger, ...action}) {
  return {
    fetchRequest: payload => {
      dispatch({type: `${trigger}/FETCH:REQUEST`, action, payload});
    },
    fetchSuccess: payload => {
      dispatch({type: `${trigger}/FETCH:SUCCESS`, action, payload});
    },
    fetchFailure: error => {
      console.error(error);
      dispatch({type: `${trigger}/FETCH:FAILURE`, action, payload: error.message});
    }
  };
}
