import {Alignment, Navbar} from "@blueprintjs/core";
import React from "react";
import NavButtons from "./NavButtons";
import CubeSelector from "./SelectorCube";
import ServerStatus from "./ServerStatus";
import Tabs from "./Tabs";

/**
 * @typedef OwnProps
 * @property {string} className
 * @property {string} title
 */

/** @type {React.FC<OwnProps>} */
const NavigationBar = function (props) {
  return (
    <Navbar className={props.className}>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>{props.title}</Navbar.Heading>
        <Navbar.Divider />
        <ServerStatus />
        <Navbar.Divider />
        <CubeSelector
          noOptionsText="Loading cubes..."
          noSelectedText="No cube selected"
        />
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <NavButtons />
        <Navbar.Divider />
        <Tabs className="module-tabs" />
      </Navbar.Group>
    </Navbar>
  );
}

NavigationBar.defaultProps = {
  title: process.env.REACT_APP_TITLE || "tesseract-olap"
};

export default NavigationBar;
