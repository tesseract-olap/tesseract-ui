import React from "react";
import {Tag} from "@blueprintjs/core";
import {toggleFromArray} from "../utils/array";

class TagMultiSelector extends React.Component {
  toggleHandler(item) {
    const nextActiveItems = toggleFromArray(this.props.activeItems, item);
    nextActiveItems.sort((a, b) => `${a.key}`.localeCompare(`${b.key}`));
    this.props.onChange(nextActiveItems);
  }

  render() {
    const {activeItems, itemRenderer, items} = this.props;
    const nonActiveItems = items.filter(item => !activeItems.includes(item));
    const internalRenderer = item =>
      itemRenderer(item, {
        active: activeItems.includes(item),
        handleClick: this.toggleHandler.bind(this, item)
      });
    return (
      <div className="tag-multiselect">
        {[].concat(activeItems, nonActiveItems).map(internalRenderer)}
      </div>
    );
  }
}

TagMultiSelector.defaultProps = {
  itemRenderer(item, {active, handleClick}) {
    return (
      <Tag
        active={active}
        fill={true}
        icon={active ? "tick-circle" : "circle"}
        interactive={true}
        key={item.key || item.name}
        onClick={handleClick}
      >
        {item.name || item.key}
      </Tag>
    );
  }
};

export default TagMultiSelector;
