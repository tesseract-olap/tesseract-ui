import {Button, Classes, InputGroup, Menu, MenuItem} from "@blueprintjs/core";
import classNames from "classnames";
import memoizeOne from "memoize-one";
import React, {Component} from "react";
import {safeRegExp} from "../utils/transform";
import {activeItemCounter} from "../utils/validation";

import "../style/MultiSelector.scss";

class MultiSelector extends Component {
  state = {
    filter: ""
  };

  clearFilter = _ => this.setState({filter: ""});
  updateFilter = evt => this.setState({filter: evt.target.value});

  getSelected = memoizeOne((items, filter) => {
    const tester = safeRegExp(filter, "i");
    return items.filter(item => item.active && tester.test(item.name));
  });
  getUnselected = memoizeOne((items, filter) => {
    const tester = safeRegExp(filter, "i");
    return items.filter(item => !item.active && tester.test(item.name));
  });

  toggleHandler(item) {
    const key = item.key;
    const newItem = {...item, active: !item.active};
    const nextItems = this.props.items.map(item => (item.key === key ? newItem : item));
    this.props.onChange(nextItems);
  }

  render() {
    const {items} = this.props;
    const {filter} = this.state;

    const selected = this.getSelected(items, filter);
    const selectedCount = items.reduce(activeItemCounter, 0);
    const selectedHidden = selectedCount - selected.length;

    const unselected = this.getUnselected(items, filter);
    const unselectedCount = items.length - selectedCount;
    const unselectedHidden = unselectedCount - unselected.length;

    return (
      <div className="multiselector">
        <InputGroup
          className="item-filter"
          leftIcon="search"
          onChange={this.updateFilter}
          rightElement={
            filter.length > 0 && (
              <Button icon="cross" minimal={true} onClick={this.clearFilter} />
            )
          }
          placeholder="Search items..."
          type="search"
          value={filter}
        />
        <Menu className={classNames("item-list", Classes.ELEVATION_0)}>
          {unselectedHidden > 0 && (
            <Menu.Divider title={`${unselectedHidden} items hidden`} />
          )}
          {unselected.map(this.renderItem, this)}
        </Menu>
        <Menu className={classNames("item-list", Classes.ELEVATION_0)}>
          {selectedHidden > 0 && (
            <Menu.Divider title={`${selectedHidden} items hidden`} />
          )}
          {selected.map(this.renderItem, this)}
        </Menu>
      </div>
    );
  }

  renderItem(item) {
    return (
      <MenuItem
        icon={item.active ? "tick-circle" : undefined}
        key={item.key}
        onClick={this.toggleHandler.bind(this, item)}
        shouldDismissPopover={false}
        text={item.name}
      />
    );
  }
}

export default MultiSelector;
