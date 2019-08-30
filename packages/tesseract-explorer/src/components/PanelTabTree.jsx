import {InputGroup, Tree} from "@blueprintjs/core";
import classNames from "classnames";
import React, {PureComponent} from "react";
import {safeRegExp} from "../utils/format";

const VISIBLE_AMOUNT = 50;

/**
 * @typedef OwnState
 * @property {RegExp} filterExpression
 */

/**
 * @augments {PureComponent<import("../reducers/aggregationReducer").AggregationState & {className?: string}, OwnState>}
 */
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

    const dataKeys = Object.keys(data[0] || {});
    const filteredData = data.reduce((target, item, index) => {
      const show = dataKeys.some(key => filterExpression.test(`${item[key]}`));
      if (show) target.push({index, item});
      return target;
    }, []);

    const dataToShow = filteredData.slice(0, VISIBLE_AMOUNT);
    const contentTree = jsonToContentTree(dataToShow);
    if (filteredData.length > VISIBLE_AMOUNT) {
      contentTree.push({
        id: "root-more",
        icon: "more",
        label: `And other ${filteredData.length - VISIBLE_AMOUNT} elements`
      });
    }

    return (
      <div className={classNames("data-tree", className)}>
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
  return Object.keys(root).map((key, index) => {
    let item = root[key];
    if (typeof item === "object") {
      if ("index" in item && "item" in item) {
        index = item.index;
        item = item.item;
      }
      const id = `${parent}.${index}`;
      return {
        childNodes: jsonToContentTree(item, id),
        hasCaret: false,
        icon: "folder-open",
        id,
        isExpanded: true,
        label: index || key
      };
    }
    return {
      id: `${parent}.${key}`,
      icon: typeof item === "number" ? "numerical" : "tag",
      label: (
        <span className="tree-struct">
          <span className="tree-key">{key}</span>
          <span className="tree-value">{item}</span>
        </span>
      )
    };
  });
}

export default TreeTabPanel;
