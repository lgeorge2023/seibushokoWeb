import React, { useState, useEffect } from 'react';
import { fetchAndTransformClientData, fetchAndTransformMFGData, fetchAndTransformOrderData, fetchAndTransformRegrindData, fetchAndTransformStaffData ,fetchAndTransformCutterData} from '@/pages/api/Select';
import { useTranslation } from "next-i18next";

export const FieldsArray = () => {
  const { t } = useTranslation("common");
  const [clients, setClient] = useState([]);
  const [cutters,setCutter] = useState([]);
  const [mfgData,setMFGData] =useState([]);
  const [orders,setOrderData] =useState([]);
  const [regrind,setregrindData] =useState([]);
  const [userData,setUserdata] =useState([])
  const fetchAllData = async () => {
    try {
      const [clientData, cutterData, mfgData,orderData,regrindData,userData] = await Promise.all([
        fetchAndTransformClientData(),
        fetchAndTransformCutterData(),
        fetchAndTransformMFGData(),
        fetchAndTransformOrderData(),
        fetchAndTransformRegrindData(),
        fetchAndTransformStaffData()
      ]);

      setClient(clientData);
      setCutter(cutterData);
      setMFGData(mfgData);
      setOrderData(orderData);
      setregrindData(regrindData);
      setUserdata(userData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);
  const statuslist = [
    { value: "PENDING", label: t("workOrder.Pending") },
    { value: "REGRIND", label: t("workOrder.Regrind") },
    { value: "REQUIREFIX", label: t("workOrder.Require Fix") },
    { value: "FINISHED", label: t("workOrder.Finished") },
    { value: "DELIVERED", label: t("workOrder.Delivered") },
    {value:"INSPECTIONRPT", label:t("workOrder.Inspection Report")},
    { value: "RETURNED", label: t("workOrder.Returned") }
  ];
  const Locations=[
     { value: "SEIBUSHOKO", label: t('location.Seibushoko') },
     { value: "CUSTOMER", label: t('location.Customer') },
    ]
  const Arbors = [
    { value: "KEEP", label: t('arbor.Keep') },
    { value: "RETURN", label: t('arbor.Return') },
    { value: "NONE", label: t('arbor.None') },
  ]

 const regrindform=[
  { value: "CUSTOMERRETURN", label: t("workOrder.cutomerReturn") },
  { value: "WORKORDER", label: t("Workorder") },
  ]
  const sooneql=  [{ value: "TRUE", label: "True" },{value: "FALSE", label: "False"}] ;
  const urgency=[{ value: "USUALLY", label: "Usually" },{value:"LIMITEDEXPRESS", label: "Limited Express"}] ;
  const Test=[{ value: "TRIAL", label: t('inspection.Trial') },{value: "NONTRIAL", label: t('inspection.Non Trial')}]
  const fields = [
    { label: t('workOrder.orderno'), name: 'order_no', disabled: true,data:orders ,withAsterisk:true},
    { label: t('workOrder.cutterno'), name: 'cutter_no',data:cutters,withAsterisk:true,type:"select" },
    { label: t('workOrder.regirndform'), name:   'regrind_from' ,data:regrindform,type:"select"},
    { label: t('workOrder.orderdate'), name: 'workorder_date', type: 'text',withAsterisk:true ,type:"date"},
    { label: t('workOrder.mfgno'), name: 'mfg_no', type: 'select',data:mfgData ,withAsterisk:true},
    { label: t('workOrder.test'), name: 'test',type:"select",data:Test },
    { label: t('workOrder.client'), name: 'client_id', type: 'select', data: clients ,withAsterisk:true},
    { label: t('workOrder.geardrwno'), name: 'geardrawing_no', type: 'text' },
    { label: t('workOrder.arbor'), name: 'arbor', type: 'select', data:Arbors},
    { label: t('workOrder.deliverydate'), name: 'delivery_date', type: 'date' },
    { label: t('workOrder.regrindtype'), name: 'regrind_type', type: 'select' ,data:regrind},
    { label: t('workOrder.noOfWorkpiece'), name: 'noofworkpiece', type: 'number' },
    { label: t('workOrder.workOrderNo'), name: 'work_order_no', type: 'text' },
    { label: t('workOrder.module'), name: 'module', type: 'number' , precision:6},
    { label: t('workOrder.status'), name: 'workorder_status', type: 'select',data:statuslist },
    { label: t('workOrder.regrindCount'), name: 'regrind_count', type: 'number' },
    { label: t('workOrder.productNo'), name: 'product_no', type: 'text'},
    { label: t('workOrder.location'), name: 'location',  type: "select",data:Locations,},
    {name:"created_by", label: t('workOrder.createdBy'), type: "select", data:userData,disabled:true},
    { label: t('workOrder.noOfProcess'), name: 'numberof_processes', type: 'number' },
    { label: t('workOrder.urgency'), name: 'urgency', type: 'select',withAsterisk:true,data:urgency },
    { label: t('workOrder.soonEOL'), name: 'soonEOL', type: 'select',data:sooneql },
    { label: t('workOrder.requestor'), name: 'requester', type: 'text', }
  ];

  return fields;
};

