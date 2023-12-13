import { useEffect, useState } from 'react';
import {  Box, Button,  Flex, Title, Loader } from '@mantine/core';
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
  const breadcrumbs = [{label:t("Work_Order_Regrind"),link:'./work_order'}]


  const router = useRouter();
  const fetchData = async () =>{
    try{
      const data = await get('/workorder/all');
      setRecords(data.reverse());
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


  const editInfo=(row)=>{
    router.push(`work_order/add_workorder/edit/${row.id}`);
    
  }
  const hideColumn={geardrawing_no:false,product_no:false,workorder_date:false,order_no:false,location:false,regrind_type:false,mfg_no:false}
  const columns= [
      { header: t('workOrder.workOrderNo'), accessorKey:"work_order_no", size:100 },
      { header: t('workOrder.cutterno'),accessorKey:"cutter_no",size:100  },
      { header: t('workOrder.mfgno'), accessorKey:"mfg_no", size:100  },
      { header: t('workOrder.geardrwno'),accessorKey:"geardrawing_no", sortable: true, size:100  },
      { header: t('workOrder.productNo'),accessorKey:"product_no", sortable: true, size:100  },
      { header: t('workOrder.orderno'), accessorKey:"order_no", size:100 },
      { header: t('regrindType'),accessorKey:"regrind_type", sortable: true, size:100  },
      { header: t('workOrder.regirndform'), accessorKey:"regrind_from", size:100  },
      { header: t('workOrder.urgency'),accessorKey:"urgency", sortable: true, size:100  },
      { header: t('workOrder.status'), accessorKey:'workorder_status', size:100  },
      { header: t('workOrder.orderdate'),
      accessorFn: (row) => {
        //convert to Date for sorting and filtering
        const sDay = new Date(row.workorder_date);
    
        sDay.setHours(0, 0, 0, 0); // remove time from date (useful if filter by equals exact date)
    
        return sDay;
    
      },  
      filterVariant: 'date',
     Cell: ({ renderedCellValue }) => formatdate(renderedCellValue), size:100 },
      { header: t('workOrder.location'),accessorKey:"location", sortable: true, size:100  },
      { header: t('client'), accessorKey:"client_name", size:100 },
 
  ]
  return (
    <Layout  breadcrumbs={breadcrumbs}>
    <Box>
      <Flex justify='space-between'mb='sm'>
      <Title order={3}>{t('content.workOrderList')}</Title>
  {visible == 1 &&
  <Button component={Link} href='/work_order/add_workorder/new'>{t('Add New')}</Button>
  }
  </Flex>
  <MantineReactTables column={columns} data={records}  editInfo={editInfo} columnVisibility={hideColumn} page={"workorder"} visible={visible} loading={loading}/>
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