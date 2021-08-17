import {Col, GlobalStyles, Grid, MantineProvider, theming} from "@mantine/core";
import clsx from "clsx";
import React from "react";
import { createUseStyles } from "react-jss";
import {PanelTree} from "./PanelTree";

/**
 * @typedef WorkbenchProps
 * @property {string} [className]
 * @property {Partial<import("@mantine/core").MantineTheme>} [theme]
 */

/** @type {React.FC<WorkbenchProps>} */
export const Workbench = props => {
  const {} = props;

  const styles = useStyles()

  return (
    <Grid className={clsx("workbench-wrapper", props.className)}>
      <Col span={4}>
        <PanelTree />
      </Col>
      <Col span={8}>
        <div className="workbench-details"></div>
      </Col>
    </Grid>
  );
};

const useStyles = createUseStyles(theme => ({
  "workbench-wrapper": {
    background: theme.colors
  }
}), {theming});
