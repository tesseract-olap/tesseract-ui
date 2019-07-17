import {
  Button,
  ButtonGroup,
  Classes,
  Divider,
  EditableText,
  Intent,
  Tag,
  Text
} from "@blueprintjs/core";
import classNames from "classnames";
import copy from "clipboard-copy";
import pluralize from "pluralize";
import React, {Fragment} from "react";
import {connect} from "react-redux";
import {queryInyect} from "../actions/query";
import {removeStarredItem, updateStarredItemLabel} from "../actions/starred";
import {
  abbreviateFullName,
  summaryGrowth,
  summaryRca,
  summaryTopItems
} from "../utils/format";
import {isActiveItem} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {boolean} active
 * @property {import("../reducers").StarredItem} item
 */

/**
 * @typedef DispatchProps
 * @property {() => any} copyStarredPermalink
 * @property {() => any} loadStarredQuery
 * @property {() => any} removeStarredItem
 * @property {() => any} updateItemLabel
 */

/** @type {React.FC<OwnProps & DispatchProps>} */
const StarredItem = function(props) {
  const {date, label, query} = props.item;
  const formattedDate = new Date(date).toLocaleString();

  const ctCount = query.cuts.length;
  const fiCount = query.filters.length;

  const growth = summaryGrowth(query.growth);
  const rca = summaryRca(query.rca);
  const top = summaryTopItems(query.top);

  return (
    <article className={classNames("starred-drawer-item", Classes.CARD)}>
      <header className="item-header">
        <div className="header-title">
          <EditableText
            className="label"
            onChange={props.updateItemLabel}
            selectAllOnFocus={true}
            placeholder={formattedDate}
            defaultValue={label || formattedDate}
          />
          {Boolean(label) && <span className="date">{formattedDate}</span>}
        </div>
        <ButtonGroup minimal={true}>
          <Button
            icon="th-derived"
            text="Load"
            intent={Intent.PRIMARY}
            onClick={props.loadStarredQuery}
          />
          <Button
            icon="duplicate"
            text="Copy link"
            onClick={props.copyStarredPermalink}
          />
          <Divider />
          <Button icon="trash" intent={Intent.DANGER} onClick={props.removeStarredItem} />
        </ButtonGroup>
      </header>
      <div className="item-runner">
        <Tag
          className="cube"
          icon="cube"
          intent={props.active ? Intent.SUCCESS : undefined}
          large={true}
          minimal={true}
        >
          {query.cube}
        </Tag>
        <div className="option-tags">
          <BooleanTag label="PARENTS" value={query.parents} />
          <BooleanTag label="SPARSE" value={query.sparse} />
        </div>
      </div>
      <div className="item-content">
        <div>
          <dl>
            <dt>Measures:</dt>
            {query.measures.filter(isActiveItem).map(ms => (
              <dd key={ms.key} className={ms.active ? "" : "disabled"}>
                {ms.measure}
              </dd>
            ))}
            <dt>Drilldowns:</dt>
            {query.drilldowns.map(dd => (
              <dd key={dd.key} className={dd.active ? "" : "disabled"}>
                {abbreviateFullName(dd.drillable)}
              </dd>
            ))}
          </dl>
        </div>
        {ctCount + fiCount > 0 && (
          <dl>
            {query.cuts.map(dd => {
              const nMembers = 4;
              const activeMembers = dd.members.filter(isActiveItem);
              const shownMembers = activeMembers.slice(0, nMembers);
              return (
                <Fragment key={dd.key}>
                  <dt className={dd.active ? "" : "disabled"}>
                    {`Cut on "${abbreviateFullName(dd.drillable)}"`}
                  </dt>
                  {shownMembers.map(m => (
                    <dd key={m.key} className={dd.active ? "" : "disabled"}>
                      <Text ellipsize={true}>{m.name}</Text>
                    </dd>
                  ))}
                  {activeMembers.length > nMembers && (
                    <dd
                      key="other-members"
                      className="disabled"
                    >{`...and other ${pluralize(
                      "member",
                      activeMembers.length - nMembers,
                      true
                    )}`}</dd>
                  )}
                </Fragment>
              );
            })}
            {query.filters.length > 0 && <dt>Cuts:</dt>}
            {query.filters.map(dd => (
              <dd key={dd.key} className={dd.active ? "" : "disabled"}>
                {dd.measure}
              </dd>
            ))}
          </dl>
        )}
        {(growth || rca || top) && (
          <dl>
            <dt>Calculations:</dt>
            {growth && <dd>{growth}</dd>}
            {rca && <dd>{rca}</dd>}
            {top && <dd>{top}</dd>}
          </dl>
        )}
      </div>
    </article>
  );
};

const BooleanTag = props => (
  <Tag
    className="tag-boolean"
    minimal={!props.value}
    icon={props.value ? "small-tick" : "small-cross"}
  >
    {props.label}
  </Tag>
);

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
function mapDispatchToProps(dispatch, props) {
  return {
    copyStarredPermalink(evt) {
      evt.stopPropagation();
      const {key} = props.item;
      const {origin, pathname} = window.location;
      return copy(`${origin}${pathname}?${key}`);
    },
    loadStarredQuery() {
      const {query} = props.item;
      return dispatch(queryInyect(query));
    },
    removeStarredItem(evt) {
      evt.stopPropagation();
      const {key} = props.item;
      return dispatch(removeStarredItem(key));
    },
    updateItemLabel(label) {
      return dispatch(updateStarredItemLabel({...props.item, label}));
    }
  };
}
export default connect(null, mapDispatchToProps)(StarredItem);
