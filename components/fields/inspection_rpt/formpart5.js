import FormTable from "@/components/FormTable";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";


const FormPart5 = (props) => {
  const {form,visible}= props;
  const { t } = useTranslation("common");
  const [disabled,setDisabled] = useState(true);

  useEffect(()=>{
    if(visible == 1 ){
      setDisabled(false);
    }
  },[visible])

  const column = [
    { colspan: 2, label: "TRIAL CONDITION" },
  ];
  
  const data = [
    [
      { type:"text", label: t('inspection.Angle of Axial Crossing'),readOnly:true,disabled:disabled },
      { type: "input",label: "" ,name:"report_trial.cc_angle_axial_cross",precision:6,readOnly:true,disabled:disabled},
    ],
     [
      { type:"text", label: t('inspection.Diagonal Angle'),readOnly:true,disabled:disabled },
      { type: "number",label: "",name:"report_trial.cc_diagonal_angle" ,precision:6,readOnly:true,disabled:disabled},
    ],
     [
      { type:"text", label: t('inspection.Cutter Speed'),readOnly:true,disabled:disabled},
      { type: "number",label: "" ,name:"report_trial.cc_cutter_speed",precision:6,readOnly:true,disabled:disabled},
    ],
    [
      { type:"text", label: t('inspection.Transverse Feed Rate 1'),readOnly:true,disabled:disabled},
      { type: "number",label: "",name:"report_trial.cc_tranverse_feed1",precision:6,readOnly:true,disabled:disabled },
    ],
    [
      { type:"text", label: t('inspection.Transverse Feed Rate 2'),readOnly:true,disabled:disabled},
      { type: "number",label: "" ,name:"report_trial.cc_tranverse_feed2",precision:6,readOnly:true,disabled:disabled},
    ],
    [
      { type:"text", label: t('inspection.Amount of Cut'),readOnly:true,disabled:disabled},
      { type: "number",label: "",name:"report_trial.cc_amount_cut",precision:6,readOnly:true,disabled:disabled },
    ],
    [
      { type:"text", label: t('inspection.Number Of Cuts'),readOnly:true,disabled:disabled},
      { type: "number",label: "",name:"report_trial.cc_no_of_cuts",precision:6,readOnly:true,disabled:disabled },
    ],
    [
      { type:"text", label: t('inspection.Stroke'),readOnly:true,disabled:disabled },
      { type: "input",label: "",name:"report_trial.cc_stroke",precision:6,readOnly:true,disabled:disabled },
    ],
     [
      { type:"text", label: t('inspection.Straddle ToothThickness'),readOnly:true,disabled:disabled },
      { type: "number",label: "",name:"report_trial.cc_straddle_thickness",precision:6,readOnly:true,disabled:disabled },
    ],
     [
      { type:"text", label: t('inspection.Number of Teeth'),readOnly:true,disabled:disabled },
      { type: "number",label: "" ,name:"report_trial.cc_no_teeth",precision:6,readOnly:true,disabled:disabled},
    ],
    [
      { type:"text", label:t('inspection.OBD'),readOnly:true,disabled:disabled},
      { type: "number",label: "",name:"report_trial.cc_obd" ,precision:6,readOnly:true,disabled:disabled},
    ],
    [
      { type:"text", label: t('inspection.OBD Diameter'),readOnly:true,disabled:disabled },
      { type: "number",label: "" ,name:"report_trial.cc_obd_dia",precision:6,readOnly:true,disabled:disabled},
    ],
    [
      { type:"text", label: t('inspection.Approach'),readOnly:true,disabled:disabled },
      { type: "input",label: "",name:"report_trial.cc_approach",readOnly:true,disabled:disabled },
    ],
  ];

  return (
  <FormTable  header={"CONVENTIONAL"}column={column} data={data} form={form}/>
  );
};


export default FormPart5;
