import {GlobalStyles, MantineProvider} from "@mantine/core";
import React from "react";
import {Workbench} from "./Workbench";

export const WorkbenchApp = props =>
  <MantineProvider theme={props.theme}>
    <GlobalStyles />
    <Workbench {...props} />
  </MantineProvider>;
