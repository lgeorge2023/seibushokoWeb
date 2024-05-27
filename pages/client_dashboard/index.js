import Layout from "@/components/layout/Layout";
import { Box, Flex, Grid, Loader } from "@mantine/core";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from "react";
import AdminDashboard from "@/components/card/AdminDashboard";
import ClientDash from "@/components/card/ClientDashboard";
import { get } from "../api/apiUtils";
import { UserManagement } from "@/utils/UserManagement";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { useRouter } from "next/router";

const breadcrumbs = [
    { label: 'Dashboard', link: '/client_dashboard' },
  ];
const Dashboard =()=>{
  const router = useRouter();
  const profile_data = JSON.parse(UserManagement.getItem("profile_data") || '{}');
  const visible = profile_data?.client === 1;
  const username = profile_data?.first_name + ' ' +profile_data.last_name;
  const [records,setRecords] = useState([]);
  const [orderRecord, setOrderRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  const workOrderData = async()=>{
    try{
      const data = await get('/workorder/all');
      setRecords(data.reverse());
      if(!visible){
        const orderData = await get(`/order/active`);
        orderData?.reverse()
        setOrderRecord(orderData)
        setLoading(false);
      }
      setLoading(false);

    }catch(error){
      setLoading(false)
    }
  }

  useEffect(()=>{
    workOrderData();
  },[])

    return(
        <Layout breadcrumbs={breadcrumbs}>
          {loading? <Box style={{display:'grid', placeItems:'center'}}><Loader/></Box>
            :<Grid>
                <Grid.Col span={12}>
                    <Flex direction="column" h="103%" justify="space-between">
                       {visible?<AdminDashboard username={username} records={records} locale={router.locale}/>:<ClientDash records={records} orderRecord={orderRecord} username={username}locale={router.locale}/>}    
                    </Flex>

                </Grid.Col>
            </Grid>}
        
        </Layout>
    )
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
  
export default ProtectedRoute(Dashboard);