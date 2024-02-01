import { Box, Card, Title, createStyles, Flex} from '@mantine/core'
import { StatusGroup } from './StatusGroup'
import Link from 'next/link';
import { useTranslation } from "next-i18next";
import { WelcomeCard } from './WelcomeCard';
import { MonthPickerInput } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import MantineReactTables from '../MantineReactTable';
import { get } from '@/pages/api/apiUtils';
import formatdate from '@/utils/formatdate';

const useStyle = createStyles(theme => ({
	section: {
		padding: theme.spacing.lg,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
    link: {
		padding: theme.spacing.lg,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
        fontFamily:'-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
        color:'#228be6',
        textDecoration:'none',
        transition: 'text-decoration 0.2s ease',
        '&:hover': {
            textDecoration: 'underline',
        },
	},
}));
export default function ClientDashboard({records,tools,username,orderRecord}) {
	const { classes } = useStyle();
    const { t } = useTranslation("common");
    const [workdate,setWorkDate] = useState( new Date());
    const [orderdate,setOrderDate] = useState( new Date());
    const [mfgRecords, setMfgRecords] = useState([]);
    const [workrecords,setWorkRecords] = useState([]);
    const [orderecords,setOrderRecords]=useState([]);
    useEffect(() => {
      mfgTableData();
      dateWiseWorkorder(workdate);
      dateWiseOrder(orderdate);
    }, [])

    const dateWiseWorkorder=(e)=>{
     let date = format(e,'yyyy-MM-dd')
      try {
        const data = get(`/workorder/all/${date}`);
        data.then((data)=>  setWorkRecords(data));;
      } catch (error) {
      }
    }
    const dateWiseOrder=(e)=>{
        let date = format(e,'yyyy-MM-dd')
         try {
           const data = get(`/workorder/all/${date}`);
           data.then((data)=>  setOrderRecords(data));;
         } catch (error) {
         }
       }

    const mfgTableData = async() =>{
      try {
        const data = await get('/mfg/');
        setMfgRecords(data);
      } catch (error) {
        console.error(error);
      }
    }
 const  columns=[
    { header: t('workOrder.workOrderNo'), accessorKey: "work_order_no", size:100 },
    { header: t('workOrder.cutterno'), accessorKey: "cutter_no", size:100 },
    { header: t('workOrder.mfgno'), accessorKey: "mfg_no", size:100 },
    { header: t('workOrder.orderno'), accessorKey: "order_no", size:100 },
    { header: t('workOrder.orderdate'), accessorKey: "workorder_date", size:100 },
    { header: t('Estimated Finish'), accessorKey: "delivery_date", size:100 },
    { header: t('status'), accessorKey: "workorder_status", size:100 },
    ]
const  orderColumns=[
    {header: t('content.orderno'), accessorKey: "order_no", size:100, },
    {header: t('content.cutter'),  accessorKey: 'cutter_no', size:100 },
    {header: t('content.MFG'), accessorKey: 'mfg_no', size:100 },
    {header: t('content.drawing'),  accessorKey: 'drawing_no', size:100 },
    {header: t('content.Product'), accessorKey: 'product', size:100 },
    {header: t('content.remark'),  accessorKey: 'remarks', size:100 },
    ]
    const  mfgColumns=[
      { header: t('MFG.MFG No'),accessorKey:"mfg_no", size:100 },
      { header: t('MFG.Cutter No'), accessorKey:"cutter_no", size:100 },
      { header: t('MFG.Processing Type'), accessorKey:"process_type", size:100 },
      { header: t('MFG.Registration Date'),
      accessorFn: (row) => {
        //convert to Date for sorting and filtering
        const sDay = new Date(row.register_date);
        sDay.setHours(0, 0, 0, 0); // remove time from date (useful if filter by equals exact date)
        return sDay;
      },  
      filterVariant: 'date',
      Cell: ({ renderedCellValue }) => formatdate(renderedCellValue), size:100 },  
      { header: t('MFG.Registered By'), accessorKey:"register_by", size:100},
      { header: t('MFG.Status'), accessorKey:"status", size:100 },
      { header: t('MFG.Client'),accessorKey:"client_name", size:100 },]
  return (
    <Box>
        <WelcomeCard username={username}/>
        <StatusGroup data={tools}/>
		<Card radius="md" shadow='xl' mt='lg'>
			<Card.Section>
                <Flex justify='space-between'>
                    <Flex>
				        <Title className={classes.section} order={5}>{t('Workorder')}</Title>
                        <MonthPickerInput
                            size='xs' 
                            mt="md"
                            mr='md'  
                            placeholder="Pick date"
                            value={workdate}
                            maxDate={new Date}
                            onChange={(e)=>
                                {
                                setWorkDate(e);
                                dateWiseWorkorder(e)
                        }
                        }
                    />
                    </Flex>
                  <Flex>
                    <Box>  
                      <Link href='/work_order'className={classes.link}> {t('view All')}</Link>
                    </Box>
                  </Flex>
                </Flex>
            </Card.Section>
            <MantineReactTables column={columns} data={workrecords} search={false} pagination={false} noaction={true}/>
		</Card>
		<Card radius="md" shadow='xl' mt='lg'>
			<Card.Section>
            <Flex justify='space-between'>
                <Flex>
                    <Title className={classes.section} order={5}>{t('order')}</Title>
                    <MonthPickerInput
                        size='xs'
                        mt="md"
                        mr='md'    
                        placeholder="Pick date"
                        value={orderdate}
                        maxDate={new Date}
                        onChange={(e)=>
                        {
                            setOrderDate(e);
                            dateWiseOrder(e)
                    }
                    }
                />
                </Flex>
              <Flex>
                <Box>  
                  <Link href='/order'className={classes.link}> {t('view All')}</Link>
                </Box>  
              </Flex>
            </Flex>
			</Card.Section>
            <MantineReactTables column={orderColumns} data={orderecords} search={false} pagination={false} noaction={true}/>
		</Card>
    <Card radius="md" shadow='xl' mt='lg'>
			<Card.Section>
            <Flex justify='space-between'>
              <Title className={classes.section} order={5}>{t('mfg')}</Title>       
            </Flex>
			</Card.Section>
            <MantineReactTables column={mfgColumns} data={mfgRecords} search={false} pagination={false} noaction={true}/>
		</Card>
    </Box>
  )
}
