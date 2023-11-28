import {createStyles} from "@mantine/core";

export interface CollapsiblePanelStyleParams {
  width: number;
  withBorder: boolean;
}

export const useStyles = createStyles((theme, params: CollapsiblePanelStyleParams) => ({
  paper: {
    "borderRadius": 0,
    "padding": `${theme.spacing.xs} ${theme.spacing.md}`,

    [theme.fn.largerThan("md")]: {
      height: "100%",
      padding: `${theme.spacing.sm} ${theme.spacing.xs}`,
      writingMode: "vertical-rl"
    },

    "&[data-active]": {
      [theme.fn.largerThan("md")]: {
        display: "flex",
        flexFlow: "column nowrap",
        width: params.width,
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        writingMode: "horizontal-tb"
      }
    }
  },

  toggle: {
    marginBottom: theme.spacing.sm
  },

  title: {
    textTransform: "uppercase",
    lineHeight: 1
  }
}));
