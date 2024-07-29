import MantineReactTables from "@/components/MantineReactTable";
import Layout from "@/components/layout/Layout";
import { Box, Card, Flex, Grid, Input, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { get } from "@/pages/api/apiUtils";
import formatdate from "@/utils/formatdate";
import { ListSearch } from "tabler-icons-react";
import MfgDetailPage from "@/components/mobile/MfgDetail";

const breadcrumbs = [{ label: "MFG", link: "/mobile/order" }];

function MfgDetail() {
  const { t } = useTranslation("common");
  const [isMobile, setIsMobile] = useState(false);
  const [mfgRecords, setMfgRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    handleResize();
    mfgTableData();
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

  const mfgTableData = async () => {
    try {
      const data = await get("/mfg/");
      setMfgRecords(data);
    } catch (error) {
      console.error(error);
    }
  };

  const mfgColumns = [
    { header: t("MFG.MFG No"), accessorKey: "mfg_no", size: 100,enableEditing: false, },
    { header: t("MFG.Cutter No"), accessorKey: "cutter_no", size: 100,enableEditing: false, },
    {
      header: t("MFG.Processing Type"),
      accessorKey: "process_type",
      size: 100,
      enableEditing: false,
    },
    {
      header: t("MFG.Registration Date"),
      accessorFn: (row) => {
        //convert to Date for sorting and filtering
        const sDay = new Date(row.register_date);
        sDay.setHours(0, 0, 0, 0); // remove time from date (useful if filter by equals exact date)
        return sDay;
      },
      filterVariant: "date",
      Cell: ({ renderedCellValue }) => formatdate(renderedCellValue),
      size: 100,
      enableEditing: false,
    },
    { header: t("MFG.Registered By"), accessorKey: "register_by", size: 100,enableEditing: false, },
    { header: t("MFG.Status"), accessorKey: "status", size: 100,enableEditing: false, },
    { header: t("MFG.Client"), accessorKey: "client_name", size: 100,enableEditing: false, },
  ];
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Box >
        {isMobile ? (
          <Box style={{ position: "absolute", top: "50px", left: "10px" }}>
            <Card style={{width:'400px'}}>
              <Grid gutter="sm"  grow>
                <Grid.Col span={5}>
                <Title mt='sm' order={4}>
                  {t("mfg")}
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
            <MfgDetailPage mfgRecords={mfgRecords} searchQuery={searchQuery}/>
          </Box>
        ) : (
          <Card radius="md" shadow="xl" mt="lg">
            <Card.Section>
              <Flex justify="space-between">
                <Title ml="lg" mb="sm" order={5}>
                  {t("mfg")}
                </Title>
              </Flex>
            </Card.Section>
            <MantineReactTables
              column={mfgColumns}
              data={mfgRecords}
              search={false}
              pagination={false}
              noaction={true}
            />
          </Card>
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
export default MfgDetail;
