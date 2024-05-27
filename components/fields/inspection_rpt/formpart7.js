import FormTable from "@/components/FormTable";
import { fetchAndTransformStaffData } from "@/pages/api/Select";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";


const FormPart7 = (props) => {
  const [manager, setManager] = useState([]);
  const { t } = useTranslation("common");

  const {form,locale}= props;
  const fetchAllData = async () => {
    try {
      const [managerData] = await Promise.all([
        fetchAndTransformStaffData(),
      ]);
      setManager(managerData);
    } catch (error) {
    }
  };
  useEffect(() => {
    fetchAllData()
  }, [])
  const data = [
    [
      { type:"text", label: t('inspection.Person In Charge') },
      { type: "select",name:"person_charge",data:manager,disabled:true},
    ],
     [
      { type:"text", label: t('inspection.Sign Date') },
      { type: "date",label: "", name:"sign_date"},
    ],
  ];
  return (
    <FormTable header={null} column={[]} data={data} form={form} locale={locale} />
  );
};

export default FormPart7;