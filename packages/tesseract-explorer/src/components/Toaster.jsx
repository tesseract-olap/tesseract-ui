import {Intent, Toaster as BpToaster} from "@blueprintjs/core";
import React, {Component} from "react";
import {connect} from "react-redux";

class Toaster extends Component {
  constructor(props) {
    super(props);

    this.toaster = undefined;
    this.refHandlers = {
      toaster: ref => (this.toaster = ref)
    };
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (!prevProps.queryError && props.queryError) {
      const toast = {
        intent: Intent.DANGER,
        timeout: 3000,
        message: (
          <span className="toast-message">
            One toast created. <em>Toasty.</em>
          </span>
        )
      };
      this.toaster.show(toast);
    }
  }

  render() {
    return <BpToaster {...this.state} ref={this.refHandlers.toaster} />;
  }
}

/** @param {import("../oldReducers").ExplorerState} state */
function mapStateToProps(state) {
  return {
    queryError: state.explorerLoading.error
  };
}

export default connect(mapStateToProps)(Toaster);
