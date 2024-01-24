import React from 'react';
import FormTable from '@/components/FormTable';

export default function FormPart3(props) {
  const form = props.form;
  const column = [
    { colspan: 1,},
    { colspan: 1, },
    { colspan: 1, label: "TAP(GS)" },
    { colspan: 1, label: "CRN(GS)" },
    { colspan: 2, label: "LEAD" },
  ];
  const data = [
    [
       { type:"text", label: "SAP" ,rowspan:1,},
       { type:"input",name:"regrind_work_order.sap",placeholder:"SAP"},
       { type:"input",name:'regrind_work_order.sap_p2',placeholder:"SAP + P2"},
       {type:"input",name :"regrind_work_order.crn_sap_p2"},
       { type:"text", label: "R" ,rowspan:1,},
       { type:"input",name:'regrind_work_order.leadtap_r',placeholder:"LeadTap-R"},
    ],
    [
      { type:"text", label: "P2" ,rowspan:1,},
      { type:"input",name:"regrind_work_order.p2",placeholder:"P2"},
      { type:"input",name:'regrind_work_order.p2_p3',placeholder:"P2 + P3"},
      { type:"input",name:'regrind_work_order.crn_p2_p3',placeholder:""},
      { type:"text", label: "L" ,rowspan:1,},
      { type:"input",name:'regrind_work_order.leadtap_l',placeholder:"LeadTap-L"},
   ],  
   [
    { type:"text", label: "P3" ,rowspan:1,},
    { type:"input",name:"regrind_work_order.p3",placeholder:"P3"},
    { type:"input",name:'regrind_work_order.p3_p4',placeholder:"P3 + P4"},
    { type:"input",name:'regrind_work_order.crn_p3_p4',placeholder:""},
    {colspan:2},
    {}
    
 ],  
 [
  { type:"text", label: "P4" ,rowspan:1,},
  { type:"input",name:"regrind_work_order.p4",placeholder:"P4"},
  { type:"input",name:'regrind_work_order.p4_p5',placeholder:"P4 + P5"},
  { type:"input",name:'regrind_work_order.crn_p4_p5',placeholder:""},
  {colspan:2},
  {}
],  
[
  { type:"text", label: "P5" ,rowspan:1,},
  { type:"input",name:"regrind_work_order.p5",placeholder:"P5"},
{},
{},
{ type:"text", label: "CRN" ,},
{ type:"input", name: "regrind_work_order.crn" ,colspan:2,placeholder:"CRN"},

],  
  ];
  return (
    <FormTable  header={null} column={column} data={data} form={form} style={{display:"flex"}}/>
  );
}
