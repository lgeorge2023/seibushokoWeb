import React, { useEffect, useState } from "react";
import { WelcomeCard } from "../card/WelcomeCard";
import { Box, Flex, Grid, Paper, Tabs, Text, Select } from "@mantine/core";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { get, put } from "@/pages/api/apiUtils";
import MobCard from "./MobCard";
import { notifications } from "@mantine/notifications";

function MobDashboard({ username }) {
  const { t } = useTranslation("common");
  const [mfgData, setMfgData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [workorderData, setWorkOrderData] = useState([]);

  useEffect(() => {
    mfgTableData();
    orderTableData();
    workorderTableData();
  }, []);

  const workorderTableData = async () => {
    try {
      const data = await get("/workorder/all");
      const firstSix = data.reverse().slice(0, 6);
      setWorkOrderData(firstSix);
    } catch (err) {
      console.error(err);
    }
  };
  const mfgTableData = async () => {
    try {
      const data = await get("/mfg");
      const firstSixMfg = data.slice(0, 6);
      setMfgData(firstSixMfg);
    } catch (err) {
      console.error(err);
    }
  };

  const orderTableData = async () => {
    try {
      const data = await get("/order/active");
      const firstSixOrder = data.slice(0, 6);
      setOrderData(firstSixOrder);
    } catch (err) {
      console.error(err);
    }
  };

  const filterFieldsworkorder = (item) => {
    const {
      delivery_date,
      regrind_from,
      geardrawing_no,
      product_no,
      regrind_type,
      location,
      client_name,
      inspection_report,
      ...filterFieldsworkorder
    } = item;
    return filterFieldsworkorder;
  };

  const filteredRecordWorkorder = workorderData.map(filterFieldsworkorder);

  const filterFieldsOrder = (item) => {
    const {
      id,
      client,
      client_name,
      workorder_placed,
      order_date,
      remarks,
      order_detail,
      order_line,
      regrind_type,
      order,
      ...filterFieldsOrder
    } = item;
    return filterFieldsOrder;
  };

  const filteredRecordOrder = orderData.map(filterFieldsOrder);

  const filterFieldsMfg = (item) => {
    const {
      id,
      module,
      drawing_no,
      location,
      EOL,
      supplier,
      client,
      client_name,
      regrind_count,
      ...filterFieldsMfg
    } = item;
    return filterFieldsMfg;
  };

  const filteredRecordMfg = mfgData.map(filterFieldsMfg);

  const updateUrgency = async (id, urgency) => {
    try {
      const response = await put(`/workorder/urgency/${id}/${urgency}`);
      notifications.show({
        title: t("Success"),
        message: t(response),
        color: "green",
      });
      workorderTableData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box style={{ position: "absolute", top: "80px", left: "0" }}>
      <WelcomeCard username={username} />

      <Tabs defaultValue="workorder">
        <Tabs.List>
          <Tabs.Tab value="workorder">Work Orders</Tabs.Tab>
          <Tabs.Tab value="orders">Orders</Tabs.Tab>
          <Tabs.Tab value="mfg">MFG</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="workorder">
          <Box>
            <Box>
              <Link href="/mobile/workorder" className="link">
                {t("view All")}
              </Link>
            </Box>
            <Grid px="xs" grow gutter="xs">
              {filteredRecordWorkorder.length == 0 ? (
                <Paper p="9.3rem">
                  <Text color="dimmed"> {t("No Records")}</Text>
                </Paper>
              ) : (
                filteredRecordWorkorder.map((item) => (
                  <Grid.Col span={9} key={item.id}>
                    <Paper p="md" radius="md" withBorder shadow="xl">
                      <Flex justify="space-between">
                        <Flex direction="column">
                          <Box>
                            <Flex align="Center" gap="sm">
                              <Text c="dimmed" tt="uppercase" fw={800} fz="xs">
                                {t("Work Order No")}
                              </Text>
                              <Text fz="sm">{item.work_order_no}</Text>
                            </Flex>
                            <Flex align="Center" gap="sm">
                              <Text c="dimmed" tt="uppercase" fw={800} fz="xs">
                                {t("Cutter No")}
                              </Text>
                              <Text fz="sm">{item.cutter_no}</Text>
                            </Flex>
                            <Flex align="Center" gap="sm">
                              <Text c="dimmed" tt="uppercase" fw={800} fz="xs">
                                {t("Mfg No")}
                              </Text>
                              <Text fz="sm">{item.mfg_no}</Text>
                            </Flex>
                            <Flex align="Center" gap="sm">
                              <Text c="dimmed" tt="uppercase" fw={800} fz="xs">
                                {t("Order No")}
                              </Text>
                              <Text fz="sm">{item.order_no}</Text>
                            </Flex>
                            <Flex align="Center" gap="sm">
                              <Text c="dimmed" tt="uppercase" fw={800} fz="xs">
                                {t("Order Date")}
                              </Text>
                              <Text fz="sm">{item.workorder_date}</Text>
                            </Flex>
                            <Flex align="Center" gap="sm">
                              <Text c="dimmed" tt="uppercase" fw={800} fz="xs">
                                {t("Status")}
                              </Text>
                              <Text fz="sm">{item.workorder_status}</Text>
                            </Flex>
                            <Flex align="Center" gap="sm">
                              <Text c="dimmed" tt="uppercase" fw={800} fz="xs">
                                {t("Urgency")}
                              </Text>
                              <Box>
                                <Select
                                  data={[
                                    {
                                      value: "LIMITEDEXPRESS",
                                      label: t("LIMITEDEXPRESS"),
                                    },
                                    { value: "USUALLY", label: t("USUALLY") },
                                  ]}
                                  style={{ width: "150px" }}
                                  size="xs"
                                  value={item.urgency}
                                  onChange={(value) =>
                                    updateUrgency(item.id, value)
                                  }
                                />
                              </Box>
                            </Flex>
                          </Box>
                        </Flex>
                      </Flex>
                    </Paper>
                  </Grid.Col>
                ))
              )}
            </Grid>
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="orders">
          <Box>
            <Box>
              <Link href="/mobile/order" className="link">
                {t("view All")}
              </Link>
            </Box>
            <Grid px="xs" grow gutter="xs">
              <MobCard allrecords={filteredRecordOrder} />
            </Grid>
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="mfg">
          <Box>
            <Box>
              <Link href="/mobile/mfg" className="link">
                {t("view All")}
              </Link>
            </Box>
            <Grid px="xs" grow gutter="xs">
              <MobCard allrecords={filteredRecordMfg} />
            </Grid>
          </Box>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}

export default MobDashboard;
