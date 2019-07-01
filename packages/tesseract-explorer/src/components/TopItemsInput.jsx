import {ControlGroup, FormGroup, HTMLSelect, NumericInput} from "@blueprintjs/core";
import {AllowedOrder} from "@datawheel/tesseract-client";
import React, {PureComponent} from "react";

import LevelSelector from "./SelectorLevel";
import MeasureSelector from "./SelectorMeasure";

const initialState = {
  amount: 0,
  order: AllowedOrder.desc,
  level: null,
  measure: null
};

class TopItemsInput extends PureComponent {
  state = initialState;

  amountSetHandler = amount => this.setState({amount});
  ordSelectHandler = evt => this.setState({order: evt.target.value});
  lvlSelectHandler = level => this.setState({level});
  msrSelectHandler = measure => this.setState({measure});

  componentDidUpdate(prevProps) {
    const state = this.state;
    if (prevProps.cube != this.props.cube) {
      return this.setState(initialState);
    }
    if (state.level && state.measure) {
      this.props.onChange(state.amount, state.level, state.measure, state.order);
    }
  }

  render() {
    const {amount, order, level, measure} = this.state;

    return (
      <ControlGroup className="top-input" vertical={true}>
        <LevelSelector
          activeItem={level}
          fill={true}
          icon="layer"
          name="top-input-level"
          onItemSelect={this.lvlSelectHandler}
        />
        <MeasureSelector
          activeItem={measure}
          fill={true}
          icon="th-list"
          name="top-input-measure"
          onItemSelect={this.msrSelectHandler}
        />
        <FormGroup inline={true} label="Amount">
          <NumericInput
            active={true}
            fill={true}
            name="top-input-amount"
            onValueChange={this.amountSetHandler}
            value={amount}
          />
        </FormGroup>
        <FormGroup inline={true} label="Order">
          <HTMLSelect
            fill={true}
            name="top-input-order"
            onChange={this.ordSelectHandler}
            options={[
              {value: AllowedOrder.desc, label: "descendent"},
              {value: AllowedOrder.asc, label: "ascendent"}
            ]}
            value={order}
          />
        </FormGroup>
      </ControlGroup>
    );
  }
}

export default TopItemsInput;
