import Layout from "@/components/layout/Layout";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Box, Card, Flex, Input, Title } from "@mantine/core";
import { DatesProvider, MonthPickerInput } from "@mantine/dates";
import MantineReactTables from "@/components/MantineReactTable";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { get, put } from "@/pages/api/apiUtils";
import { notifications } from "@mantine/notifications";
import WorkOrderDetail from "@/components/mobile/WorkOrderDetail";
import { ListSearch } from 'tabler-icons-react';
import 'dayjs/locale/ja';

const breadcrumbs = [{ label: "Workorders", link: "/mobile/workorder" }];

function MobWorkorder() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [clearMonth, setClearMonth] = useState(true);
  const [dateRange, setDateRange] = useState([]);
  const [clearMonthRange, setClearMonthRange] = useState(true);
  const [date, setDate] = useState(null);
  const [workrecords, setWorkRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    handleResize();
    workorderTableData();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    if (window.innerWidth <= 600) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };
  const workorderTableData = async () => {
    try {
      const data = await get("/workorder/all");
      const reverseData = data.reverse();
      setWorkRecords(reverseData);
    } catch (err) {
      console.error(err);
    }
  };

  function isValidDateFormat(dateString) {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateFormatRegex.test(dateString);
  }

  const dateWiseWorkorder = (fromDate, toDate) => {
    try {
      if (!isValidDateFormat(fromDate) || !isValidDateFormat(toDate)) {
        fromDate = format(fromDate, "yyyy-MM-dd");
        toDate = format(toDate, "yyyy-MM-dd");
      }

      const data = get(`/workorder/all/${fromDate}/${toDate}`);
      data.then((data) => setWorkRecords(data));
    } catch (error) {
      // console.error("Error:", error);
    }
  };
  const updateUrgency = async (id, urgency) => {
    try {
      const response = await put(`/workorder/urgency/${id}/${urgency}`);
      notifications.show({
        title: t("Success"),
        message: t(response),
        color: "green",
      });
      setWorkRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.id === id ? { ...record, urgency } : record
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const dropdata = [t("LIMITEDEXPRESS"), t("USUALLY")];
  const hideColumn = { delivery_date: false };
  const columns = [
    {
      header: t("workOrder.workOrderNo"),
      accessorKey: "work_order_no",
      size: 100,
      enableEditing: false,
    },
    { header: t("workOrder.cutterno"), accessorKey: "cutter_no", size: 100,enableEditing: false, },
    { header: t("workOrder.mfgno"), accessorKey: "mfg_no", size: 100,enableEditing: false, },
    { header: t("workOrder.orderno"), accessorKey: "order_no", size: 100,enableEditing: false, },
    {
      header: t("workOrder.urgency"),
      accessorKey: "urgency",
      size: 100,
      editVariant: "select",
      mantineEditSelectProps: ({ row }) => ({
        data: dropdata,
        onChange: (value) => {
          const { id } = row.original;
          updateUrgency(id, value);
        },
      }),
      Cell: ({ cell }) => t(cell.row.original.urgency),
    },
    {
      header: t("workOrder.orderdate"),
      accessorKey: "workorder_date",
      size: 100,
      enableEditing: true,
    },
    { header: t("Estimated Finish"), accessorKey: "delivery_date", size: 100,enableEditing: false, },
    {
      header: t("status"),
      accessorKey: "workorder_status",
      size: 100,
      enableEditing: false,
      Cell: ({ cell }) => t(cell.row.original.workorder_status),
    },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Box>
        {isMobile ? (
            <Box  style={{ position: 'absolute', top: '50px', left: '10px' }}>
                <Card>
                <Title order={4}>{t('content.workOrderList')}</Title>
                    <Flex gap='xl' px='xl'>
                <DatesProvider settings={{ locale: router.locale }}>
                      <MonthPickerInput
                        size="xs"
                        mt="md"
                        mr="md"
                        dropdownType="modal"
                        placeholder={t("Pick a month")}
                        clearable
                        maxDate={new Date()}
                        value={clearMonth ? date : null}
                        onChange={(e) => {
                          setClearMonth(true);
                          let date = e !== null && format(e, "yyyy-MM-dd");
                          setDate(e);
                          dateWiseWorkorder(date, date);
                          if (e == null) {
                            setWorkRecords([]);
                            setClearMonthRange(false);
                          }
                        }}
                      />
                      <Title size=".80rem" mt="xl" mr="sm" c>
                        OR
                      </Title>
                      <MonthPickerInput
                        size="xs"
                        mt="md"
                        mr="md"
                        dropdownType="modal"
                        type="range"
                        clearable
                        placeholder={t("Pick month range")}
                        value={clearMonthRange ? dateRange : []}
                        maxDate={new Date()}
                        onChange={(e) => {
                          setDateRange(e);
                          setClearMonthRange(true);
                          let firstDate =
                            e[0] !== null && format(e[0], "yyyy-MM-dd");
                          let secondDate =
                            e[1] !== null && format(e[1], "yyyy-MM-dd");
                          dateWiseWorkorder(firstDate, secondDate);
                          if (e[0] == null && e[1] == null) {
                            setWorkRecords([]);
                            setClearMonth(false);
                          }
                        }}
                      />
                    </DatesProvider>
                    </Flex>
                    <Input
                    placeholder="Search here"
                    icon={<ListSearch/>}
                    mb='md'
                    mt='md'
                    value={searchQuery}
                    onChange={(event)=>setSearchQuery(event.currentTarget.value)}
                  />
                    </Card>
                <WorkOrderDetail workrecords={workrecords} searchQuery={searchQuery} updateUrgency={updateUrgency}/>
            </Box>
        ) : (
          <Box>
            <Card radius="md" mt="lg">
              <Card.Section>
                <Flex justify="space-between">
                  <Flex gap="lg" align="center" mb="md">
                    <Title order={5} mt="sm" ml="lg">
                      {t("Workorder")}
                    </Title>
                    <DatesProvider settings={{ locale:  router.locale }}>
                      <MonthPickerInput
                        size="xs"
                        mt="md"
                        mr="md"
                        placeholder={t("Pick a month")}
                        clearable
                        maxDate={new Date()}
                        value={clearMonth ? date : null}
                        onChange={(e) => {
                          console.log("is chnage");
                          setClearMonth(true);
                          let date = e !== null && format(e, "yyyy-MM-dd");
                          setDate(e);
                          dateWiseWorkorder(date, date);
                          if (e == null) {
                            setWorkRecords([]);
                            setClearMonthRange(false);
                          }
                        }}
                      />
                      <Title size=".80rem" mt="xl" mr="sm" c>
                        OR
                      </Title>
                      <MonthPickerInput
                        size="xs"
                        mt="md"
                        mr="md"
                        type="range"
                        clearable
                        placeholder={t("Pick month range")}
                        value={clearMonthRange ? dateRange : []}
                        maxDate={new Date()}
                        onChange={(e) => {
                          setDateRange(e);
                          setClearMonthRange(true);
                          let firstDate =
                            e[0] !== null && format(e[0], "yyyy-MM-dd");
                          let secondDate =
                            e[1] !== null && format(e[1], "yyyy-MM-dd");
                          dateWiseWorkorder(firstDate, secondDate);
                          if (e[0] == null && e[1] == null) {
                            setWorkRecords([]);
                            setClearMonth(false);
                          }
                        }}
                      />
                    </DatesProvider>
                  </Flex>
                  <Flex>
                    <Box>
                      {/* <Link href='/work_order'className={classes.link}> {t('view All')}</Link> */}
                    </Box>
                  </Flex>
                </Flex>
              </Card.Section>
              <MantineReactTables
                column={columns}
                page={"dash-wo"}
                data={workrecords}
                columnVisibility={hideColumn}
                noaction={true}
              />
            </Card>
          </Box>
        )}
      </Box>
    </Layout>
  );
}
export const getStaticProps = async ({
    locale,
  }) => ({
    props: {
      ...(await serverSideTranslations(locale ?? 'en', [
        'common'
      ])),
    },
  })

export default MobWorkorder;
