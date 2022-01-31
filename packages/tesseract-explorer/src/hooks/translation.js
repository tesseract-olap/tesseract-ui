/* eslint-disable comma-dangle */
import {translationFactory} from "@datawheel/use-translation";

export const defaultTranslation = {
  action_copy: "Copy",
  action_download: "Download",
  action_open: "Open",
  action_reload: "Reload",
  comparison: {
    EQ: "Equal to",
    GT: "Greater than",
    GTE: "Equal or greater than",
    LT: "Lower than",
    LTE: "Equal or lower than",
    NEQ: "Not equal to",
  },
  debug_view: {
    httpheaders: "Response headers",
    jssource_prefix: "Javascript source for ",
    jssource_suffix: "",
    url_aggregate: "Aggregate API URL",
    url_logiclayer: "LogicLayer API URL",
  },
  direction: {
    ASC: "Ascending",
    DESC: "Descending",
  },
  formats: {
    csv: "CSV",
    json: "JSON",
    jsonarrays: "JSON Arrays",
    jsonrecords: "JSON Records",
    xls: "XLS"
  },
  loading: {
    title: "Loading...",
    message_heavyquery: "The current query might contain a maximum of {rows} rows.\nPlease wait...",
    message_default: "Please wait...",
  },
  params: {
    action_execute: "Execute query",
    column_title: "Parameters",
    count_cuts: "{n} selected",
    current_endpoint: "Current endpoint: {label}",
    error_fetchmembers_detail: "An error ocurred while loading the member list.",
    error_fetchmembers_title: "Error loading member list",
    label_amount: "Amount",
    label_boolean_debug: "Debug response",
    label_boolean_distinct: "Apply DISTINCT to drilldowns",
    label_boolean_exclude_default_members: "Exclude default members",
    label_boolean_nonempty: "Only return non-empty data",
    label_boolean_parents: "Include parent levels",
    label_boolean_sparse: "Optimize sparse results",
    label_cube: "Cube:\n{name}\n{caption}",
    label_locale: "Language: {nativeName}",
    label_measure: "Measure",
    label_pagination_limit: "Results limit",
    label_pagination_offset: "Results offset",
    label_sorting_key: "Sort by",
    label_sorting_order: "Order",
    label_subtopic: "Subtopic: {label}",
    label_table: "Table: {label}",
    label_timelevel: "Time level",
    label_topic: "Topic: {label}",
    search_placeholder: "Filter (regex enabled)",
    summary_growth: "{measure} by {level}",
    summary_rca: "{level1} on {measure} by {level2}",
    summary_topk: "Top {amount} of {level} by {measure} ({order})",
    title_area_cuts: "Cuts ({n})",
    title_area_drilldowns: "Drilldowns ({n})",
    title_area_filters: "Filters ({n})",
    title_area_growth: "Growth",
    title_area_measures: "Measures ({n})",
    title_area_options: "Query options",
    title_area_rca: "RCA",
    title_area_topk: "Topk",
    title_caption: "Caption",
    title_downloaddata: "Download dataset",
    title_members: "Members",
    title_properties: "Properties",
    tooltip_area_cuts: "",
    tooltip_area_drilldowns: "",
    tooltip_area_filters: "",
    tooltip_area_growth: "",
    tooltip_area_measures: "",
    tooltip_area_options: "",
    tooltip_area_rca: "",
    tooltip_area_topk: "",
  },
  pivot_view: {
    error_missingparams: "The current query doesn't have enough parameters. Two different drilldowns and a measure are needed.",
    error_onedimension: "The rows and columns in a pivotted table need 2 different drilldowns.",
    label_ddcolumn: "Column drilldown",
    label_ddcolumnprop: "Column property",
    label_ddrow: "Row drilldown",
    label_ddrowprop: "Row property",
    label_formatter: "Numeral format",
    label_valmeasure: "Value measure",
    loading_details: "This might take a while, please wait...",
    loading_title: "Reestructuring data",
    title_download: "Download matrix",
    title_params: "Matrix params",
    warning_notsummeasure: "The current query contains more than 2 drilldowns, and the aggregation type of the measure is not \"SUM\". The values you're getting might not be meaningful.",
    warning_propertypivot: "Unlike Drilldown Members, Drilldown Properties are not guaranteed to be unique. In this view, data points are aggregated based on the property labels, so please ensure you're not missing information.",
    warning_sumdimensions: "There's more than 2 drilldowns in this query. Remaining values will be summed.",
  },
  placeholders: {
    incomplete: "[Incomplete parameters]",
    unselected: "[Unselected]",
    none: "[None]",
  },
  queries: {
    action_create: "New query",
    action_parse: "Query from URL",
    error_not_query: "Please construct a valid query",
    error_no_drilldowns: "You must add at least one drilldown.",
    error_no_measures: "You must add at least one measure.",
    column_title: "Queries",
    unset_parameters: "No parameters set",
  },
  results: {
    error_execquery_detail: "There was a problem with the last query:",
    error_disconnected_title: "You are not connected to the internet.",
    error_serveroffline_title: "There's a problem contacting with the server",
    error_serveroffline_detail: "Check the availability of the URL ",
    error_emptyresult_title: "Empty dataset",
    error_emptyresult_detail: "The query didn't return elements. Try again with different parameters.",
    count_rows: "{n} row",
    count_rows_plural: "{n} rows",
  },
  selectlevel_placeholder: "Level...",
  selectmeasure_placeholder: "Measure...",
  selecttimelevel_placeholder: "Time level...",
  table_view: {
    numeral_format: "Numeral format",
    sort_asc: "Sort Asc",
    sort_desc: "Sort Desc",
  },
  transfer_input: {
    count_hidden: "{n} item hidden",
    count_hidden_plural: "{n} items hidden",
    search_placeholder: "Filter (regex enabled)",
    select_all: "Select all",
    unselect_all: "Unselect all",
  }
};

export const {
  useTranslation,
  TranslationConsumer,
  TranslationProvider
} = translationFactory({defaultLocale: "en", defaultTranslation});
