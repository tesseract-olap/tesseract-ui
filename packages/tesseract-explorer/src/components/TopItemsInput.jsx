import {ControlGroup, FormGroup, HTMLSelect, NumericInput} from "@blueprintjs/core";
import React, {PureComponent} from "react";

import LevelSelector from "./SelectorLevel";
import MeasureSelector from "./SelectorMeasure";

const initialState = {
  amount: 0,
  descendent: true,
  level: null,
  measure: null
};

class TopItemsInput extends PureComponent {
  state = initialState;

  amountSetHandler = amount => this.setState({amount});
  desSelectHandler = _ => this.setState(state => ({descendent: !state.descendent}));
  lvlSelectHandler = level => this.setState({level});
  msrSelectHandler = measure => this.setState({measure});

  componentDidUpdate(prevProps) {
    const state = this.state;
    if (prevProps.cube != this.props.cube) {
      return this.setState(initialState);
    }
    if (state.level && state.measure) {
      this.props.onChange(state.amount, state.level, state.measure, state.descendent);
    }
  }

  render() {
    const {amount, descendent, level, measure} = this.state;

    return (
      <ControlGroup className="topn-input" vertical={true}>
        <LevelSelector
          activeItem={level}
          fill={true}
          icon="layer"
          name="topn-input-level"
          onItemSelect={this.lvlSelectHandler}
        />
        <MeasureSelector
          activeItem={measure}
          fill={true}
          icon="th-list"
          name="topn-input-measure"
          onItemSelect={this.msrSelectHandler}
        />
        <FormGroup inline={true} label="Amount">
          <NumericInput
            active={true}
            fill={true}
            name="topn-input-amount"
            onValueChange={this.amountSetHandler}
            value={amount}
          />
        </FormGroup>
        <FormGroup inline={true} label="Order">
          <HTMLSelect
            fill={true}
            name="topn-input-order"
            onChange={this.desSelectHandler}
            options={[
              {value: "desc", label: "descendent"},
              {value: "asc", label: "ascendent"}
            ]}
            value={descendent ? "desc" : "asc"}
          />
        </FormGroup>
      </ControlGroup>
    );
  }
}

export default TopItemsInput;
