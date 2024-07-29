import { Box, Grid, Pagination } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import MobCard from './MobCard';

function ProductDetail({productRecords,searchQuery}) {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([]);
    
    const itemsPerPage = filteredData.length > 6 ? 6 : filteredData.length;
  
    useEffect(() => {
      const filterFieldsProduct = (item) => {
        const {
            id, module, drawing_no, register_by, client, client_name, ...filteredFieldsProduct 
        } = item;
        return filteredFieldsProduct;
      };
  
      const filteredRecordOrder = productRecords.map(filterFieldsProduct);
      setData(filteredRecordOrder);
    }, [productRecords]);
  
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

export default ProductDetail