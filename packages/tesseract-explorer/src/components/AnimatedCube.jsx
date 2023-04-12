import React from "react";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {number} [height]
 */

/** @type {React.FC<OwnProps>} */
export const AnimatedCube = props =>
  <svg
    className={`animated-cube ${props.className || " "}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    height={props.height ?? 256}
  >
    <style>{`\
@keyframes color-shift {
  0%, 100% { fill: var(--anicube-color1) }
  33% { fill: var(--anicube-color2) }
  66% { fill: var(--anicube-color3) }
}
.animated-cube {
  --anicube-color1: #5c7080;
  --anicube-color2: #738694;
  --anicube-color3: #8a9ba8;
  --anicube-play-state: running;
}
.animated-cube path {
  animation: color-shift 2.4s infinite;
  animation-play-state: var(--anicube-play-state);
}
.animated-cube .a {
  fill: var(--anicube-color3);
}
.animated-cube .b {
  fill: var(--anicube-color1);
  animation-delay: 0.8s;
}
.animated-cube .c {
  fill: var(--anicube-color2);
  animation-delay: 1.6s;
}
`}</style>
    <path className="a" d="M128 128v128l111 -64v-128l-111 64z" />
    <path className="b" d="M128 128l111 -64l-111 -64l-111 64l111 64z" />
    <path className="c" d="M128 128l-111 -64v128l111 64v-128z" />
    <path className="a" d="M128 128v-64l-55 32v64l55 -32z"/>
    <path className="b" d="M128 128l-55 32l55 32l55 -32l-55 -32z" />
    <path className="c" d="M128 128l55 32v-64l-55 -32v64z"/>
  </svg>;
