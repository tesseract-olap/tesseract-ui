import {action} from "../helpers";
import {LOADING_SETMESSAGE, LOADING_SETSTATUS} from "./reducer";


/**
 * Updates the internal loading state to show or hide the overlay.
 * @template {"REQUEST" | "SUCCESS" | "FAILURE"} T
 * @param {T} status
 * @param {string} [message]
 */
export const doSetLoadingState = (status, message) =>
  action(`${LOADING_SETSTATUS}:${status}`, message);


/**
 * Shows a message to the user in the Loading overlay.
 * @param {{[params: string]: string, type: string}} message
 */
export const doSetLoadingMessage = message => action(LOADING_SETMESSAGE, message);
