import { useEffect, useState } from 'react';
import { Box, Button, Flex, Loader, Title } from '@mantine/core';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { del, get } from '../api/apiUtils';
import { notifications } from '@mantine/notifications';
import DeleteModal from '@/components/DeleteModal';
import MantineReactTables from '@/components/MantineReactTable';
import { UserManagement } from '@/utils/UserManagement';
import ProtectedRoute from '@/utils/ProtectedRoute';
import Link from 'next/link';
import { handleApiError } from '@/utils/handleApiError';

function UserList() {
  const { t } = useTranslation('common')
  const [records, setRecords] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [id,setId] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const breadcrumbs = [{ label: t('User Management'), link: '/user' },];

  const router = useRouter();
  const fetchData = async () =>{
    try{
      const data = await get('/staff/');
      const superAdminRemoved = data.filter((item)=> item.id != 1 );
      setRecords(superAdminRemoved.reverse());
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
    fetchData();
    fetchClientId();
  }, []);

  const handleDelete = async () =>{
    try{
      const response = await del(`/staff/${id}/`)
      notifications.show({
        title:t("Success"),
        message: t(response),
        color:'green'
      });
      fetchData();
    }catch(error){
      handleApiError(error, router, t);
    }
    closeModal();
  }
  
  const editInfo=(row)=>{
    router.push(`/user/adduser/edit/${row.user_id}`); 
  }

  const deleteUser= (row) =>{
    setIsOpen('true');
    setId(row.user_id);
  }
  const closeModal = () => {
    setIsOpen(false);
  };
  const hideColumn={
    email_cc:false,full_name:false
  }
  const columns=[
    { header:t("User.User Name"),accessorKey: 'username', size:100,enableEditing: false, },
    { header:t("User.Email"),accessorKey: 'email', size:100,enableEditing: false, },
    { header:t("User.Full Name"),accessorKey: 'full_name', size:100,enableEditing: false, },
    { header:t("User.Role"),accessorKey:'role', size:100,enableEditing: false, },
    { header:t("User.Client/Segment"),accessorKey: 'client', size:100,enableEditing: false, },
    { header:"CC",accessorKey: 'email_cc', size:100,enableEditing: false, },]
  return (
    <Layout breadcrumbs ={breadcrumbs}>
    <Box>
      <DeleteModal isOpen={isOpen} onClose={closeModal} onConfirm={handleDelete} name={"user"}/>
      <Flex justify='space-between' mb='sm'>
        <Title order={3}> {t('content.userList')} </Title>
          {visible == 1 ?<Box>
            <Button component={Link} href='/user/adduser/new'>{t('Add New')}</Button>
            </Box>:null}
      </Flex>
    <MantineReactTables column={columns} data={records} deleteData={deleteUser} editInfo={editInfo} columnVisibility={hideColumn} visible={visible} loading={loading}/>
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
export default ProtectedRoute(UserList);