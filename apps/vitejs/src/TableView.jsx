import {TableView as BaseTableView} from "@datawheel/tesseract-explorer";
import React, {useCallback} from "react";

const columnOrder = [
  "Year",
  "ISO",
  "ISO ID",
  "LAC",
  "OCDE",
  "TN",
  "CS",
  "Andinos",
  "CID",
  "Caribe",
  "Governement Integrity and Ethics",
  "Government change",
  "Government party change",
  "International Compliance",
  "Public and Private Integrity"
];

/**
 * @param {import("@datawheel/tesseract-explorer").ViewProps} props
 */
export const TableView = props => {
  // Hide all columns labeled with "Something ID" except for "ISO ID"
  const columnFilter = useCallback(item =>
    item.label === "ISO ID" || !item.label.endsWith(" ID")
  , []);

  // If a column label is in `columnOrder`, sort by its position, else put at the end
  const columnSorting = useCallback((a, b) => {
    const indexA = columnOrder.indexOf(a.label);
    const indexB = columnOrder.indexOf(b.label);
    if (indexA === -1 && indexB === -1) {
      return "".localeCompare.call(a.localeLabel, b.localeLabel);
    }
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  }, []);

  return (
    <BaseTableView
      cube={props.cube}
      params={props.params}
      result={props.result}
      columnFilter={columnFilter}
      columnSorting={columnSorting}
    />
  );
};
