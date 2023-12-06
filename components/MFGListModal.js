import { useEffect, useState } from "react"
import { get } from "@/pages/api/apiUtils"
import { Modal } from "@mantine/core"
import BasicTable from "./BasicTable"
import {useTranslation} from 'next-i18next'

export default function MFGListModal({setMfgModal, mfgModal,cutterId }) {
    const [records, setRecords] = useState([]);
    const { t } = useTranslation("common");

    const columns = [
        {header:t('content.MFG'), accessorKey:"mfg_no", size:100, Cell: ({ renderedCellValue }) => <b style={{color:'#518FE2'}}>{renderedCellValue}</b>},
        {header:t('content.cutter'), accessorKey:"cutter_no", size:100},
        {header:t('status'), accessorKey:"status", size:100},
        {header:t('MFG.Drawing No'), accessorKey:"drawing_no", size:100},
        {header:t('Client.Client'), accessorKey:"client_name", size:100},
        {header:t('content.registedBy'), accessorKey:"regrregister_by", size:100},
        {header:t('MFG.Supplier'), accessorKey:"supplier", size:100},

    ]
    useEffect(()=>{
        cutterId !== 0?
        fetchData():null
    },[cutterId])
    
    const fetchData = async ()=>{
        try{
            const data = await get(`/mfg/cutter/${cutterId}/`);
            setRecords(data);
        }catch(error){
        }
    }

  return (
    <Modal
    opened={mfgModal}
    onClose={() => setMfgModal(false)}
    size="xl"
    title={t('content.MFG')}
    closeOnClickOutside={false}
    >
        <BasicTable columns={columns} data={records} mfg={true}/>
    </Modal>
  )
}
