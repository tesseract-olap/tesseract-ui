import {Button, Callout, FormGroup, HTMLSelect, Intent} from "@blueprintjs/core";
import {default as Editor, monaco} from "@monaco-editor/react";
import classNames from "classnames";
import * as chartComponents from "d3plus-react";
import React, {Component} from "react";
import {chartOptions} from "../enums";
import {fetchTypings} from "../utils/monaco";
import {buildDatumTypes} from "../utils/string";
import AnimatedCube from "./AnimatedCube";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {string} chartConfigCode
 * @property {string} chartType
 * @property {boolean} isDarkTheme
 * @property {any} result
 * @property {(code: string) => void} updateConfigHandler
 * @property {(type: string) => void} updateTypeHandler
 */

/**
 * @typedef OwnState
 * @property {any} chartConfig
 * @property {boolean} editorInitiated
 * @property {string | undefined} errorMessage
 * @property {string | undefined} errorStack
 */

/** @extends {Component<OwnProps, OwnState>} */
class ResultChart extends Component {
  static getDerivedStateFromError(error) {
    return {error: error.message, errorStack: error.stack};
  }

  /** @type {OwnState} */
  state = {
    chartConfig: null,
    editorInitiated: false,
    errorMessage: undefined,
    errorStack: undefined
  };

  /** @type {import("monaco-editor").editor.IEditorConstructionOptions} */
  monacoOptions = {
    autoIndent: "full",
    minimap: {enabled: false},
    renderWhitespace: "all",
    scrollBeyondLastLine: false
  };

  clearError = () => this.setState({errorMessage: undefined});

  getEditorValue = () => "";

  /** @type {import("@monaco-editor/react").EditorDidMount} */
  handleEditorDidMount = getEditorValue => {
    this.getEditorValue = getEditorValue;
  };

  updateConfigHandler = () => {
    const {result, updateConfigHandler} = this.props;
    const newChartConfigCode = this.getEditorValue();
    typeof updateConfigHandler === "function" && updateConfigHandler(newChartConfigCode);
    try {
      const configGenerator = new Function(`${newChartConfigCode}; return config;`);
      this.setState({chartConfig: {data: result.data, ...configGenerator()}});
    }
    catch (e) {
      this.setState({errorMessage: e.message});
    }
  };

  updateTypeHandler = evt => {
    const {chartType, updateConfigHandler, updateTypeHandler} = this.props;
    const newChartType = evt.target.value;
    typeof updateTypeHandler === "function" && updateTypeHandler(newChartType);
    const newChartConfigCode = this.getEditorValue().replace(chartType, newChartType);
    typeof updateConfigHandler === "function" && updateConfigHandler(newChartConfigCode);
  };

  componentDidMount() {
    const {data} = this.props.result;

    Promise.all([monaco.init(), fetchTypings()]).then(([monaco, extraLibs]) => {
      const ts = monaco.languages.typescript;
      ts.javascriptDefaults.setExtraLibs(
        extraLibs.concat({content: buildDatumTypes(data[0] || {})})
      );
      ts.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false
      });
      ts.javascriptDefaults.setCompilerOptions({
        allowNonTsExtensions: true,
        allowJs: true,
        checkJs: true,
        noEmit: true,
        target: ts.ScriptTarget.ES2016
      });
      this.setState({editorInitiated: true});
    });
  }

  render() {
    const {chartConfig, editorInitiated, errorMessage, errorStack} = this.state;

    const {chartType, className, chartConfigCode, isDarkTheme, result} = this.props;
    const ChartComponent = chartComponents[chartType];

    const previewArea = errorMessage
      ? <Callout intent={Intent.DANGER} title="Error trying to render the chart">
        <p>An error happened while trying to render the chart.</p>
        <dl>
          <dt>Message</dt>
          <dd>{errorMessage}</dd>
          <dt>Stack</dt>
          <dd>{errorStack}</dd>
        </dl>
      </Callout>
      : !chartConfig
        ? <AnimatedCube />
        :       <ChartComponent
          key={chartConfigCode}
          config={chartConfig || {data: result.data}}
        />
    ;

    return (
      <div className={classNames("data-chart", className)}>
        <div className="editor">
          <div className="params">
            <FormGroup className="inline-group" label="Chart type" inline>
              <HTMLSelect
                options={chartOptions}
                value={chartType}
                onChange={this.updateTypeHandler}
              />
            </FormGroup>
            <Button intent={Intent.PRIMARY} onClick={this.updateConfigHandler}>
              Apply config
            </Button>
          </div>
          {editorInitiated &&
            <Editor
              key={result.urlAggregate}
              theme={isDarkTheme ? "dark" : "light"}
              language="javascript"
              editorDidMount={this.handleEditorDidMount}
              options={this.monacoOptions}
              value={chartConfigCode}
            />
          }
        </div>
        <div className="preview">{previewArea}</div>
      </div>
    );
  }
}

export default ResultChart;
