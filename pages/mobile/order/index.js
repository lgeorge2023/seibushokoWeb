import MantineReactTables from "@/components/MantineReactTable";
import Layout from "@/components/layout/Layout";
import { Box, Card, Flex, Grid, Input, Title } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { format } from "date-fns";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { get } from "@/pages/api/apiUtils";
import { ListSearch } from "tabler-icons-react";
import OrderDetail from "@/components/mobile/OrderDetail";

const breadcrumbs = [{ label: "Orders", link: "/mobile/order" }];

function MobOrder() {
  const { t } = useTranslation("common");
  const [isMobile, setIsMobile] = useState(false);
  const [orderdate, setOrderDate] = useState(new Date());
  const [orderecords, setOrderRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    handleResize();
    dateWiseOrder(orderdate);
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

  const dateWiseOrder = (e) => {
    let date = format(e, "yyyy-MM-dd");
    try {
      const data = get(`/order/active/${date}`);
      data.then((data) => setOrderRecords(data));
    } catch (error) {}
  };

  const orderColumns = [
    { header: t("content.orderno"), accessorKey: "order_no", size: 100,enableEditing: false, },
    { header: t("content.cutter"), accessorKey: "cutter_no", size: 100,enableEditing: false, },
    { header: t("content.MFG"), accessorKey: "mfg_no", size: 100,enableEditing: false, },
    { header: t("content.drawing"), accessorKey: "drawing_no", size: 100,enableEditing: false, },
    { header: t("content.Product"), accessorKey: "product", size: 100,enableEditing: false, },
    { header: t("content.remark"), accessorKey: "remarks", size: 100,enableEditing: false, },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Box>
        {isMobile ? (
          <Box style={{ position: "absolute", top: "50px", left: "10px" }}>
            <Card>
              <Grid gutter="sm" grow>
                <Grid.Col span={4}>
                  <Title mt="md" ml="lg" mr="lg" order={5}>
                    {t("order")}
                  </Title>
                </Grid.Col>
                <Grid.Col span={4}>
                  <MonthPickerInput
                    size="xs"
                    mt="sm"
                    mb="sm"
                    mr="md"
                    dropdownType="modal"
                    placeholder="Pick date"
                    value={orderdate}
                    maxDate={new Date()}
                    onChange={(e) => {
                      setOrderDate(e);
                      dateWiseOrder(e);
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={5}>
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
            <OrderDetail orderecords={orderecords} searchQuery={searchQuery} />
          </Box>
        ) : (
          <Card radius="md" shadow="xl" mt="lg">
            <Card.Section>
              <Flex justify="space-between">
                <Flex>
                  <Title mt="md" ml="lg" mr="lg" order={5}>
                    {t("order")}
                  </Title>
                  <MonthPickerInput
                    size="xs"
                    mt="sm"
                    mb="sm"
                    mr="md"
                    placeholder="Pick date"
                    value={orderdate}
                    maxDate={new Date()}
                    onChange={(e) => {
                      setOrderDate(e);
                      dateWiseOrder(e);
                    }}
                  />
                </Flex>
                <Flex>
                  <Box>
                    {/* <Link href='/order'className={classes.link}> {t('view All')}</Link> */}
                  </Box>
                </Flex>
              </Flex>
            </Card.Section>
            <MantineReactTables
              column={orderColumns}
              data={orderecords}
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

export default MobOrder;
