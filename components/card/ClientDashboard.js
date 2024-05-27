import { Box, Card, Title, createStyles, Flex} from '@mantine/core'
import { StatusGroup } from './StatusGroup'
import Link from 'next/link';
import { useTranslation } from "next-i18next";
import { WelcomeCard } from './WelcomeCard';
import { DatesProvider, MonthPickerInput } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import MantineReactTables from '../MantineReactTable';
import { get, put } from '@/pages/api/apiUtils';
import formatdate from '@/utils/formatdate';
import { notifications } from '@mantine/notifications';

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
export default function ClientDashboard({records,username,orderRecord, locale}) {
	const { classes } = useStyle();
    const { t } = useTranslation("common");
    const [workdate,setWorkDate] = useState( new Date());
    const [orderdate,setOrderDate] = useState( new Date());
    const [mfgRecords, setMfgRecords] = useState([]);
    const [workrecords,setWorkRecords] = useState([]);
    const [orderecords,setOrderRecords]=useState([]);
    const [toolsCount, setToolsCount] = useState([])
    const [date, setDate] = useState(new Date());
    const [clearMonth, setClearMonth] = useState(true);
    const [dateRange,setDateRange] = useState([]);
    const [clearMonthRange,setClearMonthRange] = useState(true);

    useEffect(() => {
      mfgTableData();
      dateWiseWorkorder(date,date);
      dateWiseOrder(orderdate);
    }, [])
    function isValidDateFormat(dateString) {
      const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
      return dateFormatRegex.test(dateString);
    }

    const dateWiseWorkorder = (fromDate, toDate) => {
      try {
        if (!isValidDateFormat(fromDate) || !isValidDateFormat(toDate)) {
          fromDate = format(fromDate, "yyyy-MM-dd");
          toDate = format(toDate, "yyyy-MM-dd");
        }
        console.log("from and to ",fromDate,toDate);
  
        const data = get(`/workorder/all/${fromDate}/${toDate}`);
        data.then((data) => setWorkRecords(data));
  
        const toolsData = get(`/workorder/tools/${fromDate}/${toDate}`);
        toolsData.then((data) => setToolsCount(data));
      } catch (error) {
        // console.error("Error:", error);
      }
    };
    const dateWiseOrder=(e)=>{
        let date = format(e,'yyyy-MM-dd')
         try {
           const data = get(`/workorder/all/${date}/${date}`);
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
    const updateUrgency = async (id, urgency) => {      
      try{
        const response = await put(`/workorder/urgency/${id}/${urgency}`)
        notifications.show({
          title: t('Success'),
          message: t(response),
          color: "green",
        });
      }
      catch(error){
        console.log(error);
      }
    
    }

 const dropdata = ['LIMITEDEXPRESS','USUALLY']
 const hideColumn = {delivery_date:false}
 const  columns=[
    { header: t('workOrder.workOrderNo'), accessorKey: "work_order_no", size:100 },
    { header: t('workOrder.cutterno'), accessorKey: "cutter_no", size:100 },
    { header: t('workOrder.mfgno'), accessorKey: "mfg_no", size:100 },
    { header: t('workOrder.orderno'), accessorKey: "order_no", size:100 },
    { header: t('workOrder.urgency'),accessorKey:"urgency", size:100,editVariant: 'select',
    mantineEditSelectProps:({row})=>({
      data: dropdata,
      onChange: (value) => {
        const { id } = row.original;
        updateUrgency(id, value);
      }
      })  },
    { header: t('workOrder.orderdate'), accessorKey: "workorder_date", size:100 },
    { header: t('Estimated Finish'), accessorKey: "delivery_date", size:100 },
    { header: t('status'), accessorKey: "workorder_status", size:100, Cell:({cell}) => t(cell.row.original.workorder_status) },
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
        <StatusGroup data={toolsCount}/>
		<Card radius="md" shadow='xl' mt='lg'>
			<Card.Section>
                <Flex justify='space-between'>
                    <Flex>
				        <Title className={classes.section} order={5}>{t('Workorder')}</Title>
                <DatesProvider settings={{locale:locale}}>
                <MonthPickerInput
                size="xs"
                mt="md"
                mr="md"
                placeholder="Pick a month"
                clearable
                maxDate={new Date()}
                value={clearMonth ? date : null}
                onChange={(e) => {
                  setClearMonth(true);
                  let date = e !== null && format(e, "yyyy-MM-dd");
                  setDate(e);
                  dateWiseWorkorder(date, date);
                  if (e == null) {
                    setWorkRecords([]);
                    setClearMonthRange(false)
                  }
                }}
              />
              <Title size=".80rem" mt="xl" mr="sm" c>
                OR
              </Title>
              <MonthPickerInput
                size="xs"
                mt="md"
                mr="md"
                type="range"
                clearable
                placeholder="Pick month range"
                value={clearMonthRange ? dateRange : []}
                maxDate={new Date()}
                onChange={(e) => {
                  setDateRange(e)
                  setClearMonthRange(true)
                  let firstDate = e[0] !== null && format(e[0], "yyyy-MM-dd");
                  let secondDate = e[1] !== null && format(e[1], "yyyy-MM-dd");
                  dateWiseWorkorder(firstDate, secondDate);
                  if (e[0] == null && e[1] == null) {
                    setWorkRecords([]);
                    setClearMonth(false);
                    // setToolsCount([])
                  }
                }}
              />
              </DatesProvider>
                    </Flex>
                  <Flex>
                    <Box>  
                      {/* <Link href='/work_order'className={classes.link}> {t('view All')}</Link> */}
                    </Box>
                  </Flex>
                </Flex>
            </Card.Section>
            <MantineReactTables column={columns} page={"dash-wo"} data={workrecords} columnVisibility={hideColumn} search={false} pagination={false} />
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
                  {/* <Link href='/order'className={classes.link}> {t('view All')}</Link> */}
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
