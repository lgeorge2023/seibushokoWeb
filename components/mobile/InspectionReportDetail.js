import { useState, useEffect } from 'react';
import { Box, Flex, Grid, Pagination, Paper, Text } from '@mantine/core';
import { useTranslation } from "next-i18next";
import { IconDownload } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { downloadFile } from '@/pages/api/downloadFile';

function InspectionReportDetail({ reportRecords, searchQuery, }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const language =router.locale;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  
  const itemsPerPage = filteredData.length > 6 ? 6 : filteredData.length;

  useEffect(() => {
    const filterFieldsReports = (item) => {
      const {
        gear_dwg_no,
        client,
        client_name,
        shaving_method,
        ...filteredFieldsReports
      } = item;
      return filteredFieldsReports;
    };

    const filteredRecordReports = reportRecords.map(filterFieldsReports);
    setData(filteredRecordReports);
  }, [reportRecords]);

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

  const downloadExcelFile  = async (id) =>{
    const fileUrl = `/report/print/${language}/${id}/`
    await downloadFile(fileUrl,"InspectionReport.zip",t)
  } 

  return (
    <Box style={{ position: 'absolute', top: '150px', left: '0' }}>
      <Grid px='md' grow gutter='xs' mt='md'>
        {paginatedData.length == 0 ? <Text mt='5rem' ml='1rem' color='dimmed'>{t("No Records To Show")}</Text>:
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
                          {t("Person in Charge")}
                        </Text>
                        <Text  fz="sm">
                          {item.person_charge}
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
                          {item.order_date}
                        </Text>
                      </Flex>
                      <Flex align="Center" gap="sm">
                        <Text c="dimmed" tt="uppercase" fw={800} fz="xs">
                          {t("Serial No")}
                        </Text>
                        <Text  fz="sm">
                          {item.serial_no}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                  <IconDownload onClick={()=>downloadExcelFile(item.id)} color="green" size='20px'/>
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

export default InspectionReportDetail;
