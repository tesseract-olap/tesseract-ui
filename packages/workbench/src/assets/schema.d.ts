enum MemberType {}

enum Aggregator {
  Sum = "sum",
  Count = "count",
  Average = "avg",
  Max = "max",
  Min = "min",
  BasicGroupedMedian = {
    basic_grouped_median: {
      group_aggregator: string,
      group_dimension: string
    }
  },
  WeightedSum = {
    weighted_sum: {
      weight_column: string
    }
  }
}

enum DimensionType {}

enum MeasureType {}

interface SchemaConfigXML {
  name: string;
  shared_dimensions: SharedDimensionConfigXML[];
  cubes: CubeConfigXML[];
  annotations: AnnotationConfigXML[];
  default_locale?: string;
}

interface CubeConfigXML {
  name: string;
  public?: string;
  table: TableConfigXML;
  dimensions: DimensionConfigXML[];
  dimension_usages: DimensionUsageXML[];
  measures: MeasureConfigXML[];
  annotations: AnnotationConfigXML[];
}

interface DimensionConfigXML {
  name: string;
  foreign_key?: string;
  hierarchies: HierarchyConfigXML[];
  default_hierarchy?: string;
  dim_type?: DimensionType;
  annotations: AnnotationConfigXML[];
}

interface SharedDimensionConfigXML {
  name: string;
  hierarchies: HierarchyConfigXML[];
  default_hierarchy?: string;
  dim_type?: DimensionType;
  annotations: AnnotationConfigXML[];
}

interface DimensionUsageXML {
  source: string;
  name?: string;
  foreign_key: string;
  annotations: AnnotationConfigXML[];
}

interface HierarchyConfigXML {
  name: string;
  table?: TableConfigXML;
  primary_key?: string;
  levels: LevelConfigXML[];
  annotations: AnnotationConfigXML[];
  inline_table?: InlineTableXML;
  default_member?: string;
}

interface InlineTableXML {
  alias: string;
  column_definitions: InlineTableColumnDefinitionXML[];
  rows: InlineTableRowXML[];
}

interface InlineTableColumnDefinitionXML {
  name: string;
  key_type: MemberType;
  key_column_type?: string;
  caption_set?: string;
}

interface InlineTableRowXML {
  row_values: InlineTableRowValueXML[];
}

interface InlineTableRowValueXML {
  column: string;
  value: string;
}

interface LevelConfigXML {
  name: string;
  key_column: string;
  name_column?: string;
  properties: PropertyConfigXML[];
  key_type?: MemberType;
  annotations: AnnotationConfigXML[];
}

interface MeasureConfigXML {
  name: string;
  column: string;
  aggregator: Aggregator;
  measure_type?: MeasureType;
  annotations: AnnotationConfigXML[];
}

interface TableConfigXML {
  name: string;
  schema?: string;
  primary_key?: string;
}

interface PropertyConfigXML {
  name: string;
  column: string;
  caption_set?: string;
  annotations: AnnotationConfigXML[];
}

interface AnnotationConfigXML {
  name: string;
  text: string;
}
