'useClient'
import {  IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import {  Box, Button, Flex, Title, Loader } from '@mantine/core';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';
import { get,del } from '../api/apiUtils';
import ProtectedRoute from '@/utils/ProtectedRoute';
import { IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import DeleteModal from '@/components/DeleteModal';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import MantineReactTables from '@/components/MantineReactTable';
import { UserManagement } from '@/utils/UserManagement';
import { handleApiError } from '@/utils/handleApiError';


function ClientList() {
  const { t } = useTranslation('common')
  const [records, setRecords] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [id,setId] = useState(false);
  const [visible,setVisible] = useState(0);
  const [loading, setLoading] = useState(true)
  const closeModal = () => {
    setIsOpen(false);
  };

  const breadcrumbs = [
    { label: t('Client'), link: '#' },
  ];
  const editInfo=(row)=>{
    router.push(`/client/addclient/edit/${row.id}`);  
  }
  const deleteData =  (row) => {
    setIsOpen(true);
    setId(row.id)
  };
  const handleDelete =async () => {
  try {
     const response =  await del(`/client/${id}/`)
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
  const fetchData = async () => {
    try {
      const data = await get('/client/');
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

  const router = useRouter();
  const handleAddClient = () => {
    router.push({pathname:'/client/addclient/new'});
  };
const hideColumn={active:false,contact_person1_phone:false,address:false}
  const columns=[
    { header: t('Client.Client'),accessorKey:"segment_name", size:100 },
    { header: t('Client.Address'), accessorKey:"address", size:100 },
    { header: t('Client.Phone No'),accessorKey:"contact_phone_no", size:100 },
    { header: t('Client.Person In Charge 1'),accessorKey:"contact_person1", size:100 },
    { header: t('Client.Email'), accessorKey:"contact_person1_email", size:100 },
    { header: t('Client.General Contact No'),accessorKey:"contact_person1_phone", size:100 },
    { header: t('Client.General Email'),accessorKey:"email", size:100 },
    { header: t('Clinet.Is Active'),accessorKey:"active", enableColumnActions:false, size:100, Cell: ({ renderedCellValue }) => renderedCellValue === 1 ? <IconCheck size={20} color="teal" />: <IconX size={20} color="red" />},
  ]


useEffect(() => {
  fetchData();
  fetchClientId();
}, []);

  return (
    <Layout breadcrumbs={breadcrumbs}>
<Box>
      <DeleteModal isOpen={isOpen} onClose={closeModal}  onConfirm={handleDelete} name={"client"}/>
      <Flex justify='space-between'>
        <Title order={3}> {t('content.clientList')} </Title>
        <Button mb='sm' onClick={handleAddClient}>{t('Add New')}</Button>
      </Flex>
      <MantineReactTables column={columns} data={records}  page={"client"} editInfo={editInfo} columnVisibility={hideColumn} visible={visible} loading={loading}/>
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
export default ProtectedRoute(ClientList);