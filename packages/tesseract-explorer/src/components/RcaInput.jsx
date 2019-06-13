import {ControlGroup} from "@blueprintjs/core";
import React, {PureComponent} from "react";

import LevelSelector from "./SelectorLevel";
import MeasureSelector from "./SelectorMeasure";

const initialState = {
  level1: null,
  level2: null,
  measure: null
};

class RcaInput extends PureComponent {
  state = initialState;

  lvl1SelectHandler = level1 => this.setState({level1});
  lvl2SelectHandler = level2 => this.setState({level2});
  msrSelectHandler = measure => this.setState({measure});

  componentDidUpdate(prevProps) {
    const state = this.state;
    if (prevProps.cube != this.props.cube) {
      return this.setState(initialState);
    }
    if (state.level1 && state.level2 && state.measure) {
      this.props.onChange(state.level1, state.level2, state.measure);
    }
  }

  render() {
    const {level1, level2, measure} = this.state;

    return (
      <ControlGroup className="rca-input" vertical={true}>
        <ControlGroup className="rca-input-levels" fill={true}>
          <LevelSelector activeItem={level1} fill={true} onItemSelect={this.lvl1SelectHandler} />
          <LevelSelector activeItem={level2} fill={true} onItemSelect={this.lvl2SelectHandler} />
        </ControlGroup>

        <MeasureSelector
          activeItem={measure}
          fill={true}
          icon={measure ? "th-list" : false}
          onItemSelect={this.msrSelectHandler}
        />
      </ControlGroup>
    );
  }
}

export default RcaInput;
