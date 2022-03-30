import {Checkbox} from "@blueprintjs/core";
import React, {useCallback} from "react";
import {useSelector} from "react-redux";
import {selectLocale} from "../state/params/selectors";
import {selectOlapMeasureMap} from "../state/selectors";
import {getCaption} from "../utils/string";

/**
 * @type {React.FC<{
 *  item: TessExpl.Struct.MeasureItem;
 *  onToggle: (item: TessExpl.Struct.MeasureItem) => void;
 * }>}
 */
const TagMeasure = props => {
  const {item} = props;

  const locale = useSelector(selectLocale);
  const measureMap = useSelector(selectOlapMeasureMap);

  const changeHandler = useCallback(() => {
    props.onToggle(item);
  }, [props.onToggle, item]);

  const measure = measureMap[item.measure];

  return (
    <Checkbox
      className="item-measure"
      label={getCaption(measure, locale.code)}
      checked={item.active}
      onChange={changeHandler}
    />
  );
};

export default TagMeasure;
