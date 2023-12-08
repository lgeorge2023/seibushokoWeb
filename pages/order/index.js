import {  IconArchiveFilled } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Anchor, Box, Button,  Flex,  Loader, Title, UnstyledButton } from '@mantine/core';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { get } from '../api/apiUtils';
import Link from 'next/link';
import formatdate from '@/utils/formatdate';
import MantineReactTables from '@/components/MantineReactTable';
import { UserManagement } from '@/utils/UserManagement';
import ProtectedRoute from '@/utils/ProtectedRoute';



  function OrderListing() {
  const { t } = useTranslation('common')
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();
  const [show_archive, setshowArchived] = useState(true)
  const breadcrumbs = [
    { label: t('order'), link: '/order' },
  ];

  const archieve=async(e)=>{
    e.preventDefault(); 
    try {
      let url =show_archive?'/order/archived':'/order/active'
      const data = await get(url);
      setRecords(data); 
      setshowArchived(!show_archive);
    } catch (error) {
      console.error(error);
    }
  }
  const fetchData = async () => {
    try {
      const data = await get(`/order/active`);
      setRecords(data.reverse());
      setLoading(false); 
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
const hideColumn={mfg_no:false,drawing_no:false,cutter_no:false}

  const fetchClientId = () =>{
    const profile_data = JSON.parse(UserManagement.getItem("profile_data") || '{}');
    const visible = profile_data?.client === 1;    
   setVisible(visible)
  }

  const editInfo=(row)=>{
    router.push(`/order/addorder/edit/${row.order}`);
    
  }
  useEffect(() => {
    fetchData();
    fetchClientId();
  }, [page]);
 const columns=[
  {header: t('content.orderno'), accessorKey: "order_no", size:100, },
  {header: t('content.cutter'),  accessorKey: 'cutter_no', size:100 },
  {header: t('content.MFG'), accessorKey: 'mfg_no', size:100 },
  {header: t('content.drawing'),  accessorKey: 'drawing_no', size:100 },
  {header: t('content.date'),
  accessorFn: (row) => {
    //convert to Date for sorting and filtering
    const sDay = new Date(row.order_date);

    sDay.setHours(0, 0, 0, 0); // remove time from date (useful if filter by equals exact date)

    return sDay;

  },  
  filterVariant: 'date',
   Cell: ({ renderedCellValue }) => formatdate(renderedCellValue), 
   size:100 
},
  {header: t('content.Product'), accessorKey: 'product', size:100 },
  {header: t('content.remark'),  accessorKey: 'remarks', size:100 },]
  return (
    <Layout breadcrumbs={breadcrumbs}>
    <Box>
      <Flex justify='space-between' mb='sm'>
        <Title order={3}>{t('content.orderList')} </Title>
        <Flex>
          <Box mr='md' mt='sm'>
            <UnstyledButton onClick={(e) => archieve(e)}>
            <Anchor  mt="sm" href="">{show_archive&& <IconArchiveFilled size={11} color="blue" />}{show_archive?t("Archived"):t("Back")}</Anchor></UnstyledButton>
          </Box>
          {visible == 1 ?
            <Link href='order/addorder/new'><Button>{t('Add New')}</Button></Link>
            :null}
        </Flex>
      </Flex>
  <MantineReactTables column={columns} data={records}  editInfo={editInfo} page={"order"}  columnVisibility={hideColumn} visible={visible} loading={loading}/>
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

export default ProtectedRoute(OrderListing);