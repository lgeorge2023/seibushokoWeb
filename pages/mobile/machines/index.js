import MantineReactTables from "@/components/MantineReactTable";
import Layout from "@/components/layout/Layout";
import { get } from "@/pages/api/apiUtils";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { Box, Card, Flex, Grid, Input, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import formatdate from "@/utils/formatdate";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { UserManagement } from "@/utils/UserManagement";
import { ListSearch } from "tabler-icons-react";
import MachinesDetail from "@/components/mobile/MachinesDetail";

function MobMachines() {
  const { t } = useTranslation("common");
  const [records, setRecords] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbs = [{ label: t("Machines"), link: "/mobile/machines" }];

  const fetchData = async () => {
    try {
      const data = await get("/machines/");
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

  const hideColumn = {
    description: false,
    machinemodels: false,
    machinetype: false,
  };

  useEffect(() => {
    fetchData();
    fetchClientId();
    handleResize();
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

  const columns = [
    { header: t("Machine.Machine Id"), accessorKey: "machineid", size: 100,enableEditing: false, },
    { header: t("Machine.Description"), accessorKey: "description", size: 100,enableEditing: false, },
    {
      header: t("Machine.Machine Line"),
      accessorKey: "machineline",
      size: 100,
      enableEditing: false,
    },
    {
      header: t("Machine.Machine Type"),
      accessorKey: "machinetype",
      size: 100,
      enableEditing: false,
    },
    { header: t("Machine.Model"), accessorKey: "machinemodels", size: 100,enableEditing: false, },
    {
      header: t("Machine.Registration Date"),
      accessorFn: (row) => {
        //convert to Date for sorting and filtering
        const sDay = new Date(row.registrationdate);

        sDay.setHours(0, 0, 0, 0); // remove time from date (useful if filter by equals exact date)

        return sDay;
      },
      filterVariant: "date",
      Cell: ({ renderedCellValue }) => formatdate(renderedCellValue),
      size: 100,
      enableEditing: false,
    },
    {
      header: t("Machine.Registered By"),
      accessorKey: "registeredby",
      size: 100,
      enableEditing: false,
    },
    { header: t("Machine.Client"), accessorKey: "client_name", size: 100,enableEditing: false, },
  ];
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Box>
        {isMobile ? (
          <Box style={{ position: "absolute", top: "50px", left: "10px" }}>
            <Card style={{ width: "400px" }}>
              <Grid gutter="sm" grow>
                <Grid.Col span={5}>
                  <Title mt="sm" order={5}>
                    {t("content.machines")}
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
            <MachinesDetail machineRecords={records} searchQuery={searchQuery}/>
          </Box>
        ) : (
          <Box>
            <Flex justify="space-between" mb="sm">
              <Title order={3}> {t("content.machines")} </Title>
            </Flex>
            <MantineReactTables
              column={columns}
              data={records}
              noaction={true}
              columnVisibility={hideColumn}
              visible={visible}
              loading={loading}
            />
          </Box>
        )}
      </Box>
    </Layout>
  );
}
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});

export default ProtectedRoute(MobMachines);
