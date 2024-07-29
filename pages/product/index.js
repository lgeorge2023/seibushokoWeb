import { useEffect, useState } from 'react';
import {  Box, Button, Group, Flex, Paper, Title, Loader } from '@mantine/core';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';
import { del, get } from '../api/apiUtils';
import DeleteModal from '@/components/DeleteModal';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import formatdate from '@/utils/formatdate';
import MantineReactTables from '@/components/MantineReactTable';
import { UserManagement } from '@/utils/UserManagement';
import ProtectedRoute from '@/utils/ProtectedRoute';
import Link from 'next/link';
import { handleApiError } from '@/utils/handleApiError';
function ProductList() {
  const { t } = useTranslation('common')
  const [records, setRecords] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [id,setId] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const breadcrumbs = [
    { label: t('Product'), link: '/product' },
  ];
  const fetchData = async () => {
    try {
      const data = await get('/product/');
      setRecords(data.reverse());
      setLoading(false) 
    } catch (error) {
      handleApiError(error, router, t);
      setLoading(false) 
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
  const deleteData = async (row) => {
    setIsOpen(true);
    setId(row.id)
  };
  const handleDelete =async () => {
    try {
      const response =  await del(`/product/${id}/`)
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

  const closeModal = () => {
    setIsOpen(false);
  };
  const router = useRouter();
  const editInfo=(row)=>{
    router.push(`/product/add_product/edit/${row.id}`);
    
  }
  const hideColumn={measure_type:false,client_name:false,no_of_teeth:false,gear_dwg_no:false,material:false}
const  columns=[
  { accessorKey:'cutter_no', header:t('Product.Cutter No'),  sortable: true, size:100,enableEditing: false,  },
  { accessorKey: 'product_id',header:t('Product.Product Id'), size:100,enableEditing: false,  },
  { accessorKey: 'gear_dwg_no',header:t('Product.Gear Drawing No'), sortable: true, size:100,enableEditing: false,  },
  { header:t('Product.Registration Date'),
  accessorFn: (row) => {
    //convert to Date for sorting and filtering
    const sDay = new Date(row.register_date);

    sDay.setHours(0, 0, 0, 0); // remove time from date (useful if filter by equals exact date)

    return sDay;

  },  
  filterVariant: 'date',
  sortable: true,Cell: ({ renderedCellValue }) => formatdate(renderedCellValue), size:100,enableEditing: false, },
  { accessorKey: 'register_by',header:t('Product.Registered By'), sortable: true, size:100,enableEditing: false,  },
  { accessorKey: 'module',header:t('Product.Module'), sortable: true, size:100,enableEditing: false,  },
  { accessorKey: 'no_of_teeth',header:t('Product.No Of Teeth'), sortable: true, size:100,enableEditing: false,  },
  { accessorKey: 'measure_type',header:t('Product.Measure Type'), sortable: true, size:100,enableEditing: false,  },
  { accessorKey: 'material',header:t('Product.Material'), sortable: true, size:100,enableEditing: false,  },
  { accessorKey: 'client_name',header:t('Product.Client'), sortable: true, size:100,enableEditing: false,  },]
  return (
    <Layout breadcrumbs={breadcrumbs} >
    <Box>
    <DeleteModal isOpen={isOpen} onClose={closeModal}  onConfirm={handleDelete}/>

    <Flex justify='space-between' mb='sm'>
      <Title order={3}>{t('content.productList')}</Title>
      {visible == 1 ?<Box>
        <Button component={Link} href="/product/add_product/new" >{t('Add New')}</Button>
        </Box>:null}
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

export default ProtectedRoute(ProductList);