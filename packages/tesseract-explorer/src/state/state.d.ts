interface ExplorerState {
  explorerLoading: LoadingState;
  explorerQueries: QueriesState;
  explorerServer: ServerState;
  explorerUi: UiState;
}

interface LoadingState {
  error: string | null;
  loading: boolean;
  status: string;
  trigger: string | null;
}

interface QueriesState {
  current: string;
  itemMap: Record<string, QueryItem>;
}

interface ServerState {
  cubeMap: Record<string, OlapCube>;
  endpoint: string;
  localeOptions: string[];
  online: boolean | undefined;
  software: string;
  url: string;
  version: string;
}

interface UiState {
  darkTheme: boolean;
  debugDrawer: boolean;
  starredDrawer: boolean;
}
