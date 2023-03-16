import React from "react";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
export const AnimatedCube = props =>
  <svg
    className={`animated-cube ${props.className}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
  >
    <path className="a" d="M128 128v128l111 -64v-128l-111 64z" />
    <path className="b" d="M128 128l111 -64l-111 -64l-111 64l111 64z" />
    <path className="c" d="M128 128l-111 -64v128l111 64v-128z" />
    <path className="a" d="M128 128v-64l-55 32v64l55 -32z"/>
    <path className="b" d="M128 128l-55 32l55 32l55 -32l-55 -32z" />
    <path className="c" d="M128 128l55 32v-64l-55 -32v64z"/>
  </svg>;
