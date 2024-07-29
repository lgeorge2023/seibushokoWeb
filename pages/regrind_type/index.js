import { useEffect, useState } from 'react';
import {Box, Button, Flex, Title, Loader } from '@mantine/core';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';
import { get,del } from '../api/apiUtils';
import { notifications } from '@mantine/notifications';
import DeleteModal from '@/components/DeleteModal';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import MantineReactTables from '@/components/MantineReactTable';
import { UserManagement } from '@/utils/UserManagement';
import ProtectedRoute from '@/utils/ProtectedRoute';
import Link from 'next/link';
import { handleApiError } from '@/utils/handleApiError';

function RegrindType() {
  const { t } = useTranslation('common')
  const [records, setRecords] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [id,setId] = useState(false);
  const [visible,setVisible] = useState(0);
  const [loading, setLoading] = useState(true);
  const closeModal = () => {
    setIsOpen(false);
  };

  const breadcrumbs = [
    { label:t('regrindType'), link: '/regrind_type' },
  ];
  const editInfo=(row)=>{
    router.push(`regrind_type/add_regrindtype/edit/${row.id}`);
    
  }
  const handleDelete =async () => {
    try {
      const response =  await del(`/regrindtype/${id}/`)
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
  const fetchData = async () => {
    try {
      const data = await get('/regrindtype/');
      setRecords(data.reverse()); 
      setLoading(false);
    } catch (error) {
      handleApiError(error, router, t);
      setLoading(false);
    }
  };
  const router = useRouter();
  const fetchClientId = () =>{
    const profile_data = JSON.parse(UserManagement.getItem("profile_data") || '{}');
    const visible = profile_data?.client === 1;    
   setVisible(visible)
  }

useEffect(() => {
  fetchData();
  fetchClientId();
}, []);
const columns=[
  { header: t('Regrind.Type'), accessorKey:"type", size:100,enableEditing: false,  } ,
  { header: t('Regrind.Axial Angle'),accessorKey:"axial_angle", size:100,enableEditing: false, }]
  return (
    <Layout breadcrumbs={breadcrumbs} >
  <Box>
    <DeleteModal isOpen={isOpen} onClose={closeModal}  onConfirm={handleDelete}/>
    <Flex justify='space-between' mb='sm'>
      <Title order={3}> {t('regrindType')}</Title>
      <Button component={Link} href='regrind_type/add_regrindtype/new'>{t('Add New')}</Button>
    </Flex>
 <MantineReactTables column={columns} data={records} deleteData={deleteData} editInfo={editInfo} visible={visible} loading={loading}/>
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
export default ProtectedRoute(RegrindType);