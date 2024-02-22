import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Card,
  CloseButton,
  Group,
  HoverCard,
  Input,
  Loader,
  Popover,
  Stack,
  Switch,
  Text,
  ThemeIcon,
  useMantineTheme
} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import {
  IconAlertTriangle,
  IconRefresh,
  IconWindowMaximize,
  IconWindowMinimize
} from "@tabler/icons-react";
import React, {memo, useCallback, useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useSettings} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectLocale} from "../state/queries";
import {selectLevelTriadMap} from "../state/selectors";
import {abbreviateFullName} from "../utils/format";
import {getCaption} from "../utils/string";
import {buildMember} from "../utils/structs";
import {TransferInput} from "./TransferInput";

/** @type {React.FC<import("./TransferInput").OwnProps<import("../utils/structs").MemberItem>>} */
// @ts-ignore
export const MembersTransferInput = TransferInput;

/**
 * @type {React.FC<{
 *  item: import("../utils/structs").CutItem,
 *  onMembersUpdate?: (item: import("../utils/structs").CutItem, members: string[]) => any,
 *  onRemove?: (item: import("../utils/structs").CutItem) => any,
 *  onToggle?: (item: import("../utils/structs").CutItem) => any,
 * }>}
 */
export const TagCut = props => {
  const {item, onMembersUpdate, onRemove, onToggle} = props;
  const {translate: t} = useTranslation();
  const [opened, setOpened] = useState(false);
  const {actions, defaultMembersFilter} = useSettings();

  const locale = useSelector(selectLocale);
  const theme = useMantineTheme();
  const isMediumScreen = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  const levelTriadMap = useSelector(selectLevelTriadMap);
  const triad = levelTriadMap[`${item.dimension}.${item.hierarchy}.${item.level}`];

  const [error, setError] = useState("");
  const [members, setMembers] = useState(Object.create(null));
  const [isLoadingMembers, setLoadingMembers] = useState(true);

  const toggleHandler = useCallback(() => {
    onToggle && onToggle(item);
  }, [item.active]);

  const removeHandler = useCallback(
    evt => {
      evt.stopPropagation();
      onRemove && onRemove(item);
    },
    [item.key]
  );

  const reloadHandler = useCallback(() => {
    const activeMembers = item.members;
    actions
      .willFetchMembers(item)
      .then(members => {
        const memberRecords = {};
        let i = members.length;
        while (i--) {
          const member = members[i];
          const active = activeMembers.includes(`${member.key}`);
          memberRecords[member.key] = buildMember({name: member.caption, key: member.key, active});
        }
        !item.active && actions.updateCut({...item, active: true});
        setError("");
        setMembers(memberRecords);
        setLoadingMembers(false);
      })
      .catch(err => {
        setError(`${err.message}`);
        setMembers({});
        setLoadingMembers(false);
      });
  }, []);

  useEffect(reloadHandler, [item.key, locale.code]);

  const label = useMemo(() => {
    const triadCaptions = triad.map(item => getCaption(item, locale.code));
    return t("params.tag_drilldowns", {
      abbr: abbreviateFullName(triadCaptions, t("params.tag_drilldowns_abbrjoint")),
      dimension: triadCaptions[0],
      hierarchy: triadCaptions[1],
      level: triadCaptions[2],
      memberCount: item.members.length
    });
  }, [item.members.join("-"), item, locale.code]);

  /** @type {{label: string; method: import("./TransferInput").ItemPredicateFunction<import("../utils/structs").MemberItem>}[]} */
  const itemPredicate = useMemo(
    () => [
      {
        label: t("params.label_cuts_filterby_id"),
        method: (query, item) => query.test(item.key)
      },
      {
        label: t("params.label_cuts_filterby_name"),
        method: (query, item) => query.test(item.name)
      },
      {
        label: t("params.label_cuts_filterby_any"),
        method: (query, item) => query.test(item.key) || query.test(item.name)
      }
    ],
    [locale.code]
  );

  const initialItemPredicateIndex = {id: 0, name: 1, any: 2}[defaultMembersFilter];

  if (isLoadingMembers) {
    return <TagCutLoading onRemove={removeHandler}>{label}</TagCutLoading>;
  }

  if (error) {
    return (
      <TagCutError
        error={error}
        item={props.item}
        onReload={reloadHandler}
        onRemove={removeHandler}
      >
        {label}
      </TagCutError>
    );
  }

  const activeCount = item.members.length;
  const uniqueActive = activeCount === 1 && members[item.members[0]];
  // eslint-disable-next-line eqeqeq
  const showMemberKey = triad[2].annotations.memberid_in_ui != "false";

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position={isMediumScreen ? "bottom" : "right"}
      shadow="md"
      withArrow
      withinPortal
    >
      <Card padding="xs" withBorder>
        <Group noWrap position="apart">
          <Group noWrap spacing="xs">
            <Switch checked={item.active} onChange={toggleHandler} size="xs" />
            <Text fz="sm" lineClamp={1}>
              {t("params.tag_cuts", {
                abbr: label,
                first_member: uniqueActive ? uniqueActive.name : "",
                n: activeCount
              })}
            </Text>
          </Group>
          <Popover.Target>
            <Group noWrap position="right" spacing="xs">
              <ActionIcon
                variant={opened ? "filled" : undefined}
                onClick={() => setOpened(o => !o)}
              >
                {opened ? <IconWindowMinimize /> : <IconWindowMaximize />}
              </ActionIcon>
              <CloseButton onClick={removeHandler} />
            </Group>
          </Popover.Target>
        </Group>
      </Card>
      <Popover.Dropdown>
        <Box
          miw={400}
          sx={theme => ({
            [theme.fn.smallerThan("md")]: {
              minWidth: "unset",
              maxWidth: 250
            }
          })}
        >
          <Input.Wrapper label={t("params.title_members")}>
            <MembersTransferInput
              activeItems={item.members}
              getLabel={item => item.name}
              getSecondLabel={
                showMemberKey
                  ? // eslint-disable-next-line eqeqeq
                    item => (item.key != item.name ? item.key : undefined)
                  : undefined
              }
              initialItemPredicateIndex={initialItemPredicateIndex}
              itemPredicate={itemPredicate}
              items={members}
              onChange={members => onMembersUpdate && onMembersUpdate(item, members)}
            />
          </Input.Wrapper>
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
};

export const MemoTagCut = memo(TagCut);

/**
 * @type {React.FC<{
 *  children: string,
 *  onRemove: () => void,
 * }>}
 */
const TagCutLoading = props => (
  <Card padding="xs" withBorder>
    <Group noWrap position="apart">
      <Group noWrap spacing="xs">
        <Loader size="sm" />
        <Text fz="sm" lineClamp={1}>
          {props.children}
        </Text>
      </Group>
      <CloseButton onClick={props.onRemove} />
    </Group>
  </Card>
);

/**
 * @type {React.FC<{
 *  children: string,
 *  item: import("../utils/structs").CutItem,
 *  error: string,
 *  onReload: () => void,
 *  onRemove: () => void,
 * }>}
 */
const TagCutError = props => {
  const {translate: t} = useTranslation();

  return (
    <HoverCard position="right" shadow="md" withArrow withinPortal>
      <HoverCard.Target>
        <Card padding="xs" withBorder>
          <Group noWrap position="apart">
            <Group noWrap spacing="xs">
              <ThemeIcon
                color="yellow"
                // @ts-ignore
                variant="subtle"
              >
                <IconAlertTriangle />
              </ThemeIcon>
              <Text fz="sm" lineClamp={1}>
                {props.children}
              </Text>
            </Group>
            <Group spacing="xs">
              <ActionIcon color="yellow" onClick={props.onReload} variant="subtle">
                <IconRefresh />
              </ActionIcon>
              <CloseButton onClick={props.onRemove} />
            </Group>
          </Group>
        </Card>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Alert
          color="yellow"
          icon={<IconAlertTriangle size="2rem" />}
          title={t("params.error_fetchmembers_title")}
        >
          <Stack spacing="xs">
            <Text>{t("params.error_fetchmembers_detail")}</Text>
            <Text>{props.error}</Text>
            <Button color="yellow" onClick={props.onReload}>
              {t("action_reload")}
            </Button>
          </Stack>
        </Alert>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
