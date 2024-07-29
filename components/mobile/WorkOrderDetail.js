import { useState, useEffect } from 'react';
import { Box, Flex, Grid, Pagination, Paper, Select, Text } from '@mantine/core';
import { useTranslation } from "next-i18next";

function WorkOrderDetail({ workrecords, searchQuery, updateUrgency }) {
  const { t } = useTranslation("common");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  
  const itemsPerPage = filteredData.length > 6 ? 6 : filteredData.length;

  useEffect(() => {
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
        ...filteredFieldsworkorder
      } = item;
      return filteredFieldsworkorder;
    };

    const filteredRecordWorkorder = workrecords.map(filterFieldsworkorder);
    setData(filteredRecordWorkorder);
  }, [workrecords]);

  useEffect(()=>{
    const lowerCaseQuery = searchQuery.toLowerCase();
    const newFilteredData = data.filter((item)=>
      Object.values(item).some((value)=>
      String(value).toLowerCase().includes(lowerCaseQuery)
      )
    );
    setFilteredData(newFilteredData)
    setCurrentPage(1)
  },[searchQuery,data])

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box style={{ position: 'absolute', top: '150px', left: '0' }}>
      <Grid px='md' grow gutter='xs' mt='md'>
        {paginatedData.length == 0 ? <Paper p='9.3rem' ><Text  color='dimmed'> {t("No Records")}</Text></Paper>:
          paginatedData.map((item)=>(
                <Grid.Col span={9} key={item.id}>
                <Paper p="md" radius="md" withBorder shadow="xl">
                  <Flex justify='space-between'>
                  <Flex direction="column">
                    <Box>
                      <Flex align="Center" gap="sm">
                        <Text c="dimmed" tt="uppercase" fw={800} fz="xs">
                         {t("Work Order No")}
                        </Text>
                        <Text  fz="sm">
                          {item.work_order_no}
                        </Text>
                      </Flex>
                      <Flex align="Center" gap="sm">
                        <Text c="dimmed" tt="uppercase" fw={800} fz="xs">
                          {t("Cutter No")}
                        </Text>
                        <Text  fz="sm">
                          {item.cutter_no}
                        </Text>
                      </Flex>
                      <Flex align="Center" gap="sm">
                        <Text c="dimmed" tt="uppercase" fw={800} fz="xs">
                          {t("Mfg No")}
                        </Text>
                        <Text  fz="sm">
                          {item.mfg_no}
                        </Text>
                      </Flex>
                      <Flex align="Center" gap="sm">
                        <Text c="dimmed" tt="uppercase" fw={800} fz="xs">
                          {t("Order No")}
                        </Text>
                        <Text  fz="sm">
                          {item.order_no}
                        </Text>
                      </Flex>
                      <Flex align="Center" gap="sm">
                        <Text c="dimmed" tt="uppercase" fw={800} fz="xs">
                          {t("Order Date")}
                        </Text>
                        <Text  fz="sm">
                          {item.workorder_date}
                        </Text>
                      </Flex>
                      <Flex align="Center" gap="sm">
                        <Text c="dimmed" tt="uppercase" fw={800} fz="xs">
                          {t("Status")}
                        </Text>
                        <Text  fz="sm">
                          {item.workorder_status}
                        </Text>
                      </Flex>
                      <Flex align="Center" gap="sm">
                        <Text c="dimmed" tt="uppercase" fw={800} fz="xs">
                          {t("Urgency")}
                        </Text>
                        <Box >
                          <Select
                            data= {[
                              {value:'LIMITEDEXPRESS', label:t("LIMITEDEXPRESS")},
                              {value:'USUALLY', label: t("USUALLY")},
                            ]}
                            style={{width:'150px'}}
                            size="xs"
                            value={item.urgency}
                            onChange={(value) => updateUrgency(item.id,value)}
                          />
                        </Box>
                      </Flex>
                    </Box>
                  </Flex>
                </Flex>
                </Paper>
              </Grid.Col>
            ))}
      </Grid>
      {filteredData.length > itemsPerPage && (
        <Pagination
          page={currentPage}
          onChange={handlePageChange}
          total={Math.ceil(filteredData.length / itemsPerPage)}
          style={{ marginTop: '20px',marginBottom:'20px',display:'flex',justifyContent:'center' }}
        />
      )}
    </Box>
  );
}

export default WorkOrderDetail;
