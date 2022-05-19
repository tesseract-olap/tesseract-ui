# @datawheel/cube-audit

A quick script to audit metainformation annotations on cubes from tesseract-olap servers.

## Description

This script will analyze the cubes in a given tesseract endpoint, and produce a markdown checklist of suggested annotations and dimension types to better improve the performance and user experience for vizbuilder, tesseract-explorer and it's plugins, and other products from Datawheel.

## Usage

The easiest usage is simply running the `cube-audit` script followed by a base tesseract endpoint:

```sh
npx @datawheel/cube-audit https://api.oec.world/tesseract/
```

No installation needed. `npx` will take care of downloading the script and running it.

The CLI interface supports some additional options. Run `npx @datawheel/cube-audit --help` for more details.

You can also add it as a dependency on another project and use the `auditServer` exported function:

```js
const {auditServer} = require("@datawheel/cube-audit");

auditServer("https://api.oec.world/tesseract/").then(result => { ... });
```

The `auditServer` function accepts an url `string` or an [`AxiosRequestConfig`](https://github.com/axios/axios#request-config) object. Optionally, it supports a second parameter for a callback function that is run for each cube with the resulting issues; setting this parameter will also run each cube one after another instead of in parallel.  
The `result` of the audit is an object you can interpret easily to do other actions.

### Error: "JavaScript heap out of memory"

You might find a cube that has one or many levels with thousands or millions of members. In these cases is highly probable you will run out of memory, because V8's memory usage is by default limited to around 1.7GB. To increase this limit, set the environment variable `NODE_OPTIONS="--max_old_space_size=10000"` (where 10000 would mean 10GB, change accordingly), and run the script again.

## Annotations

### Cube

| Annotation Name | Description |
| --- | --- |
| source_name | Organization that produces/published the data (ex. "Census Bureau" or "BACI"). |
| source_link | Web address for the organization (will turn `source_name` display into an anchor link). |
| source_description | Description of the source organization (typically a few short sentences). |
| dataset_name | Title for the specific dataset/table (ex. "ACS 1-Year Estimate" or "HS6 REV. 1992 (1995 - 2018)"). |
| dataset_link | Web address for the dataset (will turn `dataset_name` display into an anchor link). |
| dataset_description | Description of the dataset (typically a few short sentences). |

### Dimensions, Hierarchies & Levels

| Annotation Name | Description |
| --- | --- |
| order | Optional. Allows to sort the elements in the selection menues to add entities. |

### Measures

| Annotation Name | Description |
| --- | --- |
| aggregation_method | The method by which a measure should be aggregated (if the root aggregation type is unknown).<br /><br />Valid values include: `COUNT`, `SUM`, `AVERAGE`, `MEDIAN`, `RCA`. |
| format_template | A template string that specifies how the numeric values of a measure should be displayed to users. Can be any valid [d3plus-format](https://github.com/d3plus/d3plus-format/#d3plusformatspecifier-) string specifier, which extends the base specifiers defined by [d3-format](https://github.com/d3/d3-format/#locale_format).<br /><br />Defaults to `".3~a"`, which abbreviates large numbers and adds the appropriate suffix (ie. `1234567890` becomes `1.23B`). |
| description | The text description of a measure, typically 1-3 short sentences. |

## Locale Support

The annotations mentioned here are the default values. However, if you need texts for different languages, you can add `_<locale>` as a suffix. For example, `source_name` for English and Spanish should be `source_name_en` and `source_name_es`.
Applications will then try to use the annotation with suffix, and if it's not available, will default to the annotation without suffix.
