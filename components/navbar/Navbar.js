import { useState, useEffect } from "react";
import { UserManagement } from "@/utils/UserManagement";
import {
    IconFileAnalytics,
    IconTool,
    IconNorthStar,
    IconFridge,
    IconSquareLetterC,
    IconUser,
    IconPlayerPlay,
    IconCheckbox,
    IconFolder,
    IconDashboard,
    IconInbox,
    IconSettings,
    IconFileImport,
  } from "@tabler/icons-react";
import {
  Avatar,
  Badge,
  Box,
  Burger,
  Flex,
  NavLink,
  Navbar,
  ScrollArea,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useNavigation } from "@/context/NavigationContext";
import Link from "next/link";
import { get } from "@/pages/api/apiUtils";

export function NavbarNav() {
  const { t } = useTranslation("common");
  const [expanded, setExpanded] = useState(true);
  const [read,setunread]=useState(0);
  const [clientName, setClientName] = useState("");
  const { navLinkStates, setNavLinkStates } = useNavigation();
  const profile_data = JSON.parse(
    UserManagement.getItem("profile_data") || "{}"
  );
  useEffect(() => {
const response=get('/message/unread')
console.log('response', response)
response.then((res)=>setunread(res.unread_msgs))

  }, [])
  
  const mockdata = [
    { label: "order", icon: IconCheckbox, link: "/order" },
    {
      label: "Work_Order_Regrind",
      link: "/work_order",
      icon: IconFileAnalytics,
    },
    {
      label: "Inspection_Report",
      icon: IconFolder,
      link: "/inspection_report",
    },
    {
      label: "Registration",
      icon: IconPlayerPlay,
      visible: profile_data?.client == 1 ,
      link:"null",
      links: [
        { label: "Cutter", icon: IconTool, link: "/cutter" },
        { label: "MFG", icon: IconNorthStar, link: "/mfg" },
        { label: "Regrind Type", icon: IconSettings, link: "/regrind_type" },
        { label: "Product", icon: IconSettings, link: "/product" },
        { label: "Machines", icon: IconFridge, link: "/machines" },
        { label: "Client", icon: IconSquareLetterC, link: "/client" },
        { label: "User Management", icon: IconUser, link: "/user" },
      ],
    },
    {label: "Import/Export",icon: IconFileImport, visible: profile_data?.client == 1, link:"/importExport"},
    {
      label: "Dashboard",
      icon: IconDashboard,
      link: "/client_dashboard",
    },
    { label: "Inbox", icon: IconInbox, link: "/inbox",  rightSection:<Badge>{read}</Badge> },
  ];
  useEffect(() => {
    const client = profile_data.client_name;
    setClientName(client);
  }, []);
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure(true); 
  const [translatedMockdata, setTranslatedMockdata] = useState(mockdata);
  const handleToggleSidebar = () => {
    setExpanded((prevExpanded) => !prevExpanded);
    toggle();
  };

  useEffect(() => {
    setMockdataWithTranslatedLabels();
  }, [t,read]);

  const setMockdataWithTranslatedLabels = () => {
    const translateItem = (item) => {
      const translatedLabel = t(`${item.label}`);
      if (item.links) {
        const translatedLinks = item.links.map((linkItem) => ({
          ...linkItem,
          label: t(`${linkItem.label}`),
        }));
        return { ...item, label: translatedLabel, links: translatedLinks };
      } else {
        return { ...item, label: translatedLabel };
      }
    };
    const userMockdata = mockdata.filter((item) => item.visible !== false);
    const translatedMockdata = userMockdata.map(translateItem);
    setTranslatedMockdata(translatedMockdata);
  };
  const handleToggleNavLink = (label) => {
    // Toggle the open/closed state for a specific NavLink
    setNavLinkStates((prevStates) => ({
      ...prevStates,
      [label]: !prevStates[label],
    }));
  };
  const renderNavLink = (item) => (
    <NavLink
      opened={navLinkStates[item.label]}
      onChange={(e) => {
        handleToggleNavLink(item.label); 
      }}
      key={item.label}
      variant="filled"
      label={expanded && item.label}
      active={item.link === router.pathname}
      component={Link} href={item.link }
      icon={
        <ThemeIcon variant="light" size={30}>
          <item.icon size="1rem" stroke={1.5} />
        </ThemeIcon>
      }
      rightSection={expanded && read!==0 &&item.rightSection}
    >
      {item.links &&
        item.links.map((subItem) => (
          <NavLink
            active={subItem.link === router.pathname}
            variant="filled"
            key={subItem.label}
            label={expanded && subItem.label}
            icon={
              <ThemeIcon variant="light" size={25}>
                <subItem.icon size=".9rem" />
              </ThemeIcon>
            }
            component={Link} href={subItem.link} 
  />
        ))}
    </NavLink>
  );
  return (
    <>
      <Box>
        <Navbar width={expanded ? { base: 200 } : { base: 86 }} height="83%">
          <Burger
            p="lg"
            opened={opened}
            color="gray"
            onClick={handleToggleSidebar}
          />
          <ScrollArea type="scroll" scrollbarSize={4} offsetScrollbars>
            {translatedMockdata.map((item) => renderNavLink(item, false))}
          </ScrollArea>
        </Navbar>
      </Box>
      {expanded ? (
        <Box className="clientNameWrap">
          <Flex>
            <Avatar
              src={null}
              alt="no image here"
              color="gray"
              size="sm"
              mt=".3rem"
              mr="sm"
              radius="md"
            />
            <Text size="sm" mt=".5rem">
              {clientName}
            </Text>
          </Flex>
        </Box>
      ) : null}
    </>
  );
}
