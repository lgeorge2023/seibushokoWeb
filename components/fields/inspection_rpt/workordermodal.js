import React, { useEffect, useState } from "react";
import { get } from "@/pages/api/apiUtils";
import {  Modal } from "@mantine/core";
import BasicTable from "@/components/BasicTable";
import { removeNulls } from "@/utils/removeNulls";
import {useTranslation} from 'next-i18next'


function WorkOrderModal({ form, setShowModal, showModal }) {
  const [records, setRecords] = useState([]);
  const { t } = useTranslation("common");

  useEffect(() => { 
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const data = await get("/workorder/finished");
      setRecords(data);
    } catch (error) {
    }
  };    
  const autofilInspectionReport=(id)=>{
    let trialConditionData = get(`workorder/report/${id}`);
      trialConditionData.then((data)=>{
        removeNulls(data);
        if(data.regrind_type == "Conventional"){
          form.setFieldValue('report_trial',{
            ...form.values.report_trial,
            cc_angle_axial_cross: data.angle_axial_cross,
            cc_diagonal_angle:data.diagonal_angle,
            cc_cutter_speed: data.cutter_speed,
            cc_tranverse_feed1: data.tranverse_feed1,
            cc_tranverse_feed2: data.tranverse_feed2,
            cc_amount_cut: data.amount_cut,
            cc_stroke: data.stroke,
            cc_no_teeth: data.no_teeth,
            cc_obd: data.obd,
            cc_obd_dia: data.obd_dia,
            //more feilds will be added, once api has it. 
          })
        }
        if(data.regrind_type == "Plunge"){
          form.setFieldValue('report_trial',{
            ...form.values.report_trial,
            pc_angle_axial_cross: data.angle_axial_cross,
            pc_cutter_speed: data.cutter_speed,
            pc_amount_cut:data.amount_cut,
            pc_t1: data.t1,
            pc_t2: data.t2,
            pc_t3: data.t3,
            pc_bm_amount: data.bm_amount,
            pc_no_teeth: data.no_teeth,
            pc_obd: data.obd,
            pc_obd_dia: data.obd_dia,
          })
        }
      },(error)=>{
      })
    let WorkOrderdata =get(`/workorder/${id}`);
      WorkOrderdata.then(
     (data) => { 
      removeNulls(data);
        form.setValues({"work_order":id,"client":data.client_id,"cutter_no":data.cutter_no ,
        "order_no":data.order_no,"serial_no":data.mfg_no, "gear_dwg_no":data.geardrawing_no,
        "ts_module":data.module, 
        "ts_shaving_method":data.regrind_type,
        "trial":data.test,"no_polishing_times":data.regrind_count,
       "product_no":data.product,"regrind_count":data.regrind_count,
        "regrind_type":data.regrind_type})
     },
     (error) => { 
     })
   
   }
const  columns=[{header: t('workOrder.workOrderNo'), accessorKey:"work_order_no" ,    mantineTableBodyCellProps: ({ cell }) => ({
  onClick: () => {
    let id =cell.row.original.id;
    handleRowClick(id)
  },
}),
Cell: ({
  cell
}) => <span style={{
  color: '#518FE2'
}}>{cell.getValue()}</span>
},
{ header: t('content.cutter'),accessorKey:"cutter_no" },
{ header: t('content.MFG'), accessorKey:"mfg_no" },
{ header: t('Gear Dwg No'),accessorKey:"geardrawing_no", },
{ header: t('workOrder.productNo'),accessorKey:"product_no",},
{ header: t('content.orderno'), accessorKey:"order_no"},
{ header: t('regrindType'),accessorKey:"regrind_type", },
{ header: t('workOrder.regirndform'), accessorKey:"regrind_from" },
{ header: t('workOrder.orderdate'),accessorKey:"workorder_date",},
{ header: t('workOrder.location'),accessorKey:"location", },
{ header: t('status'), accessorKey:'workorder_status' },
{ header: t('Client'), accessorKey:"client_name"},
{ header: t('workOrder.urgency'),accessorKey:"urgency",},]
const handleRowClick = (row) => {
  setShowModal(false);
  autofilInspectionReport(row);
};

  return (
    <Modal
      opened={showModal}
      onClose={() => setShowModal(false)}
      size="55%"
      title={t('workOrder.workOrderNo')}
      closeOnClickOutside={false}
    >
     <BasicTable columns={columns} data={records}/>
    </Modal>
  );
}

export default WorkOrderModal;