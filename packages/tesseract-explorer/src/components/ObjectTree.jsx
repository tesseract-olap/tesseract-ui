import React from "react";
import {TreeNode} from "@blueprintjs/core";

function ObjectTree(props) {
  if (Array.isArray(props.item)) {
    return <div className="object-tree array">{JSON.stringify(item)}</div>;
  }

  if (typeof props.item === "object") {
    return <div className="object-tree object">{Object.keys}</div>;
  }
  return null;
}

export default ObjectTree;
