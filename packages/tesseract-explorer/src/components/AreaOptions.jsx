import {Checkbox} from "@blueprintjs/core";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useSettings} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {doBooleanToggle, doPaginationUpdate} from "../state/params/actions";
import {selectBooleans} from "../state/params/selectors";
import {selectServerBooleansEnabled} from "../state/server/selectors";
import {LayoutParamsArea} from "./LayoutParamsArea";
import {PaginationInput} from "./PaginationInput";
import {SortingInput} from "./SortingInput";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
export const AreaOptions = props => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const booleans = useSelector(selectBooleans);
  const enabledBooleans = useSelector(selectServerBooleansEnabled);

  return (
    <LayoutParamsArea
      className={props.className}
      open={false}
      title={t("params.title_area_options")}
      tooltip={t("params.tooltip_area_options")}
    >
      {enabledBooleans.map(key =>
        <Checkbox
          key={key}
          className="item-option"
          label={t(`params.label_boolean_${key}`)}
          checked={booleans[key] || false}
          onChange={() => {
            dispatch(doBooleanToggle(key));
          }}
        />
      )}

      <SortingInput />
      <PaginationInput />
    </LayoutParamsArea>
  );
};
