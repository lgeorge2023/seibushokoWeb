import  { useState, useEffect } from "react";
import {
  fetchAndTransformClientData,
  fetchAndTransformStaffData,
  fetchAndTransformCutterData
} from "@/pages/api/Select";
import { useTranslation } from "next-i18next";
export const FieldsArray = () => {
  const [clients, setClient] = useState([]);
  const [cutters, setCutter] = useState([]);
  const [userData,setUserdata] =useState([])
  const { t } = useTranslation("common");

  const fetchAllData = async () => {
    try {
      const [clientData, cutterData,userData] = await Promise.all([
        fetchAndTransformClientData(),
        fetchAndTransformCutterData(),
        fetchAndTransformStaffData()
      ]);

      setClient(clientData);
      setCutter(cutterData);
      setUserdata(userData);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);
  const status = [
    { value: "AVAILABLE", label: t('MFG.Available') },
    { value: "PENDING", label: t('MFG.Pending') },
    { value: "REGRIND", label: t('MFG.Regrind') },
    { value: "REQUIREFIX", label: t('MFG.Require Fix') },
    { value: "FINISHED", label: t('MFG.Finished') },
  ];
  const eol = [
    {value:"TRUE", label:t('True')},
    {value:"FALSE", label:t('False')}
  ]
  const fields = [
    {
      name: "cutter_no",
      label: t('MFG.Cutter No'),
      withAsterisk: true,
      data: cutters,
      readOnly: true,
    },
    { name: "register_date", label:t('MFG.Registration Date'), type: "date" },
    {
      name: "manager",
      label:t('MFG.Manager'),
      type: "select",
      data: userData,
      withAsterisk: true,
    },
    { name: "mfg_no", label: t('MFG.MFG No'), withAsterisk: true },
    { name: "process_no", label: t('MFG.Processing No') },
    { name: "supplier", label: t('MFG.Supplier') },
    { name: "module", label: t('MFG.Module'), type: "number", withAsterisk: true,precision:6 },
    { name:"register_by",label: t('MFG.Registered By'), type: "select", data:userData,readOnly:true,},
    { name: "drawing_no", label: t('MFG.Drawing No') },
    { name: "location", label: t('MFG.Location') },
    { name: "status", label: t('MFG.Status'), type: "select", data: status },
    { name: "process_type", label: t('MFG.Processing Type') },
    { name: "client", label: t('MFG.Client'), type: "select", data: clients, withAsterisk: true,readOnly:true },
    { name: "remarks", label: t('MFG.Remarks'), type: "text" },
    { name: "regrind_count", label: t('MFG.Regrind Count'), type: "number" },
    { name: "EOL", label: t('MFG.EOL'), type: "select", data: eol },
  ];

  return fields;
};
