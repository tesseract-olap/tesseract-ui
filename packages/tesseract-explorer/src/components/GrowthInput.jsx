import {
  Alignment,
  Button,
  Classes,
  ControlGroup,
  Popover,
  Position
} from "@blueprintjs/core";
import React, {PureComponent} from "react";

import TimeDimensionMenu from "./MenuDimensionTime";
import SelectorMeasure from "./SelectorMeasure";

const initialState = {
  level: null,
  measure: null
};

class GrowthInput extends PureComponent {
  state = initialState;

  lvlSelectHandler = level => this.setState({level});
  msrSelectHandler = measure => this.setState({measure});

  componentDidUpdate(prevProps) {
    const state = this.state;
    if (prevProps.cube != this.props.cube) {
      return this.setState(initialState);
    }
    if (state.level && state.measure) {
      this.props.onChange(state.level, state.measure);
    }
  }

  render() {
    const {level, measure} = this.state;
    return (
      <ControlGroup className="growth-input" vertical={true}>
        <SelectorMeasure
          activeItem={measure}
          fill={true}
          icon="th-list"
          onItemSelect={this.msrSelectHandler}
        />
        <Popover
          minimal={true}
          position={Position.BOTTOM_LEFT}
          targetTagName="div"
          wrapperTagName="div"
        >
          <Button
            alignText={Alignment.LEFT}
            fill={true}
            icon="calendar"
            rightIcon="double-caret-vertical"
            text={level ? level.fullName : "Time level..."}
          />
          <TimeDimensionMenu activeItems={level} onClick={this.lvlSelectHandler} />
        </Popover>
      </ControlGroup>
    );
  }
}

export default GrowthInput;
