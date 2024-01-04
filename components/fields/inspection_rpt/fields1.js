import { fetchAndTransformClientData, fetchAndTransformMFGData, fetchAndTransformOrderData, fetchAndTransformWorkOrderData ,fetchAndTransformCutterData} from "@/pages/api/Select";
import  { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";

export const FieldsArray = () => {
  const [workOrder,setWorkOrder]=useState([]);
  const [clients, setClient] = useState([]);
  const [cutters, setCutter] = useState([]);
  const [order,setOrder] =useState([]);
  const [mfgData,setMFGData]=useState([]);
  const { t } = useTranslation("common");

  const fetchAllData = async () => {
    try {
      const [
        orderData,
        clientData,
         cutterData, 
        workOrderData,
      mfgData] = await Promise.all([
        fetchAndTransformOrderData(),
        fetchAndTransformClientData(),
        fetchAndTransformCutterData(),
        fetchAndTransformWorkOrderData(),
        fetchAndTransformMFGData(),
      ]);
      setOrder(orderData);
      setClient(clientData);
      setCutter(cutterData);
      setWorkOrder(workOrderData);
      setMFGData(mfgData)
    } catch (error) {
    }
  };

useEffect(() => {
  fetchAllData()
}, [])

  const fields = [
    {
      name: "work_order",
      label: t('inspection.Work Order'),
      withAsterisk: true,
      readOnly: true,
      type:"select",
      data:workOrder
    },
    {
      name: "cutter_no",
      label: t('inspection.Tool No'),
      type: "text",
      withAsterisk: true,
      type:"select",
      data:cutters
    },
    { name: "order_no", label: t('inspection.Order No'), withAsterisk: true ,type:"select",data:order,readOnly:true},
    { name: "serial_no", label: t('inspection.Serial No'),data:mfgData,type:"select" },
    { name: "order_date", label: t('inspection.Order Date'), type: "date" },
    { name: "gear_dwg_no", label: t('inspection.Gear Dwg No') },
    { name: "client", label: t('inspection.Customer'),type:"select",data:clients },
  ];

  return fields;
};