import {
  Box,
  Card,
  Title,
  createStyles,
  rem,
  Anchor,
  Flex,
} from "@mantine/core";
import Link from "next/link";
import { StatusGroup } from "./StatusGroup";
import { WelcomeCard } from "./WelcomeCard";
import { useTranslation } from "next-i18next";
import formatdate from "@/utils/formatdate";
import { MonthPickerInput, DatesProvider } from "@mantine/dates";
import { useEffect, useState } from "react";
import { parseISO } from "date-fns";
import { format } from "date-fns";
import { get } from "@/pages/api/apiUtils";
import MantineReactTables from "../MantineReactTable";
import 'dayjs/locale/ja';

const useStyle = createStyles((theme) => ({
  section: {
    padding: theme.spacing.lg,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  link: {
    padding: theme.spacing.lg,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily:
      "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji",
    color: "#228be6",
    textDecoration: "none",
    transition: "text-decoration 0.2s ease",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

export default function AdminDashboard({ records, username, locale }) {
  const { classes } = useStyle();
  const { t } = useTranslation("common");
  const [date, setDate] = useState(new Date());
  const [dateRange,setDateRange] = useState([])
  const [clearMonth, setClearMonth] = useState(true);
  const [clearMonthRange,setClearMonthRange] = useState(true);
  const [toolsCount, setToolsCount] = useState([]);
  const tableData = records.slice(0, 6);
  const [workrecords, setWorkRecords] = useState([]);
  useEffect(() => {
    dateWiseWorkorder(date, date);
  }, []);
  function isValidDateFormat(dateString) {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateFormatRegex.test(dateString);
  }

  // const dateWiseWorkorder=(fromDate,toDate)=>{
  //   try {
  //     const data = get(`/workorder/all/${fromDate}/${toDate}`);
  //     data.then((data)=>  setWorkRecords(data));
  //     const toolsData = get(`/workorder/tools/${fromDate}/${toDate}`);
  //     toolsData.then((data)=> setToolsCount(data))
  //   } catch (error) {
  //   }
  // }
  const dateWiseWorkorder = (fromDate, toDate) => {
    try {
      if (!isValidDateFormat(fromDate) || !isValidDateFormat(toDate)) {
        fromDate = format(fromDate, "yyyy-MM-dd");
        toDate = format(toDate, "yyyy-MM-dd");
      }

      const data = get(`/workorder/all/${fromDate}/${toDate}`);
      data.then((data) => setWorkRecords(data));

      const toolsData = get(`/workorder/tools/${fromDate}/${toDate}`);
      toolsData.then((data) => setToolsCount(data));
    } catch (error) {
      // console.error("Error:", error);
    }
  };
  const columns = [
    {
      header: t("workOrder.workOrderNo"),
      accessorKey: "work_order_no",
      size: 100,
    },
    { header: t("Client Name"), accessorKey: "client_name", size: 80 },
    { header: t("workOrder.cutterno"), accessorKey: "cutter_no", size: 80 },
    { header: t("workOrder.mfgno"), accessorKey: "mfg_no", size: 80 },
    // { header: t('workOrder.geardrwno'), accessorKey: "geardrawing_no", size:100 },
    { header: t("workOrder.orderno"), accessorKey: "order_no", size: 100 },
    {
      header: t("workOrder.orderdate"),
      accessorKey: "workorder_date",
      Cell: ({ renderedCellValue }) => formatdate(renderedCellValue),
      size: 100,
    },
    {
      header: t("Estimated Finish"),
      accessorKey: "delivery_date",
      Cell: ({ renderedCellValue }) => formatdate(renderedCellValue),
      size: 100,
    },
    { header: t("status"), accessorKey: "workorder_status", size: 100, Cell:({cell}) => t(cell.row.original.workorder_status)  },
  ];
  return (
    <Box>
      <WelcomeCard username={username} />
      <StatusGroup data={toolsCount} />
      <Card radius="md" shadow="xl" mt="lg">
        <Card.Section>
          <Flex justify="space-between">
            <Flex>
              <Title className={classes.section} order={5}>
                {t("Workorder")}
              </Title>
              <DatesProvider settings={{locale:locale}}>
              <MonthPickerInput
                size="xs"
                mt="md"
                mr="md"
                placeholder="Pick a month"
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
                    setClearMonthRange(false)
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
                placeholder="Pick month range"
                value={clearMonthRange ? dateRange : []}
                maxDate={new Date()}
                onChange={(e) => {
                  setDateRange(e)
                  setClearMonthRange(true)
                  let firstDate = e[0] !== null && format(e[0], "yyyy-MM-dd");
                  let secondDate = e[1] !== null && format(e[1], "yyyy-MM-dd");
                  dateWiseWorkorder(firstDate, secondDate);
                  if (e[0] == null && e[1] == null) {
                    setWorkRecords([]);
                    setClearMonth(false);
                    // setToolsCount([])
                  }
                }}
              />
              </DatesProvider>
            </Flex>
            <Flex>
              <Box>
                <Link href="/work_order" className={classes.link}>
                  {" "}
                  {t("view All")}
                </Link>
              </Box>
            </Flex>
          </Flex>
        </Card.Section>
        <MantineReactTables
          column={columns}
          data={workrecords}
          search={false}
          pagination={false}
          noaction={true}
        />
      </Card>
    </Box>
  );
}
