import {Text} from "@mantine/core";
import React, {useMemo} from "react";

/**
 * Parses markdown-style emphasis and anchors in a string into hydrated React components.
 */
export function Anchorify(props: {
  text: string;
  Anchor?: React.ComponentType<{href: string}>;
}) {
  const {text, Anchor = "a"} = props;

  const result = useMemo(() => {
    const finder = /\[([^\]]+)\]\(([^)]+)\)|\*([^*\n]+)\*|\*\*([^*\n]+)\*\*/g;
    const queue: React.ReactNode[] = [];

    let index = 0;
    while (true) {
      const token = finder.exec(text);
      if (!token) break;

      const string = text.slice(index, token.index);
      queue.push(
        <Text span key={string}>
          {string}
        </Text>
      );

      index = token.index + token[0].length;
      if (token[0].startsWith("**")) {
        queue.push(
          <Text key={token[0]} span fw={700}>
            {token[1]}
          </Text>
        );
      }
      else if (token[1].startsWith("*")) {
        queue.push(
          <Text key={token[0]} span fs="italic">
            {token[1]}
          </Text>
        );
      }
      else {
        queue.push(
          <Anchor key={token[0]} href={token[2]}>
            {token[1]}
          </Anchor>
        );
      }
    }

    const string = text.slice(index);
    queue.push(<Text key={string}>{string}</Text>);

    return queue;
  }, [text, Anchor]);

  return <>{result}</>;
}
