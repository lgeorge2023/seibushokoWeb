'useClient'
import { useEffect, useState } from 'react';
import { Box, Button, Flex,  Title, Loader } from '@mantine/core';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';
import { get,del } from '../api/apiUtils';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import DeleteModal from '@/components/DeleteModal';
import { notifications } from '@mantine/notifications';
import formatdate from '@/utils/formatdate';
import MantineReactTables from '@/components/MantineReactTable';
import { UserManagement } from '@/utils/UserManagement';
import ProtectedRoute from '@/utils/ProtectedRoute';
import Link from 'next/link';
import { handleApiError } from '@/utils/handleApiError';


function Machines() {
  const { t } = useTranslation('common')
  const [records, setRecords] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [id,setId] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
 
  const breadcrumbs = [
    { label: t('Machines'), link: '/machines' },
  ];
  const editInfo=(row)=>{
    router.push(`/machines/add_machines/edit/${row.id}`);
    
  }
  const deleteData = async (row) => {
    setIsOpen(true);
    setId(row.id)
  };
  const fetchData = async () => {
    try {
      const data = await get('/machines/');
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
  const closeModal = () => {
    setIsOpen(false);
  };
  const hideColumn={description:false,machinemodels:false,machinetype:false}
  const handleDelete =async () => {
    try {
       const response =  await del(`/machines/${id}/`)
        notifications.show({
          title: "Success",
          message: t(response),
          color: 'green',
        });
        fetchData();
      } catch (error) {
        handleApiError(error, router, t);
      }    
      closeModal();
    };
useEffect(() => {
  fetchData();
  fetchClientId();
}, []);
const columns=[
  { header: t('Machine.Machine Id'),accessorKey:"machineid", size:100 },
  { header: t('Machine.Description'), accessorKey:"description", size:100 },
  { header: t('Machine.Machine Line'),accessorKey:"machineline", size:100 },
  { header: t('Machine.Machine Type'),accessorKey:"machinetype", size:100 },
  { header: t('Machine.Model'),accessorKey:"machinemodels", size:100 },
  { header: t('Machine.Registration Date'),
  accessorFn: (row) => {
    //convert to Date for sorting and filtering
    const sDay = new Date(row.registrationdate);

    sDay.setHours(0, 0, 0, 0); // remove time from date (useful if filter by equals exact date)

    return sDay;

  },  
  filterVariant: 'date',
  Cell: ({ renderedCellValue }) => formatdate(renderedCellValue), size:100 },
  { header: t('Machine.Registered By'),accessorKey:"registeredby", size:100 },
  { header: t('Machine.Client'),accessorKey:"client_name", size:100 },]
  return (
    <Layout breadcrumbs={breadcrumbs}>
    <Box>
    <DeleteModal isOpen={isOpen} onClose={closeModal}  onConfirm={handleDelete}/>
      <Flex justify='space-between' mb='sm'>
        <Title order={3}> {t('content.machines')}  </Title>
          {visible == 1 &&
            <Button component={Link} href='/machines/add_machines/new'>{t('Add New')}</Button>
            }
      </Flex>
<MantineReactTables column={columns} data={records} deleteData={deleteData} editInfo={editInfo} columnVisibility={hideColumn} visible={visible} loading={loading}/>
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
export default ProtectedRoute(Machines);