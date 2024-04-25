import FormTable from "@/components/FormTable";
import React from "react";
import { useTranslation } from "next-i18next";


const FormPart5 = (props) => {
  const {form}= props;
  const { t } = useTranslation("common");

  const column = [
    { colspan: 2, label: "TRIAL CONDITION" },
  ];
  
  const data = [
    [
      { type:"text", label: t('inspection.Angle of Axial Crossing') },
      { type: "input",label: "" ,name:"report_trial.cc_angle_axial_cross",precision:6},
    ],
     [
      { type:"text", label: t('inspection.Diagonal Angle') },
      { type: "number",label: "",name:"report_trial.cc_diagonal_angle" ,precision:6},
    ],
     [
      { type:"text", label: t('inspection.Cutter Speed')},
      { type: "number",label: "" ,name:"report_trial.cc_cutter_speed",precision:6},
    ],
    [
      { type:"text", label: t('inspection.Transverse Feed Rate 1') },
      { type: "number",label: "",name:"report_trial.cc_tranverse_feed1",precision:6 },
    ],
    [
      { type:"text", label: t('inspection.Transverse Feed Rate 2') },
      { type: "number",label: "" ,name:"report_trial.cc_tranverse_feed2",precision:6},
    ],
    [
      { type:"text", label: t('inspection.Amount of Cut')},
      { type: "number",label: "",name:"report_trial.cc_amount_cut",precision:6 },
    ],
    [
      { type:"text", label: t('inspection.Number Of Cuts')},
      { type: "number",label: "",name:"report_trial.cc_no_of_cuts",precision:6 },
    ],
    [
      { type:"text", label: t('inspection.Stroke') },
      { type: "number",label: "",name:"report_trial.cc_stroke",precision:6 },
    ],
     [
      { type:"text", label: t('inspection.Straddle ToothThickness') },
      { type: "number",label: "",name:"report_trial.cc_straddle_thickness",precision:6 },
    ],
     [
      { type:"text", label: t('inspection.Number of Teeth') },
      { type: "number",label: "" ,name:"report_trial.cc_no_teeth",precision:6},
    ],
    [
      { type:"text", label:t('inspection.OBD')},
      { type: "number",label: "",name:"report_trial.cc_obd" ,precision:6},
    ],
    [
      { type:"text", label: t('inspection.OBD Diameter') },
      { type: "number",label: "" ,name:"report_trial.cc_obd_dia",precision:6},
    ],
    [
      { type:"text", label: t('inspection.Approach') },
      { type: "input",label: "",name:"report_trial.cc_approach" },
    ],
  ];

  return (
  <FormTable  header={"CONVENTIONAL"}column={column} data={data} form={form}/>
  );
};


export default FormPart5;
