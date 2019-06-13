import {
  Alignment,
  ButtonGroup,
  Divider,
  Navbar,
} from "@blueprintjs/core";
import React from "react";

import CubeSelector from "./SelectorCube";
import DebugButton from "./DebugButton";
import Tabs from "./Tabs";
import ThemeButton from "./ThemeButton";
import ServerStatus from "./ServerStatus";

function NavigationBar(props) {
  return (
    <Navbar className={props.className}>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>{props.title}</Navbar.Heading>
        <Navbar.Divider />
        <ServerStatus status={props.serverStatus} version={props.serverVersion} />
        <Navbar.Divider />
        <CubeSelector />
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <ButtonGroup>
          <ThemeButton />
          <DebugButton />
          <Divider />
        </ButtonGroup>
        <Tabs className="module-tabs" />
      </Navbar.Group>
    </Navbar>
  );
}

NavigationBar.defaultProps = {
  title: process.env.REACT_APP_TITLE || "tesseract-olap"
};

export default NavigationBar;
