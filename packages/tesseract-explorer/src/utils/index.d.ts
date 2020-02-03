interface SerializedQuery {
  booleans?: number;
  cube: string;
  cuts?: string[];
  drilldowns?: string[];
  filters?: string[];
  growth?: string[];
  locale?: string;
  measures?: string[];
  rca?: string[];
  topk?: string[];
}

interface LevelLike {
  dimension: string;
  hierarchy: string;
  name: string;
}

interface LevelRef {
  dimension: string;
  hierarchy: string;
  level: string;
}

type LevelDescriptor = LevelLike | LevelRef;
