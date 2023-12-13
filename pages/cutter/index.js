import { useEffect, useState } from 'react';
import {  Box, Button, Flex, Title, Loader } from '@mantine/core';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router'
import { del, get } from '../api/apiUtils';
import { notifications } from '@mantine/notifications';
import DeleteModal from '@/components/DeleteModal';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import MantineReactTables from '@/components/MantineReactTable';
import WorkOrderListModal from '@/components/WorkOrderListModal';
import MFGListModal from '@/components/MFGListModal';
import { UserManagement } from '@/utils/UserManagement';
import ProtectedRoute from '@/utils/ProtectedRoute';
import Link from 'next/link';
import { handleApiError } from '@/utils/handleApiError';
 
function CutterList() {
  const { t } = useTranslation('common')
  const [records, setRecords] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [id,setId] = useState(false);
  const [cutterId, setCutterId] = useState(0);
  const [mfgCutterId,setMfgCutterId] = useState(0)
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mfgModal, setMfgModal] = useState(false);
  const [visible, setVisible] = useState(0);
const breadcrumbs = [
  { label: t('Cutter'), link: '/cutter/addcutter' },
];
  const closeModal = () => {
    setIsOpen(false);
  };
  const router = useRouter();
  const editInfo=(row)=>{
    router.push(`/cutter/addcutter/edit/${row.id}`);  
  }
  const fetchData = async () => {
    try {
      const data = await get('/cutter/');
      setRecords(data.reverse()); 
      setLoading(false);
    } catch (error) {
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
    fetchData();
    fetchClientId();
  }, []);
const hideColumn={cutter_dwg_no:false,pressure_ang:false,helix_angle:false,hardness:false,supplier:false}
  const handleDelete =async () => {
    try {
       const response =  await del(`/cutter/${id}/`)
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
  const deleteData = async (row) => {
      setIsOpen(true);
      setId(row.id)
  };
  const listWorkOrders = (row) =>{
    setCutterId(row.id);
    setShowModal(true);
  }
  const listMfg = (row) =>{
    setMfgCutterId(row.id);
    setMfgModal(true);
  }
 const columns=[
    { header: t('cutter.Cutter No'),  accessorKey: 'cutter_no',  sortable: true, size:100 },
    { header: t('cutter.Type') ,accessorKey: 'type', size:100 },
    { header: t('cutter.Cutter Drawing No'),accessorKey: 'cutter_dwg_no', sortable: true, size:100 },
    { header: t('cutter.Module'),accessorKey: 'module', sortable: true, size:100 },
    { header: t('cutter.Pressure Angle'),accessorKey: 'pressure_ang', sortable: true, size:100 },
    { header: t('cutter.Lead'),accessorKey: 'lead', sortable: true, size:100 },
    { header: t('cutter.Helix Angle'),accessorKey: 'helix_angle', sortable: true, size:100 },
    { header: t('cutter.Number Of Teeth'),accessorKey: 'no_of_teeth', sortable: true, size:100 },
    { header: t('cutter.Hardness'),accessorKey: 'hardness', sortable: true, size:100 },
    { header: t('cutter.Supplier'),accessorKey: 'supplier', sortable: true, size:100 },]
  return (
    <Layout breadcrumbs={breadcrumbs}> 
      <Box>
        <WorkOrderListModal setShowModal={setShowModal} showModal={showModal} cutterId={cutterId}/>
        <MFGListModal setMfgModal={setMfgModal} mfgModal={mfgModal} cutterId={mfgCutterId}/>
        <DeleteModal isOpen={isOpen} onClose={closeModal}  onConfirm={handleDelete}/>
        <Flex justify='space-between'>
          <Title order={3}>{t('content.cutterList')}</Title>
          <Button component={Link} mb='sm' href='cutter/addcutter/new'>{t('Add New')}</Button>
        </Flex>
        <MantineReactTables column={columns} data={records} deleteData={deleteData} editInfo={editInfo} columnVisibility={hideColumn} page={"cutter"} listWorkOrders={listWorkOrders} listMfg={listMfg} visible={visible} loading={loading}/>
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
export default ProtectedRoute(CutterList)