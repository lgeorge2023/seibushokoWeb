import React, { useEffect, useState } from "react";
import { get } from "@/pages/api/apiUtils";
import { Modal } from "@mantine/core";
import BasicTable from "./BasicTable";
import { removeNulls } from "@/utils/removeNulls";
import {useTranslation} from 'next-i18next'

function OrderDataTable({ form, setOrderShowModal, showOrderModal,handleRequester }) {
  const [records, setRecords] = useState([]);
  const { t } = useTranslation("common");

  useEffect(() => { 
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const data = await get("/order/new");
      setRecords(data);
    } catch (error) {
    }
  };   
  const autofilWorkOrder=(id)=>{
    let Orderdata =get(`/order/${id}/workorder`);
    let data= Orderdata.then(
     (data) => { 
      removeNulls(data);
        form.setValues({"order_no":id,"client_id":data.client_id,"cutter_no":data.cutter_no ,"geardrawing_no":data.drawing_no,
        "mfg_no":data.mfg_no,"module":data.module,"product_no":data.product,"regrind_count":data.regrind_count,
        "regrind_type":data.regrind_type})
        handleRequester(data.client_id,"orderchange")
     },
     (error) => { 
     })
    form.setValues({})
   
   } 
  const handleRowClick = (row) => {
    setOrderShowModal(false);
    autofilWorkOrder(row);
  };

const columns=[
  {header:t('content.orderno'), accessorKey: "order_no",    mantineTableBodyCellProps: ({ cell }) => ({
    onClick: () => {
      let id =cell.row.original.id;
      handleRowClick(id);
    },
  }),
  Cell: ({
    cell
  }) => <b style={{
    color: '#518FE2'
  }}>{cell.getValue()}</b>},
  {header:t('cutter.Cutter No'),  accessorKey: 'cutter_no', },
  { header:t('content.MFG'), accessorKey: 'mfg_no', },
  {header:t('MFG.Drawing No'),  accessorKey: 'drawing_no', },
  { header:t('content.date'), accessorKey: 'order_date', },
  { header:t('content.Product'), accessorKey: 'product', },
  {header:t('content.remark'),  accessorKey: 'remarks', },

]
  return (
    <Modal
      opened={showOrderModal}
      onClose={() => setOrderShowModal(false)}
      size="xl"
      title={t('content.orderno')}
      closeOnClickOutside={false}
    >
      <BasicTable columns={columns} data={records}/>
    </Modal>
  );
}

export default OrderDataTable;