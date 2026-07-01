import {type PlainCube} from "@datawheel/olap-client";
import {Anchor, Stack, Text, TextProps} from "@mantine/core";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {useLogger} from "../context/EventContext";
import {EventType} from "../events";
import {useSettings} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectLocale} from "../state/queries";
import {selectOlapCube} from "../state/selectors";
import {selectOlapCubeItems} from "../state/server";
import {getAnnotation, getCaption} from "../utils/string";
import {groupBy} from "../utils/transform";
import {Annotated} from "../utils/types";
import {SelectWithButtons} from "./Select";

const SelectLevel = SelectWithButtons<string>;
const SelectPlainCube = SelectWithButtons<PlainCube>;

/** */
export function SelectCube() {
  const items: PlainCube[] = useSelector(selectOlapCubeItems);
  const selectedItem: PlainCube | undefined = useSelector(selectOlapCube);

  const {actions, sortCubes} = useSettings();
  const log = useLogger();
  const {translate: t} = useTranslation();
  const {code: locale} = useSelector(selectLocale);

  const sortCubesRef = useRef(sortCubes);
  sortCubesRef.current = sortCubes;

  const handleCategoryChange = useCallback((newSubset: PlainCube[]) => {
    // If the category changes, automatically pick the first cube in that new category
    if (newSubset.length > 0) {
      actions.willSetCube(newSubset[0].name);
    }
  }, []);

  const {sortTopics, sortSubtopics, sortTables, sortedCubes} = useMemo(() => {
    const sortedCubes = items.sort(
      sortCubesRef.current ? sortCubesRef.current(locale) : defaultCubeSorter,
    );

    return {
      sortedCubes,
      sortTopics: indexedSortFactory(
        sortedCubes.map((item) => getAnnotation(item, "topic", locale) || ""),
      ),
      sortSubtopics: indexedSortFactory(
        sortedCubes.map((item) => getAnnotation(item, "subtopic", locale) || ""),
      ),
      sortTables: indexedSortFactory(
        sortedCubes.map((item) => getAnnotation(item, "table", locale) || ""),
      ),
    };

    function indexedSortFactory(index: string[]) {
      return (a: string, b: string) => index.indexOf(a) - index.indexOf(b);
    }

    function getCubeGroup(order: number) {
      return order > 0 ? 1 : order === 0 ? 2 : 3;
    }

    function defaultCubeSorter(a: PlainCube, b: PlainCube) {
      const orderA = getCubeOrder(a);
      const orderB = getCubeOrder(b);
      // Group 1: Positives | Group 2: Zero/Undefined | Group 3: Negatives
      const groupA = getCubeGroup(orderA);
      const groupB = getCubeGroup(orderB);
      // Different groups have different direct priority
      if (groupA !== groupB) {
        return groupA - groupB;
      }
      // Same groups compare the order values directly
      if (orderA !== 0 && orderB !== 0 && orderA !== orderB) {
        // Ascending numerical sort handles both requirements:
        // Positives: 1, 2, 3 (closer to 0 first)
        // Negatives: -3, -2, -1 (closer to 0 last)
        return orderA - orderB;
      }
      // Sort alphabetically via topic
      const topicA = a.annotations.topic || "";
      const topicB = b.annotations.topic || "";
      const topicCmp = topicA.localeCompare(topicB);
      if (topicCmp !== 0) return topicCmp;
      // Sort alphabetically via subtopic
      const subtopicA = a.annotations?.subtopic || "";
      const subtopicB = b.annotations?.subtopic || "";
      const subtopicCmp = subtopicA.localeCompare(subtopicB);
      if (subtopicCmp !== 0) return subtopicCmp;
      // Sort alphabetically via table
      const tableA = a.annotations?.table || "";
      const tableB = b.annotations?.table || "";
      const tableCmp = tableA.localeCompare(tableB);
      if (tableCmp !== 0) return tableCmp;
      // Fallback to sorting alphabetically via caption
      return getCaption(a, locale).localeCompare(getCaption(b, locale));
    }
  }, [items, locale]);

  if (items.length < 2) {
    return null;
  }

  // Derive current UI levels directly from the selected item
  const currentTopic = selectedItem
    ? getAnnotation(selectedItem, "topic", locale) || ""
    : "";
  const currentSubtopic = selectedItem
    ? getAnnotation(selectedItem, "subtopic", locale) || ""
    : "";
  const currentTable = selectedItem
    ? getAnnotation(selectedItem, "table", locale) || ""
    : "";

  // Calculate Topic subset synchronously during render
  const topicTree = groupBy(sortedCubes, (item) => getAnnotation(item, "topic", locale));
  const topicKeys = [...topicTree.keys()].sort(sortTopics);
  const level1Values = currentTopic ? topicTree.get(currentTopic) || [] : sortedCubes;

  // Calculate Subtopic subset from Topic subset
  const subtopicTree = groupBy(level1Values, (item) =>
    getAnnotation(item, "subtopic", locale),
  );
  const subtopicKeys = [...subtopicTree.keys()].sort(sortSubtopics);
  const level2Values = currentSubtopic
    ? subtopicTree.get(currentSubtopic) || level1Values
    : level1Values;

  // Calculate Table subset from Subtopic subset
  const tableTree = groupBy(level2Values, (item) => getAnnotation(item, "table", locale));
  const tableKeys = [...tableTree.keys()].sort(sortTables);
  const level3Values = currentTable
    ? tableTree.get(currentTable) || level2Values
    : level2Values;

  // Use the most specific non-empty list of cubes for the final selector
  const cubeItems =
    level3Values.length > 0
      ? level3Values
      : level2Values.length > 0
        ? level2Values
        : level1Values.length > 0
          ? level1Values
          : sortedCubes;

  return (
    <Stack id="select-cube" spacing={0}>
      <SelectLevel
        hidden={topicKeys.length === 0 || currentTopic === "Hidden"}
        items={topicKeys}
        label={t("params.label_topic")}
        selectedItem={currentTopic}
        onItemSelect={(value) => {
          log(EventType.CubeTopic, {value});
          handleCategoryChange(topicTree.get(value) || []);
        }}
      />

      <SelectLevel
        hidden={subtopicKeys.length === 0 || currentSubtopic === "Hidden"}
        items={subtopicKeys}
        label={t("params.label_subtopic")}
        selectedItem={currentSubtopic}
        onItemSelect={(value) => {
          log(EventType.CubeSubtopic, {value});
          handleCategoryChange(subtopicTree.get(value) || []);
        }}
      />

      <SelectLevel
        hidden={tableKeys.length === 0 || currentTable === "Hidden"}
        items={tableKeys}
        label={t("params.label_table")}
        selectedItem={currentTable}
        onItemSelect={(value) => {
          log(EventType.CubeTable, {value});
          handleCategoryChange(tableTree.get(value) || []);
        }}
      />

      <SelectPlainCube
        hidden={cubeItems.length < 2}
        getLabel={(item) => getCaption(item, locale)}
        getValue="name"
        items={cubeItems}
        label={t("params.label_cube")}
        onItemSelect={(cube) => {
          log(EventType.CubeSelect, {name: cube.name});
          actions.willSetCube(cube.name);
        }}
        selectedItem={selectedItem}
      />

      {selectedItem && (
        <Text mt="sm" sx={{"& p": {margin: 0}}}>
          <CubeAnnotation
            annotation="description"
            className="dex-cube-description"
            item={selectedItem}
            locale={locale}
          />
          <CubeSourceAnchor item={selectedItem} locale={locale} fz="xs" />
          <CubeAnnotation
            annotation="source_description"
            className="dex-cube-srcdescription"
            fz="xs"
            item={selectedItem}
            locale={locale}
          />
        </Text>
      )}
    </Stack>
  );
}

/** */
function CubeAnnotation(
  props: TextProps & {
    annotation: string;
    item: Annotated;
    locale: string;
  },
) {
  const {annotation, item, locale, ...textProps} = props;
  const content = getAnnotation(item, annotation, locale);
  return content ? (
    <Text component="p" {...textProps}>
      {content}
    </Text>
  ) : null;
}

/** */
function CubeSourceAnchor(
  props: TextProps & {
    item: Annotated;
    locale: string;
  },
) {
  const {item, locale, ...textProps} = props;
  const {translate: t} = useTranslation();

  const srcName = getAnnotation(item, "source_name", locale);
  const srcLink = getAnnotation(item, "source_link", locale);

  if (!srcName) return null;

  return (
    <Text component="p" {...textProps}>
      {`${t("params.label_source")}: `}
      {srcLink ? <Anchor href={srcLink}>{srcName}</Anchor> : <Text span>{srcName}</Text>}
    </Text>
  );
}

function getCubeOrder(cube: PlainCube): number {
  const orderStr = cube.annotations?.order;
  if (!orderStr) return 0;
  const num = parseInt(orderStr, 10);
  return isNaN(num) ? 0 : num;
}
