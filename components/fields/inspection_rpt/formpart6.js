import FormTable from "@/components/FormTable";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";


const column = [
  { colspan: 2, label: "TRIAL CONDITION" },
];

const data = [
  [
    { type:"text", label: "Angle of Axial Crossing" },
    { type: "number",label: "" ,name:"report_trial.pc_angle_axial_cross"},
  ],
   [
    { type:"text", label: "Cutter speed" },
    { type: "number",label: "",name:"report_trial.pc_cutter_speed" },
  ],
   [
    { type:"text", label: "Plunge feed" },
    { type: "input",label: "",name:"report_trial.pc_plunge_feed" },
  ],
  [
    { type:"text", label: "Amount of cut" },
    { type: "number",label: "" ,name:"report_trial.pc_amount_cut"},
  ],
  [
    { type:"text", label: "T1" },
    { type: "number",label: "",name:"report_trial.pc_t1" },
  ],
  [
    { type:"text", label: "T2" },
    { type: "number",label: "" ,name:"report_trial.pc_t2"},
  ],
  [
    { type:"text", label: "T3" },
    { type: "number",label: "" ,name:"report_trial.pc_t3"},
  ],
  [
    { type:"text", label: "BM amount" },
    { type: "number",label: "",name:"report_trial.pc_bm_amount" },
  ],
   [
    { type:"text", label: "Straddle Tooth Thickness" },
    { type: "number",label: "",name:"report_trial.pc_straddle_thickness" },
  ],
   [
    { type:"text", label: "Number of Teeth" },
    { type: "number",label: "" ,name:"report_trial.pc_no_teeth"},
  ],
  [
    { type:"text", label: "OBD" },
    { type: "number",label: "" ,name:"report_trial.pc_obd"},
  ],
  [
    { type:"text", label: "OBD Diameter" },
    { type: "number",label: "" ,name:"report_trial.pc_obd_dia"},
  ],
  [
    { type:"text", label: "Approach" },
    { type: "input",label: "" ,name:"report_trial.pc_approach"},
  ],
];

const FormPart6 = (props) => {
  const {form,visible}= props;
  const { t } = useTranslation("common");
  const [disabled,setDisabled] = useState(true);

  useEffect(()=>{
    if(visible == 1 ){
      setDisabled(false);
    }
  },[visible])

  const column = [
    { colspan: 2, label: t('inspection.TRIAL CONDITION') },
  ];
  
  const data = [
    [
      { type:"text", label: t('inspection.Angle of Axial Crossing'),readOnly:true,disabled:disabled },
      { type: "input",label: "" ,name:"report_trial.pc_angle_axial_cross",precision:6,readOnly:true,disabled:disabled},
    ],
     [
      { type:"text", label:t('inspection.Cutter speed'),readOnly:true,disabled:disabled },
      { type: "number",label: "",name:"report_trial.pc_cutter_speed",precision:6,readOnly:true,disabled:disabled },
    ],
     [
      { type:"text", label: t('inspection.Plunge feed'),readOnly:true,disabled:disabled},
      { type: "input",label: "",name:"report_trial.pc_plunge_feed" ,precision:6,readOnly:true,disabled:disabled},
    ],
    [
      { type:"text", label: t('inspection.Amount of cut'),readOnly:true,disabled:disabled },
      { type: "number",label: "" ,name:"report_trial.pc_amount_cut",precision:6,readOnly:true,disabled:disabled},
    ],
    [
      { type:"text", label: "T1",readOnly:true,disabled:disabled },
      { type: "number",label: "",name:"report_trial.pc_t1" ,precision:6,readOnly:true,disabled:disabled},
    ],
    [
      { type:"text", label: "T2",readOnly:true,disabled:disabled },
      { type: "number",label: "" ,name:"report_trial.pc_t2",precision:6,readOnly:true,disabled:disabled},
    ],
    [
      { type:"text", label: "T3",readOnly:true,disabled:disabled },
      { type: "number",label: "" ,name:"report_trial.pc_t3",precision:6,readOnly:true,disabled:disabled},
    ],
    [
      { type:"text", label: t('inspection.BM amount'),readOnly:true,disabled:disabled },
      { type: "number",label: "",name:"report_trial.pc_bm_amount",precision:6,readOnly:true,disabled:disabled },
    ],
     [
      { type:"text", label:t('inspection.Straddle Tooth Thickness'),readOnly:true,disabled:disabled },
      { type: "number",label: "",name:"report_trial.pc_straddle_thickness",precision:6,readOnly:true,disabled:disabled },
    ],
     [
      { type:"text", label: t('inspection.Number of Teeth'),readOnly:true,disabled:disabled },
      { type: "number",label: "" ,name:"report_trial.pc_no_teeth",precision:6,readOnly:true,disabled:disabled},
    ],
    [
      { type:"text", label: "OBD",readOnly:true,disabled:disabled },
      { type: "number",label: "" ,name:"report_trial.pc_obd",precision:6,readOnly:true,disabled:disabled},
    ],
    [
      { type:"text", label: t('inspection.OBD Diameter'),readOnly:true,disabled:disabled },
      { type: "number",label: "" ,name:"report_trial.pc_obd_dia",precision:6,readOnly:true,disabled:disabled},
    ],
    [
      { type:"text", label: t('inspection.Approach'),readOnly:true,disabled:disabled },
      { type: "input",label: "" ,name:"report_trial.pc_approach",readOnly:true,disabled:disabled},
    ],
  ];

  return (
    <FormTable header={"PLUNGE CUT"}column={column} data={data} form={form}/>
  );
};
export default FormPart6;
