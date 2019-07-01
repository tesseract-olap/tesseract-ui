import React from "react";
import {connect} from "react-redux";
import {Toaster as BpToaster, Intent} from "@blueprintjs/core";

class Toaster extends React.Component {
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

/** @param {import("../reducers").ExplorerState} state */
function mapStateToProps(state) {
  return {
    queryError: state.explorerDataset.error
  };
}

export default connect(mapStateToProps)(Toaster);
