import { useState, useEffect } from 'react';
import { Box, Grid, Pagination } from '@mantine/core';
import MobCard from './MobCard';

function OrderDetail({orderecords,searchQuery}) {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([]);
    
    const itemsPerPage = filteredData.length > 6 ? 6 : filteredData.length;
  
    useEffect(() => {
      const filterFieldsOrder = (item) => {
        const {
            id, client, client_name, workorder_placed, order_date, remarks, order_detail, order_line, regrind_type, order,
          ...filteredFieldsworkorder
        } = item;
        return filteredFieldsworkorder;
      };
  
      const filteredRecordOrder = orderecords.map(filterFieldsOrder);
      setData(filteredRecordOrder);
    }, [orderecords]);
  
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
          <MobCard allrecords={paginatedData} />
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
  

export default OrderDetail