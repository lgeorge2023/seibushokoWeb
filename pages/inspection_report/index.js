import Layout from "@/components/layout/Layout";
import { Box, Title, Flex, Button, Loader, Input, Card, Grid } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { get } from "../api/apiUtils";
import { useRouter } from "next/router";
import formatdate from "@/utils/formatdate";
import MantineReactTables from "@/components/MantineReactTable";
import { UserManagement } from "@/utils/UserManagement";
import ProtectedRoute from "@/utils/ProtectedRoute";
import Link from "next/link";
import { handleApiError } from "@/utils/handleApiError";
import { ListSearch } from "tabler-icons-react";
import InspectionReportDetail from "@/components/mobile/InspectionReportDetail";

function InspectionReport() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [records, setRecords] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      const data = await get("/report/");
      setRecords(data.reverse());
      setLoading(false);
    } catch (error) {
      handleApiError(error, router, t);
      setLoading(false);
    }
  };
  const fetchClientId = () => {
    const profile_data = JSON.parse(
      UserManagement.getItem("profile_data") || "{}"
    );
    const visible = profile_data?.client === 1;
    setVisible(visible);
  };

  useEffect(() => {
    handleResize();
    fetchData();
    fetchClientId();
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

  const editInfo = (row) => {
    router.push(`inspection_report/add/edit/${row.id}`);
  };
  const hideColumn = {
    gear_dwg_no: false,
    order_date: false,
    serial_no: false,
    shaving_method: false,
  };
  const columns = [
    { header: t("content.orderno"), accessorKey: "order_no", size: 100, enableEditing: false, },
    {
      header: t("workOrder.workOrderNo"),
      accessorKey: "work_order_no",
      size: 100,
      enableEditing: false,
    },
    { header: t("Customer"), accessorKey: "client_name", size: 100,enableEditing: false, },
    { header: t("Tool No"), accessorKey: "cutter_no", size: 100,enableEditing: false, },
    { header: t("Gear Dwg No"), accessorKey: "gear_dwg_no", size: 100,enableEditing: false, },
    { header: t("Person in Charge"), accessorKey: "person_charge", size: 100,enableEditing: false, },
    {
      header: t("workOrder.orderdate"),
      accessorFn: (row) => {
        //convert to Date for sorting and filtering
        const sDay = new Date(row.order_date);

        sDay.setHours(0, 0, 0, 0); // remove time from date (useful if filter by equals exact date)

        return sDay;
      },
      filterVariant: "date",
      Cell: ({ renderedCellValue }) => formatdate(renderedCellValue),
      size: 100,
      enableEditing: false,
    },
    { header: t("Serial No"), accessorKey: "serial_no", size: 100,enableEditing: false, },
    { header: t("Shaving Method"), accessorKey: "shaving_method", size: 100,enableEditing: false, },
  ];
  const breadcrumbs = [
    { label: t("inspectionReport"), link: "./inspection_report" },
  ];
  return (
    <Box>
      <Layout breadcrumbs={breadcrumbs}>
        {isMobile ? (
          <Box style={{ position: "absolute", top: "50px", left: "10px" }}>
            <Card style={{width:'400px'}}>
              <Grid>
              <Grid.Col span={5}>
                <Title mt='sm' order={5}>
                {t("inspectionReport")}
                </Title>
                </Grid.Col>
                <Grid.Col>
                  <Input
                    placeholder="Search here"
                    icon={<ListSearch />}
                    mb="md"
                    mt="md"
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(event.currentTarget.value)
                    }
                  />
                </Grid.Col>
              </Grid>
            </Card>
              <InspectionReportDetail reportRecords={records} searchQuery={searchQuery}/>
          </Box>
        ) : (
          <Box>
            <Flex justify="space-between" mb="sm">
              <Title order={3}>{t("inspectionReport")}</Title>
              {visible == 1 && (
                <Button component={Link} href="/inspection_report/add/new">
                  {t("Add New")}
                </Button>
              )}
            </Flex>
            <MantineReactTables
              column={columns}
              data={records}
              editInfo={editInfo}
              columnVisibility={hideColumn}
              visible={visible}
              loading={loading}
              page={"inspection"}
            />
          </Box>
        )}
      </Layout>
    </Box>
  );
}
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});
export default ProtectedRoute(InspectionReport);
