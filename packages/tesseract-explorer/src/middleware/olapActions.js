import {action} from "../state/helpers";
import {CLIENT_SELECTCUBE, CLIENT_DOWNLOADQUERY, CLIENT_EXECUTEQUERY, CLIENT_FETCHMEMBERS, CLIENT_FILLPARAMS, CLIENT_PARSEQUERYURL, CLIENT_RELOADCUBES, CLIENT_SETUPSERVER} from "./olapEffectors";


/**
 * @param {string} format
 */
export const willDownloadQuery = format => action(CLIENT_DOWNLOADQUERY, format);

/**
 * Orders the middleware to take the current parameters and query the
 * OLAP server for data with them.
 */
export const willExecuteQuery = () => action(CLIENT_EXECUTEQUERY);

/**
 * Requests the public schema for the data in the server configured in the store
 * and replaces all source information with the response.
 */
export const willReloadCubes = () => action(CLIENT_RELOADCUBES);

/**
 * @param {TessExpl.Struct.LevelReference} levelRef
 */
export const willFetchMembers = levelRef => action(CLIENT_FETCHMEMBERS, levelRef);

/**
 * Checks the state of the current QueryParams and fills missing information.
 * @param {string} [cubeName]
 */
export const willHydrateParams = cubeName => action(CLIENT_FILLPARAMS, cubeName);

/**
 * @param {string | URL} url
 */
export const willParseQueryUrl = url => action(CLIENT_PARSEQUERYURL, url.toString());

/**
 * @param {string} cubeName
 */
export const willSetCube = cubeName => action(CLIENT_SELECTCUBE, cubeName);

/**
 * Setups data server configuration on the global client instance.
 * @param {OlapClient.ServerConfig} serverConfig
 */
export const willSetupClient = serverConfig => action(CLIENT_SETUPSERVER, serverConfig);
