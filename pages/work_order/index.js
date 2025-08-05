import { useEffect, useState,useRef } from 'react';
import {  Box, Button,  Flex, Title } from '@mantine/core';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { get } from '../api/apiUtils';
import formatdate from '@/utils/formatdate';
import MantineReactTables from '@/components/MantineReactTable';
import { UserManagement } from '@/utils/UserManagement';
import ProtectedRoute from '@/utils/ProtectedRoute';
import Link from 'next/link';
import { handleApiError } from '@/utils/handleApiError';


function WorkOrderList() {
  const { t } = useTranslation('common')
  const [records, setRecords] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const isInitialMount = useRef(true);
  const isInitialSearchMount = useRef(true);
  const [searchInput, setSearchInput] = useState('');
  const [rawColumnFilters, setRawColumnFilters] = useState([]);
  const isInitialColumnFilterMount = useRef(true);
  const breadcrumbs = [{label:t("Work_Order_Regrind"),link:'./work_order'}]


  const router = useRouter();
  const fetchData = async () =>{
    try{
      setLoading(true);
      const params = new URLSearchParams({
        page: (pagination.pageIndex + 1).toString(),
        pageSize: pagination.pageSize.toString(),
      });
      
      if (globalFilter) {
        params.append('search', globalFilter);
      }
      
      if (sorting.length > 0) {
        const sort = sorting[0];
        params.append('ordering', sort.id);
        params.append('order', sort.desc ? 'desc' : 'asc');
      }
      
      if (columnFilters && columnFilters.length > 0) {
        // Process column filters and format date values
        const processedFilters = columnFilters.map(filter => {
          let filterValue = filter.value;
          
          // Handle date filters - convert to YYYY-MM-DD format
          if (filter.id === 'workorder_date' && filterValue instanceof Date) {
            const year = filterValue.getFullYear();
            const month = String(filterValue.getMonth() + 1).padStart(2, '0');
            const day = String(filterValue.getDate()).padStart(2, '0');
            filterValue = `${year}-${month}-${day}`;
          }
          
          return {
            ...filter,
            value: filterValue
          };
        });
        
        params.append('columnFilters', JSON.stringify(processedFilters));
      }
      const data = await get(`/workorder/page?${params.toString()}`);
      setRecords(data.results);
      setTotalCount(data.count);
      setLoading(false);
    }catch(error){
        handleApiError(error, router, t);
        setLoading(false);
    }
  };
  const fetchClientId = () =>{
    const profile_data = JSON.parse(UserManagement.getItem("profile_data") || '{}');
    const visible = profile_data?.client === 1;    
   setVisible(visible)
  }

  useEffect(() => {
    //fetchData();
    fetchClientId();
  }, []);
  useEffect(() => {
    if (isInitialColumnFilterMount.current) {
      isInitialColumnFilterMount.current = false;
      return;
    }
    // Only update if the contents are different
    if (JSON.stringify(rawColumnFilters) !== JSON.stringify(columnFilters)) {
      const handler = setTimeout(() => {
        setColumnFilters(rawColumnFilters);
      }, 400);
      return () => clearTimeout(handler);
    }
  }, [rawColumnFilters]);

  useEffect(() => {
    if (isInitialSearchMount.current) {
      isInitialSearchMount.current = false;
      return;
    }
    // Only update if different
    if (searchInput !== globalFilter) {
      const handler = setTimeout(() => {
        setGlobalFilter(searchInput);
      }, 400);
      return () => clearTimeout(handler);
    }
  }, [searchInput]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchData();
  }, [pagination, globalFilter, sorting, columnFilters]);

  const editInfo=(row)=>{
    router.push(`work_order/add_workorder/edit/${row.id}`);
    
  }
  const hideColumn={geardrawing_no:false,product_no:false,workorder_date:false,order_no:false,location:false,regrind_type:false,mfg_no:false}
  const columns= [
      { header: t('workOrder.workOrderNo'), accessorKey:"work_order_no", size:100,enableEditing: false,sortable:true },
      { header: t('workOrder.cutterno'),accessorKey:"cutter_no",size:100,enableEditing: false,sortable:true },
      { header: t('workOrder.mfgno'), accessorKey:"mfg_no", size:100,enableEditing: false,sortable:true },
      { header: t('workOrder.geardrwno'),accessorKey:"geardrawing_no", sortable: true, size:100,enableEditing: false,sortable:true },
      { header: t('workOrder.productNo'),accessorKey:"product_no", sortable: true, size:100,enableEditing: false,sortable:true },
      { header: t('workOrder.orderno'), accessorKey:"order_no", size:100, enableEditing: false,sortable:true },
      { header: t('regrindType'),accessorKey:"regrind_type", sortable: true, size:100,enableEditing: false,sortable:true  },
      { header: t('workOrder.regirndform'), accessorKey:"regrind_from", size:100,enableEditing: false,sortable:true,Cell:({cell}) => t(cell.row.original.regrind_from)   },
      { header: t('workOrder.urgency'),accessorKey:"urgency", sortable: true, size:100,enableEditing: false,sortable:true, Cell:({cell}) => t(cell.row.original.urgency)  },
      { header: t('workOrder.status'), accessorKey:'workorder_status', size:100,enableEditing: false,sortable:true, Cell:({cell}) => t(cell.row.original.workorder_status) },
      { header: t('workOrder.orderdate'),
        accessorKey:"workorder_date",
      accessorFn: (row) => {
        //convert to Date for sorting and filtering
        const sDay = new Date(row.workorder_date);
    
        sDay.setHours(0, 0, 0, 0); // remove time from date (useful if filter by equals exact date)
    
        return sDay;
    
      },  
      filterVariant: 'date',
     Cell: ({ renderedCellValue }) => formatdate(renderedCellValue), size:100, enableEditing: false,sortable:true },
      { header: t('workOrder.location'),accessorKey:"location", sortable: true, size:100,enableEditing: false,sortable:true, Cell:({cell}) => t(cell.row.original.location)   },
      { header: t('client'), accessorKey:"client_name", size:100,enableEditing: false,sortable:true },
 
  ]
 const rowStyle =(row) => ({
    sx: {
      "&>td": {
        background:
          row.row.original.regrind_from == "CUSTOMERRETURN"
            ? "#facbcb"
            : row.row.original.urgency == "LIMITEDEXPRESS"
            ? "#F7DC6F"
            : undefined,
      },
    },
  })
  return (
    <Layout  breadcrumbs={breadcrumbs}>
    <Box>
      <Flex justify='space-between'mb='sm'>
      <Title order={3}>{t('content.workOrderList')}</Title>
  {visible == 1 &&
  <Button component={Link} href='/work_order/add_workorder/new'>{t('Add New')}</Button>
  }
  </Flex>
  <MantineReactTables column={columns} 
    data={records} 
    editInfo={editInfo} 
    columnVisibility={hideColumn} 
    page={"workorder"} 
    visible={visible} 
    loading={loading}  
    pagination={pagination}
    setPagination={setPagination}
    totalCount={totalCount}
    globalFilter={globalFilter}
    setGlobalFilter={setGlobalFilter}
    searchInput={searchInput}
    setSearchInput={setSearchInput}
    sorting={sorting}
    setSorting={setSorting}
    columnFilters={columnFilters}
    setColumnFilters={setColumnFilters}
    rawColumnFilters={rawColumnFilters}
    setRawColumnFilters={setRawColumnFilters}
    enableServerSidePagination={true}
    enableServerSideSearch={true}
    enableServerSideSorting={true}
    enableServerSideColumnFilters={true} 
    TableRowStyle= {rowStyle}/>
</Box>
     </Layout>
  );
}
export const getStaticProps = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', [
      'common'
    ])),
  },
})
export default ProtectedRoute(WorkOrderList);