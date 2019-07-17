import {Tag} from "@blueprintjs/core";
import React, {Component} from "react";

class TagMultiSelector extends Component {
  toggleHandler(item) {
    const key = item.key;
    const newItem = {...item, active: !item.active};
    const nextItems = this.props.items.map(item => (item.key === key ? newItem : item));
    this.props.onChange(nextItems);
  }

  render() {
    const {itemRenderer, items} = this.props;
    const internalRenderer = item =>
      itemRenderer(item, {
        active: item.active,
        handleClick: this.toggleHandler.bind(this, item)
      });
    return <div className="tag-multiselect">{items.map(internalRenderer)}</div>;
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
