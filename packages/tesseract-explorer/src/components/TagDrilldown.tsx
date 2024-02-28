import {
  ActionIcon,
  Box,
  Card,
  CloseButton,
  Group,
  Input,
  Popover,
  Switch,
  useMantineTheme
} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import {IconWindowMaximize, IconWindowMinimize} from "@tabler/icons-react";
import React, {useCallback, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {selectLocale} from "../state/queries";
import {selectLevelTriadMap} from "../state/selectors";
import {filterMap} from "../utils/array";
import {abbreviateFullName} from "../utils/format";
import {getCaption} from "../utils/string";
import {keyBy} from "../utils/transform";
import {isActiveItem} from "../utils/validation";
import {SelectObject} from "./Select";
import {TransferInput} from "./TransferInput";
import {DrilldownItem, PropertyItem, buildProperty} from "../utils/structs";
import {useActions} from "../hooks/settings";

type CaptionItem = {name: string, level?: string};

const PropertiesTransferInput = TransferInput<PropertyItem>;

/** */
export function TagDrilldown(props: {
  item: DrilldownItem;
}) {
  const {item} = props;

  const actions = useActions();
  const theme = useMantineTheme();
  const {translate: t} = useTranslation();

  const isMediumScreen = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const levelTriadMap = useSelector(selectLevelTriadMap);
  const locale = useSelector(selectLocale);

  const [isOpen, setIsOpen] = useState(false);

  const toggleHandler = useCallback(() => {
    actions.updateDrilldown({...item, active: !item.active});
  }, [item]);

  const removeHandler = useCallback(evt => {
    evt.stopPropagation();
    actions.removeDrilldown(item.key);
  }, [item.key]);

  const captionUpdateHandler = useCallback((caption: CaptionItem) => {
    const captionProperty = caption.level ? caption.name : "";
    actions.updateDrilldown({...item, captionProperty});
  }, [item]);

  const propertiesUpdateHandler = useCallback((activeProps: string[]) => {
    const properties = item.properties.map(prop => buildProperty({
      ...prop,
      active: activeProps.includes(prop.key)
    }));
    actions.updateDrilldown({...item, properties});
  }, [item]);

  const propertyRecords = useMemo(
    () => keyBy(item.properties, item => item.key),
    [item.properties]
  );

  const captionItems: CaptionItem[] = useMemo(() => [
    {name: t("placeholders.unselected")},
    ...item.properties
  ], [locale.code, item.properties]);

  const activeProperties = filterMap(item.properties, item =>
    isActiveItem(item) ? item.key : null
  );

  const label = useMemo(() => {
    const triad = levelTriadMap[`${item.dimension}.${item.hierarchy}.${item.level}`];
    const triadCaptions = triad.map(item => getCaption(item, locale.code));
    return t("params.tag_drilldowns", {
      abbr: abbreviateFullName(triadCaptions, t("params.tag_drilldowns_abbrjoint")),
      dimension: triadCaptions[0],
      hierarchy: triadCaptions[1],
      level: triadCaptions[2],
      propCount: activeProperties.length
    });
  }, [activeProperties.join("-"), item, locale.code]);

  const popoverButton = item.properties.length > 0 &&
    <Popover.Target>
      <ActionIcon
        variant={isOpen ? "filled" : undefined}
        onClick={useCallback(() => setIsOpen(value => !value), [])}
      >
        {isOpen ? <IconWindowMinimize /> : <IconWindowMaximize />}
      </ActionIcon>
    </Popover.Target>;

  const target =
    <Card padding="xs" withBorder>
      <Group noWrap position="apart">
        <Switch
          checked={item.active}
          label={label}
          onChange={toggleHandler}
          size="xs"
          styles={{label: {fontSize: "0.875rem"}}}
        />
        <Group noWrap spacing="xs">
          {popoverButton}
          <CloseButton onClick={removeHandler} />
        </Group>
      </Group>
    </Card>;

  if (item.properties.length === 0) {
    return target;
  }

  const content =
    <Box
      miw={400}
      sx={theme => ({
        [theme.fn.smallerThan("md")]: {
          minWidth: "unset",
          maxWidth: 250
        }
      })}
    >
      <SelectObject
        getValue="name"
        items={captionItems}
        label={t("params.title_caption")}
        onItemSelect={captionUpdateHandler}
        selectedItem={item.captionProperty || t("placeholders.unselected")}
      />
      <Input.Wrapper label={t("params.title_properties")}>
        <PropertiesTransferInput
          activeItems={activeProperties}
          getLabel={item => item.name}
          items={propertyRecords}
          itemPredicate={(query, item) => query.test(item.name)}
          onChange={propertiesUpdateHandler}
        />
      </Input.Wrapper>
    </Box>;

  return (
    <Popover
      onChange={setIsOpen}
      opened={isOpen}
      position={isMediumScreen ? "bottom" : "right"}
      shadow="md"
      withArrow
      withinPortal
    >
      {target}
      <Popover.Dropdown>{content}</Popover.Dropdown>
    </Popover>
  );
}
