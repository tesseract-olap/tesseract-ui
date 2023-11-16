import {MantineColor, createStyles, keyframes, useComponentDefaultProps} from "@mantine/core";
import React from "react";

export interface AnicubeStylesParams {
  color?: MantineColor;
  shade: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

const colorShift = keyframes({
  "from, to": {
    fill: "var(--anicube-color1, #5c7080)"
  },
  "33%": {
    fill: "var(--anicube-color2, #738694)"
  },
  "66%": {
    fill: "var(--anicube-color3, #8a9ba8)"
  }
});

const useStyles = createStyles((theme, {color, shade}: AnicubeStylesParams) => {
  const vars = color ? {
    "--anicube-color1": theme.colors[color][shade - 1],
    "--anicube-color2": theme.colors[color][shade],
    "--anicube-color3": theme.colors[color][shade + 1]
  } : undefined;
  return {
    root: {
      ...vars,
      display: "block"
    },
    side: {
      "animation": `${colorShift} var(--anicube-duration, 2.4s) infinite`,
      "animationPlayState": "var(--anicube-play-state, running)",

      "@media (prefers-reduced-motion)": {
        "--anicube-play-state": "paused"
      },
      "&.a": {
        fill: "var(--anicube-color1, #5c7080)"
      },
      "&.b": {
        fill: "var(--anicube-color2, #738694)",
        animationDelay: "0.8s"
      },
      "&.c": {
        fill: "var(--anicube-color3, #8a9ba8)",
        animationDelay: "1.6s"
      }
    }
  };
});

const defaultProps = {
  shade: 5
} as const;

/** */
export function AnimatedCube(props: Partial<AnicubeStylesParams> & {
  size?: number
}) {
  const {color, shade} = useComponentDefaultProps(AnimatedCube.displayName, defaultProps, props);
  const {classes, cx} = useStyles({color, shade});

  return (
    <svg
      className={cx("dataex-Anicube-root", classes.root)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      height={props.size || 256}
    >
      <path className={cx("dataex-Anicube-side", classes.side, "a")} d="M128 128v128l111 -64v-128l-111 64z" />
      <path className={cx("dataex-Anicube-side", classes.side, "b")} d="M128 128l111 -64l-111 -64l-111 64l111 64z" />
      <path className={cx("dataex-Anicube-side", classes.side, "c")} d="M128 128l-111 -64v128l111 64v-128z" />
      <path className={cx("dataex-Anicube-side", classes.side, "a")} d="M128 128v-64l-55 32v64l55 -32z"/>
      <path className={cx("dataex-Anicube-side", classes.side, "b")} d="M128 128l-55 32l55 32l55 -32l-55 -32z" />
      <path className={cx("dataex-Anicube-side", classes.side, "c")} d="M128 128l55 32v-64l-55 -32v64z"/>
    </svg>
  );
}

AnimatedCube.displayName = "DataExplorer/Anicube";
