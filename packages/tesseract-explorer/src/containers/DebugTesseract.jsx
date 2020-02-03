import React from "react";
import { connect } from "react-redux";

/**
 * @typedef OwnProps
 * @property {*} prop
 */

/** @type {React.FC<OwnProps>} */
const TesseractDebugArea = function(props) {
  return (
    <div className="debug-area tesseract"></div>
  );
}

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
function mapState(state) {
  return {
    url:
  }
}

export default connect(mapState)(TesseractDebugArea);
