import {Alignment, Navbar} from "@blueprintjs/core";
import React from "react";
import ServerStatus from "../containers/ServerStatus";
import NavButtons from "./NavButtons";

/**
 * @typedef OwnProps
 * @property {string} className
 * @property {string|undefined} title
 */

/** @type {React.FC<OwnProps>} */
const NavigationBar = function(props) {
  return (
    <Navbar className={props.className}>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>{props.title}</Navbar.Heading>

        <Navbar.Divider />

        <ServerStatus />
      </Navbar.Group>

      <Navbar.Group align={Alignment.RIGHT}>
        <NavButtons />
      </Navbar.Group>
    </Navbar>
  );
};

export default NavigationBar;
