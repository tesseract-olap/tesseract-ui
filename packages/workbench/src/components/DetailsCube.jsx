import {NonIdealState} from "@blueprintjs/core";
import React, {useCallback} from "react";
import {useRecoilState} from "recoil";
import {selectCube} from "../state/cubes";
import {DetailsBase} from "./DetailsBase";
import {FieldCheckbox} from "./FieldCheckbox";
import {FieldText} from "./FieldText";

/**
 * @typedef DetailsCubeProps
 * @property {string} [className]
 * @property {string} id
 */

/** @type {React.FC<DetailsCubeProps>} */
export const DetailsCube = props => {
  const [item, setItem] = useRecoilState(selectCube(props.id));

  const setItemName = useCallback(name => setItem({...item, name}), [item]);
  const setItemIsPublic = useCallback(isPublic => setItem({...item, isPublic}), [item]);

  if (!item) {
    return <NonIdealState
      icon="error"
      title={`There's a problem retrieving the cube "${props.id}"`}
    />;
  }

  return (
    <DetailsBase className="node-cube">
      <FieldText name="name" value={item.name} onChange={setItemName} />
      <hr />
      <FieldCheckbox name="isPublic" value={item.isPublic} onChange={setItemIsPublic} />
    </DetailsBase>
  );
};
