import { useEffect, useState } from 'react';
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
      const data = await get('/mfg/');
      setRecords(data.reverse());
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
  fetchData();
  fetchClientId();
}, []);
const  columns=[
  { header: t('MFG.MFG No'),accessorKey:"mfg_no", size:100,enableEditing: false, },
  { header: t('MFG.Cutter No'), accessorKey:"cutter_no", size:100,enableEditing: false, },
  { header: t('MFG.Module'),accessorKey:"module", size:100,enableEditing: false, },
  { header: t('MFG.Drawing No'),accessorKey:"drawing_no", size:100,enableEditing: false, },
  { header: t('MFG.Processing Type'), accessorKey:"process_type", size:100,enableEditing: false, },
  { header: t('MFG.Registration Date'),
  accessorFn: (row) => {
    //convert to Date for sorting and filtering
    const sDay = new Date(row.register_date);
    sDay.setHours(0, 0, 0, 0); // remove time from date (useful if filter by equals exact date)
    return sDay;
  },  
  filterVariant: 'date',
  Cell: ({ renderedCellValue }) => formatdate(renderedCellValue), size:100,enableEditing: false, },  
  { header: t('MFG.Registered By'), accessorKey:"register_by", size:100,enableEditing: false,},
  { header: t('MFG.Location'),accessorKey:"location", size:100,enableEditing: false, }, 
  { header: t('MFG.Status'), accessorKey:"status", size:100,enableEditing: false, },
  { header: t('MFG.Client'),accessorKey:"client_name", size:100,enableEditing: false, },
  { header: t('MFG.Regrind Count'),accessorKey:"regrind_count", size:100,enableEditing: false, },]
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
    <MantineReactTables column={columns} data={records} deleteData={deleteData} editInfo={editInfo}  columnVisibility={hideColumn} listWorkOrders={listWorkOrders} page="mfg" visible={visible} loading={loading}/>
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