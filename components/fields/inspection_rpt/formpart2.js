import FormTable from "@/components/FormTable";
import { fetchAndTransformRegrindData } from "@/pages/api/Select";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { get } from "@/pages/api/apiUtils";
import { removeNulls } from "@/utils/removeNulls";

const FormPart2 = (props) => {
  const { t } = useTranslation("common");
  const [regrind,setregrindData]=useState([]);
  const {form,cutterData}= props;
  const column = [
    { colspan: 2, label: t('inspection.TOOL SPESIFICATION') },
    { colspan: 2, label: t('inspection.TARGET WORK') },
    { colspan: 1, label: t('inspection.Specified Profile') },
  ];
  const tshelixdirection=[{ value: "LEFT", label: t('inspection.LEFT') },{value: "RIGHT", label: t('inspection.RIGHT')}]
  const twhelixdirection=[{ value: "LEFT", label: t('inspection.LEFT') },{value: "RIGHT", label: t('inspection.RIGHT')},{value:"SPUR",label:t('inspection.Spur')}]
  const trial=[{ value: "TRIAL", label: t('inspection.Trial') },{value: "NONTRIAL", label: t('inspection.Non Trial')}]
  

  const fetchAllData = async () => {
    try {
      const [
       regindData,
      ] = await Promise.all([
        fetchAndTransformRegrindData(),
      ]);
      setregrindData(regindData);
    } catch (error) {
    }
  };
  useEffect(() => {
    fetchAllData()
  }, [])

  const onchange  = async (product_id) => {
      try {
      const data = await get(`/product/report/${product_id}`);
      const newdata =removeNulls(data)
      form.setValues({"tw_work_no": newdata.id,"tw_disloc_coeff":newdata.coeff_add_mod,"tw_no_teeth":newdata.no_of_teeth ,
      "tw_helix_angle":newdata.helix,"tw_twist_direction":newdata.twist_direction, "tw_material":newdata.material,})
    } catch (error) {
    }
  };
  const onTrialchange=(e)=>{
      form.setValues({"trial":e,"specified_profile":e=='TRIAL'?t("False"):t("True")})
  }
  const data = [
    [
      { type:"text", label:t('inspection.Module') },
      { type: "input",label: "",name:"ts_module",precision:6 },
      { type:"text", label: t('inspection.Work No') },
      { type:"select" , label: "",data:cutterData,  name:"tw_work_no",onchange:onchange,value:parseInt(form.values.tw_work_no)},
      {  label: "",type: "input", rowspan: 2 ,name:"specified_profile",disabled:true},
    ],
     [
      { type:"text", label: t('inspection.Pressure Angle')},
      { type: "input",label: "",name:"ts_pressure_angle",precision:6 },
      { type:"text", label: t('inspection.Dislocation Coefficient')},
      { type: "input" , label: "",name:"tw_disloc_coeff",precision:6},
    ],
     [
      { type:"text", label: t('inspection.No Of Teeth/Gear') },
      { type: "input",label: "" ,name:"ts_no_teeth"},
      { type:"text", label: t('inspection.No Of Teeth') },
      { type: "input" , label: "",name:"tw_no_teeth"},
      { type:"text", label: t('inspection.Trial')},
    ],
    [
      { type:"text", label: t('inspection.Helix Angle') },
      { type: "input",label: "",name:"ts_helix_angle",precision:6 },
      { type:"text", label: t('inspection.Helix Angle') },
      { type: "input" , label: "",name:"tw_helix_angle",precision:6},
      { type: "select" , label: "",name:"trial",data:trial,onchange:onTrialchange,value:form.values.trial},
    ],
    [
      { type:"text", label: t('inspection.Helix Direction') },
      { type: "select",label: "" ,name:"ts_helix_direction",data:tshelixdirection},
      { type:"text", label: t('inspection.Twist Direction') },
      { type: "select" , label: "",name:"tw_twist_direction",data:twhelixdirection},
      {  },
    ],
    [
      { type:"text", label: t('inspection.Shaving Method') },
      { type: "select",label: "",name:"ts_shaving_method",data:regrind,disabled:true },
      { },
      { },
      {  rowspan: 2 },
    ],
    [
      { type:"text", label: t('inspection.Material') },
      { type: "input",label: "",name:"ts_material" },
      { type:"text", label: t('inspection.Material') },
      { type: "input" , label: "",name:"tw_material" },
    ],
  ];
  
  return (
    <FormTable header={null} column={column} data={data} form={form}/>
  );
};


export default FormPart2;
