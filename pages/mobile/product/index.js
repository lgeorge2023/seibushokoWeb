import { useEffect, useState } from "react";
import { Box, Card, Flex, Grid, Input, Title } from "@mantine/core";
import Layout from "@/components/layout/Layout";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import formatdate from "@/utils/formatdate";
import MantineReactTables from "@/components/MantineReactTable";
import { UserManagement } from "@/utils/UserManagement";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { handleApiError } from "@/utils/handleApiError";
import { get } from "@/pages/api/apiUtils";
import { ListSearch } from "tabler-icons-react";
import ProductDetail from "@/components/mobile/ProductDetail";

function MobProduct() {
  const { t } = useTranslation("common");
  const [records, setRecords] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbs = [{ label: t("Product"), link: "/product" }];
  const fetchData = async () => {
    try {
      const data = await get("/product/");
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

  const router = useRouter();

  const hideColumn = {
    measure_type: false,
    client_name: false,
    no_of_teeth: false,
    gear_dwg_no: false,
    material: false,
  };
  const columns = [
    {
      accessorKey: "cutter_no",
      header: t("Product.Cutter No"),
      sortable: true,
      size: 100,
      enableEditing: false,
    },
    { accessorKey: "product_id", header: t("Product.Product Id"), size: 100,enableEditing: false, },
    {
      accessorKey: "gear_dwg_no",
      header: t("Product.Gear Drawing No"),
      sortable: true,
      size: 100,
      enableEditing: false,
    },
    {
      header: t("Product.Registration Date"),
      accessorFn: (row) => {
        //convert to Date for sorting and filtering
        const sDay = new Date(row.register_date);
        sDay.setHours(0, 0, 0, 0); // remove time from date (useful if filter by equals exact date)
        return sDay;
      },
      filterVariant: "date",
      sortable: true,
      Cell: ({ renderedCellValue }) => formatdate(renderedCellValue),
      size: 100,
      enableEditing: false,
    },
    {
      accessorKey: "register_by",
      header: t("Product.Registered By"),
      sortable: true,
      size: 100,
      enableEditing: false,
    },
    {
      accessorKey: "module",
      header: t("Product.Module"),
      sortable: true,
      size: 100,
      enableEditing: false,
    },
    {
      accessorKey: "no_of_teeth",
      header: t("Product.No Of Teeth"),
      sortable: true,
      size: 100,
      enableEditing: false,
    },
    {
      accessorKey: "measure_type",
      header: t("Product.Measure Type"),
      sortable: true,
      size: 100,
      enableEditing: false,
    },
    {
      accessorKey: "material",
      header: t("Product.Material"),
      sortable: true,
      size: 100,
      enableEditing: false,
    },
    {
      accessorKey: "client_name",
      header: t("Product.Client"),
      sortable: true,
      size: 100,
      enableEditing: false,
    },
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
                    {t("content.productList")}
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
            <ProductDetail productRecords={records} searchQuery={searchQuery}/>
          </Box>
        ) : (
          <Box>
            <Flex justify="space-between" mb="sm">
              <Title order={3}>{t("content.productList")}</Title>
            </Flex>
            <MantineReactTables
              column={columns}
              data={records}
              noaction={true}
              columnVisibility={hideColumn}
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

export default ProtectedRoute(MobProduct);
