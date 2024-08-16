import FormTable from "@/components/FormTable";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

const FormPart4 = (props) => {
  const {form,visible}= props;
  const { t } = useTranslation("common");
  const [disabled,setDisabled] = useState(true);

  useEffect(()=>{
    if(visible == 1 ){
      setDisabled(false);
    }
  },[visible])

  const data = [
    [
      { type:"text", label: t('inspection.Measure Outside Diameter'),readOnly:true,disabled:disabled },
      { type: "number",label: "" ,name:"outside_dia",precision:6,readOnly:true,disabled:disabled},
      { type:"text", label: t('inspection.Axial Distance Life Span'),readOnly:true,disabled:disabled},
  
    ],
     [
      { type:"text", label: t('inspection.Straddle Tooth Thickness'),readOnly:true,disabled:disabled },
      { type: "number",label: "" ,name:"straddle_tooth_thick",precision:6,readOnly:true,disabled:disabled},
      { type:"number", label: "Ø" ,name:"axial_dist_life_span",precision:6,readOnly:true,disabled:disabled},
  
    ],
     [
      { type:"text", label: t('inspection.Number of Straddle Teeth'),readOnly:true,disabled:disabled },
      { type: "number",label: "" ,name:"no_straddle_tooth",precision:6,readOnly:true,disabled:disabled },
      { },
    ],
    [
      { type:"text", label: t('inspection.Overball Measurement'),readOnly:true,disabled:disabled },
      { type: "number",label: "" ,name:"overball_measure",precision:6,readOnly:true,disabled:disabled},
      {},
  
    ],
    [
      { type:"text", label: t('inspection.Overball Diameter'),readOnly:true,disabled:disabled },
      { type: "input",label: "",name:"overball_dia",readOnly:true,disabled:disabled },
      {  },
    ],
  ];

  return (
 <FormTable  header={null} column={[]} data={data} form={form}/>
  );
};

export default FormPart4;
