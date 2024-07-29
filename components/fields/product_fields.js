import  { useState, useEffect } from 'react';
import { fetchAndTransformClientData, fetchAndTransformStaffData ,fetchAndTransformCutterData} from '@/pages/api/Select';
import { useTranslation } from "next-i18next";

export const FieldsArray = () => {
  const [clients, setClient] = useState([]);
  const [cutters,setCutter] = useState([]);
  const { t } = useTranslation("common");
  const [userData,setUserdata] =useState([]);
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
}, [])
  const measuretypes = [
    { value: "OBD", label: "OBD" },
    { value:"TOOTH_THICKNESS", label: "Tooth Thickness" }
  ];

  const twistData = [
    { value: "LEFT", label: "LEFT" },
    { value: "RIGHT", label: "RIGHT" },
    { value: "SPUR", label: "SPUR" }
  ];

  const dislocationData = [
    {value:"Dislocation Amount", label:t("product.Dislocation amount")},
    {value:"Dislocation Coefficient",label:t("product.Dislocation Coefficient")},
  ]

  const fields = [
    { label: t('Product.Cutter No'), name: 'cutter_no', readOnly: true,data:cutters },
    { label: t('Product.Pressure Angle'), name: 'pressure_ang' ,type:'input', precision:6},
    { label: t('Product.Product Id'), name: 'product_id', type: 'text',withAsterisk:true },
    { label: t('Product.Module'), name: 'module', type: 'input', precision:6 },
    { label: t('Product.Helix'), name: 'helix',type:'input', precision:6 },
    { label: t('Product.Client'), name: 'client', type: 'select', data: clients ,withAsterisk:true},
    { label: t('Product.Gear Drawing No'), name: 'gear_dwg_no', type: 'text' },
    { label: t('Product.Root Diameter'), name: 'root_dia',type:'input' , precision:6},
    { name:"register_by" ,label: t('Product.Registered By'), type: "select", data:userData,readOnly:true,},
    { label: t('Product.No Of Teeth'), name: 'no_of_teeth', type: 'input' , precision:6},
    { label: t('Product.Shaving Diameter'), name: 'shaving_dia', type: 'input',precision:6 },
    { label: t('Product.Registration Date'), name: 'register_date', type: 'date' },
    { label: t('Product.no_teeth_span'), name: 'no_teeth_span', type: 'input', precision:6 },
    { label: t('Product.Outside Diameter'), name: 'outside_dia', type: 'input', precision:6 },
    { label: t('Product.Material'), name: 'material', type: 'text' },
    { label: t('Product.Measure Type'), name: 'measure_type', type: 'select', data: measuretypes },
    { label: t('Product.Coefficient Of Add Mod'), name: 'coeff_add_mod', type: 'input', precision:6 },
    { label: t('Product.Tooth Thickness'), name: 'tooth_thickness', type: 'input' , precision:6},
    { label: 'OBD', name: 'obd', type: 'text' },
    { label: t('Product.Span Measurement'), name: 'span_measurement', type: 'input', precision:6 },
    { label: t('product.Dislocation Coefficient'), name:'disloc_coeff', type:'select', data: dislocationData},
    { label: t('Product.Gear Width'), name: 'gear_width', type: 'input', precision:6 },
    { label: t('Product.Twist Direction'), name: 'twist_direction', type: 'select', data: twistData },
    { label: t('Product.Product Image'), name: 'product_image', type: 'file'},
    { name: "comment", label: t('Comment'), type: 'textarea' },
  ];

  return fields;
};