import { useEffect, useState,useRef } from 'react';
import { Box, Button, Flex,  Title, Loader } from '@mantine/core';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';
import { get,del } from '../api/apiUtils';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import DeleteModal from '@/components/DeleteModal';
import formatdate from '@/utils/formatdate';
import MantineReactTables from '@/components/MantineReactTable';
import { UserManagement } from '@/utils/UserManagement';
import WorkOrderListModal from '@/components/WorkOrderListModal';
import ProtectedRoute from '@/utils/ProtectedRoute';
import Link from 'next/link';
import { handleApiError } from '@/utils/handleApiError';

function MFG() {
  const { t } = useTranslation('common')
  const [records, setRecords] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [id,setId] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [MfgId,setMfgId] =useState(0);
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
  const closeModal = () => {
    setIsOpen(false);
  };
 
  const breadcrumbs = [
    { label: t('mfg'), link: '/mfg' },
  ];
  const editInfo=(row)=>{
    router.push(`/mfg/add_mfg/edit/${row.id}`);
    
  }
  const fetchData = async () => {
    try {
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
        const processedFilters = columnFilters.map(filter => {
          let filterValue = filter.value;
          
          // Handle date filters - convert to YYYY-MM-DD format
          if (filter.id === 'register_date' && filterValue instanceof Date) {
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
      const data = await get(`/mfg/page?${params.toString()}`);
      setRecords(data.results);
      setTotalCount(data.count);
      setLoading(false) 
    } catch (error) {
      handleApiError(error, router, t);
      setLoading(false);
    }
  };
  const listWorkOrders = (row) =>{
    setMfgId(row.id);
    setShowModal(true);
  }
  const fetchClientId = () =>{
    const profile_data = JSON.parse(UserManagement.getItem("profile_data") || '{}');
    const visible = profile_data?.client === 1;    
   setVisible(visible)
  }
  const deleteData = async (row) => {
    setIsOpen(true);
    setId(row.id)
  }
  const  handleDelete=async()=>{
    try {
      const response =  await del(`/mfg/${id}/`)
       notifications.show({
         title: t('Success'),
         message: t(response),
         color: 'green',
       });
       fetchData();   
     } catch (error) {
      handleApiError(error, router, t);
      }
      closeModal();
  };
  const router = useRouter();
const hideColumn={drawing_no:false,process_type:false,register_date:false,location:false,regrind_count:false,status:false}
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
    }, 500);
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
    }, 500);
    return () => clearTimeout(handler);
  }
}, [searchInput]);

useEffect(() => {
  if (isInitialMount.current) {
    isInitialMount.current = false;
    return;
  }
  fetchData();
}, [pagination, globalFilter, sorting,columnFilters]);

const  columns=[
  { header: t('MFG.MFG No'),accessorKey:"mfg_no", size:100,enableEditing: false,sortable:true},
  { header: t('MFG.Cutter No'), accessorKey:"cutter_no", size:100,enableEditing: false,sortable:true },
  { header: t('MFG.Module'),accessorKey:"module", size:100,enableEditing: false,sortable:true },
  { header: t('MFG.Drawing No'),accessorKey:"drawing_no", size:100,enableEditing: false,sortable:true },
  { header: t('MFG.Processing Type'), accessorKey:"process_type", size:100,enableEditing: false,sortable:true },
  { header: t('MFG.Registration Date'),
    accessorKey:"register_date",
  accessorFn: (row) => {
    //convert to Date for sorting and filtering
    const sDay = new Date(row.register_date);
    sDay.setHours(0, 0, 0, 0); // remove time from date (useful if filter by equals exact date)
    return sDay;
  },  
  filterVariant: 'date',
  Cell: ({ renderedCellValue }) => formatdate(renderedCellValue), size:100,enableEditing: false,sortable:true},  
  { header: t('MFG.Registered By'), accessorKey:"register_by", size:100,enableEditing: false,sortable:true},
  { header: t('MFG.Location'),accessorKey:"location", size:100,enableEditing: false,sortable:true }, 
  { header: t('MFG.Status'), accessorKey:"status", size:100,enableEditing: false,sortable:true },
  { header: t('MFG.Client'),accessorKey:"client_name", size:100,enableEditing: false,sortable:true },
  { header: t('MFG.Regrind Count'),accessorKey:"regrind_count", size:100,enableEditing: false,sortable:true },]
  return (
    <Layout breadcrumbs={breadcrumbs} >
    <Box>
      <WorkOrderListModal setShowModal={setShowModal} showModal={showModal} MfgId={MfgId}/>
      <DeleteModal isOpen={isOpen} onClose={closeModal}  onConfirm={handleDelete}/>
      <Flex justify='space-between' mb='sm'>
       <Title order={3}> {t('mfg')}  </Title>
        {visible == 1 ?  <Box>
        <Button component={Link} href='/mfg/add_mfg/new'>{t('Add New')}</Button>
      </Box>:null}
      </Flex>
    <MantineReactTables 
    column={columns} 
    data={records} 
    deleteData={deleteData} 
    editInfo={editInfo}  
    columnVisibility={hideColumn} 
    listWorkOrders={listWorkOrders} 
    page="mfg" 
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
    />
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
export default ProtectedRoute(MFG);