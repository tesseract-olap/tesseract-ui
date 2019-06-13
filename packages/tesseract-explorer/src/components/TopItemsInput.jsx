import {ControlGroup, NumericInput, HTMLSelect, FormGroup} from "@blueprintjs/core";
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
      <div className="topn-input-wrapper">
        <div className="topn-input-control">
          <FormGroup inline={true} label="Level" labelFor="topn-input-level">
            <LevelSelector
              activeItem={level}
              fill={true}
              name="topn-input-level"
              onItemSelect={this.lvlSelectHandler}
            />
          </FormGroup>
          <FormGroup inline={true} label="Measure" labelFor="topn-input-measure">
            <MeasureSelector
              activeItem={measure}
              fill={true}
              name="topn-input-measure"
              onItemSelect={this.msrSelectHandler}
            />
          </FormGroup>
          <ControlGroup fill={true}>
            <FormGroup inline={true} label="Limit" labelFor="topn-input-amount">
              <NumericInput value={amount} onValueChange={this.amountSetHandler} />
            </FormGroup>
            <FormGroup inline={true} label="Order" labelFor="topn-input-order">
              <HTMLSelect
                options={[
                  {value: "desc", label: "descendent"},
                  {value: "asc", label: "ascendent"}
                ]}
                value={descendent ? "desc" : "asc"}
                onChange={this.desSelectHandler}
              />
            </FormGroup>
          </ControlGroup>
        </div>
      </div>
    );
  }
}

export default TopItemsInput;
