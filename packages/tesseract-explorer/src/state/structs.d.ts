type Annotations = Record<string, string | undefined>;

interface IAnnotated {
  readonly annotations: Annotations;
}
interface IFullNamed extends INamed {
  readonly fullName?: string;
}
interface INamed {
  readonly name: string;
  readonly caption?: string;
}
interface ISerializable {
  readonly uri: string;
}

interface OlapCube extends IAnnotated, IFullNamed, ISerializable {
  readonly _type: "cube";
  readonly dimensions: OlapDimension[];
  readonly measures: OlapMeasure[];
}
interface OlapDimension extends IAnnotated, IFullNamed, ISerializable {
  readonly _type: "dimension";
  readonly cube: string;
  readonly defaultHierarchy: string;
  readonly dimensionType: string;
  readonly hierarchies: OlapHierarchy[];
}
interface OlapHierarchy extends IAnnotated, IFullNamed, ISerializable {
  readonly _type: "hierarchy";
  readonly cube: string;
  readonly dimension: string;
  readonly levels: OlapLevel[];
}
interface OlapLevel extends IAnnotated, IFullNamed, ISerializable {
  readonly _type: "level";
  readonly caption: string;
  readonly cube: string;
  readonly depth: number;
  readonly dimension: string;
  readonly hierarchy: string;
  readonly properties: OlapProperty[];
  readonly uniqueName?: string;
}
interface OlapMeasure extends IAnnotated, IFullNamed, ISerializable {
  readonly _type: "measure";
  readonly aggregatorType: string;
  readonly cube: string;
}
interface OlapMember extends IFullNamed, ISerializable {
  readonly _type: "member";
  readonly ancestors: OlapMember[];
  readonly children: OlapMember[];
  readonly depth?: number;
  readonly key: string | number;
  readonly level: string;
  readonly numChildren?: number;
  readonly parentName?: string;
}
interface OlapProperty extends IAnnotated, INamed {
  readonly _type: "property";
  readonly cube: string;
  readonly dimension: string;
  readonly hierarchy: string;
  readonly level: string;
}
