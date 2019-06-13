import {InputGroup, Tree} from "@blueprintjs/core";
import cn from "classnames";
import React, {PureComponent} from "react";

import {safeRegExp} from "../utils/format";

class TreeTabPanel extends PureComponent {
  state = {
    filterExpression: /./i
  };

  filterQueryUpdateHandler = evt => {
    const pattern = evt.target.value || "";
    const filterExpression = pattern ? safeRegExp(pattern, "i") : /./i;
    this.setState({filterExpression});
  };

  render() {
    const {className, data} = this.props;
    const {filterExpression} = this.state;

    const filteredData = data.filter(item =>
      Object.keys(item).some(key => filterExpression.test(`${item[key]}`))
    );

    const dataToShow = filteredData.slice(0, 30);
    const contentTree = jsonToContentTree(dataToShow);
    if (filteredData.length > 30) {
      contentTree.push({
        id: "root-more",
        icon: "more",
        label: `And other ${filteredData.length - 30} elements`
      });
    }

    return (
      <div className={cn("data-tree", className)}>
        <InputGroup
          className="tree-filter"
          leftIcon="search"
          onChange={this.filterQueryUpdateHandler}
          placeholder="Find object..."
          type="search"
        />
        <Tree className="tree-content" contents={contentTree} />
      </div>
    );
  }
}

function jsonToContentTree(root, parent) {
  parent = parent || "root";
  return Object.keys(root).map(key => {
    const value = root[key];
    const id = `${parent}.${key}`;
    if (typeof value === "object") {
      return {
        childNodes: jsonToContentTree(value, id),
        hasCaret: false,
        icon: "folder-open",
        id,
        isExpanded: true,
        label: key
      };
    }
    return {
      id,
      icon: typeof value === "number" ? "numerical" : "tag",
      label: (
        <span className="tree-struct">
          <span className="tree-key">{key}</span>
          <span className="tree-value">{value}</span>
        </span>
      )
    };
  });
}

export default TreeTabPanel;
