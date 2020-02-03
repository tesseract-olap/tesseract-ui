import {Button, Classes, InputGroup, Menu, MenuItem} from "@blueprintjs/core";
import classNames from "classnames";
import memoizeOne from "memoize-one";
import React, {Component} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import ViewPortList from "react-viewport-list";
import {safeRegExp} from "../utils/transform";
import {activeItemCounter} from "../utils/validation";

import "../style/TransferInput.scss";

/**
 * @template T
 * @typedef OwnProps
 * @property {T[]} items
 * @property {(items: T[]) => void} onChange
 */

/**
 * @template {IQueryItem} T
 * @extends {Component<OwnProps<T>>}
 */
class TransferInput extends Component {
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
    const nextItems = this.props.items.map(item => item.key === key ? newItem : item);
    this.props.onChange(nextItems);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.items !== this.props.items;
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

    const rightElement =
      filter.length > 0
        ? <Button icon="cross" minimal={true} onClick={this.clearFilter} />
        : undefined;

    return (
      <div className="multiselector">
        <InputGroup
          className="item-filter"
          leftIcon="search"
          onChange={this.updateFilter}
          placeholder="Search items..."
          rightElement={rightElement}
          type="search"
          value={filter}
        />
        <Menu className={classNames("item-list", Classes.ELEVATION_0)}>
          <PerfectScrollbar>
            {unselectedHidden > 0 &&
              <Menu.Divider title={`${unselectedHidden} items hidden`} />
            }
            <ViewPortList listLength={unselected.length} itemMinHeight={30}>
              {params => this.renderItem.call(this, unselected[params.index], params)}
            </ViewPortList>
          </PerfectScrollbar>
        </Menu>
        <Menu className={classNames("item-list", Classes.ELEVATION_0)}>
          <PerfectScrollbar>
            <React.Fragment>
              {selectedHidden > 0 &&
                <Menu.Divider title={`${selectedHidden} items hidden`} />
              }
              {selected.map(this.renderItem, this)}
            </React.Fragment>
          </PerfectScrollbar>
        </Menu>
      </div>
    );
  }

  /** @type {(item: T, p1: {innerRef: any, index: number, style: any}) => JSX.Element} */
  renderItem(item, {innerRef, index, style}) {
    return <MenuItem
      itemRef={innerRef}
      style={style}
      icon={item.active ? "tick-circle" : undefined}
      key={item.key}
      onClick={this.toggleHandler.bind(this, item)}
      shouldDismissPopover={false}
      text={item.name || item.property}
    />;
  }
}

export default TransferInput;
