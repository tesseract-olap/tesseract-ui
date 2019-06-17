var title = `$TEMPLATE_TITLE`;
var serverUrl = `$TEMPLATE_SERVER`;
var publicUrl = `$TEMPLATE_PUBLIC`;

// Reference to this config available at https://poi.js.org/config.html
module.exports = {
  entry: "./index.js",
  output: {
    html: {title},
    minimize: false,
    publicUrl,
    sourceMap: true,
  },
  envs: {
    APP_TESSERACT_URL: serverUrl,
    APP_TITLE: title
  }
};
