import { Box, Card, Title, createStyles, rem, Anchor, Flex } from "@mantine/core";
import Link from "next/link";
import { StatusGroup } from "./StatusGroup";
import { WelcomeCard } from "./WelcomeCard";
import { useTranslation } from "next-i18next";
import formatdate from "@/utils/formatdate";
import {  MonthPickerInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { parseISO } from "date-fns";
import { format } from "date-fns";
import { get } from "@/pages/api/apiUtils";
import MantineReactTables from "../MantineReactTable";


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

export default function AdminDashboard({records,username}) {
    const { classes } = useStyle();
    const { t } = useTranslation("common");
    const [date,setDate] = useState( new Date());
    const [toolsCount, setToolsCount] = useState([])
    const tableData = records.slice(0,6);
    const [workrecords,setWorkRecords] = useState([]);
    useEffect(() => {
      dateWiseWorkorder(date);
    }, [])

    const dateWiseWorkorder=(e)=>{
     let date = format(e,'yyyy-MM-dd')
      try {
        const data = get(`/workorder/all/${date}`);
        data.then((data)=>  setWorkRecords(data));
        const toolsData = get(`/workorder/tools/${date}`);
        toolsData.then((data)=> setToolsCount(data))
      } catch (error) {
      }
    }
 const columns=[
      { header: t('workOrder.workOrderNo'), accessorKey: "work_order_no", size:100  },
      { header: t('Client Name'), accessorKey: "client_name", size:80 },
      { header: t('workOrder.cutterno'), accessorKey: "cutter_no", size:80 },
      { header: t('workOrder.mfgno'), accessorKey: "mfg_no", size:80 },
      // { header: t('workOrder.geardrwno'), accessorKey: "geardrawing_no", size:100 },
      { header: t('workOrder.orderno'), accessorKey: "order_no", size:100 },
      { header: t('workOrder.orderdate'), accessorKey: "workorder_date",  Cell: ({ renderedCellValue }) => formatdate(renderedCellValue), size:100 },
      { header: t('Estimated Finish'), accessorKey: "delivery_date", Cell: ({ renderedCellValue }) => formatdate(renderedCellValue),  size:100 },
      { header: t('status'), accessorKey: "workorder_status", size:100 },
      ]
  return (
    <Box>
        <WelcomeCard username={username}/>
        <StatusGroup data={toolsCount}/>
        <Card radius="md" shadow='xl' mt='lg'>
			<Card.Section >
                <Flex justify='space-between'>
                  <Flex>
                    <Title className={classes.section} order={5}>{t('Workorder')}</Title>
                    <MonthPickerInput
                        size="xs"  
                        mt="md"
                        mr='md' 
                        placeholder="Pick date"
                        maxDate={new Date}
                        value={date}
                        onChange={(e)=>
                          {
                            setDate(e);
                            dateWiseWorkorder(e)
                      }
                      }
                     />
                    </Flex>
                  <Flex>
                    <Box> 
                      <Link  href='/work_order'className={classes.link}> {t('view All')}</Link>
                    </Box>
                     </Flex>
                </Flex>
			</Card.Section>
      <MantineReactTables column={columns} data={workrecords} search={false} pagination={false} noaction={true}/>
		</Card>
    </Box>
  )
}
