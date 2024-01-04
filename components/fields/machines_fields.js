
import React, { useState, useEffect } from 'react';
import { fetchAndTransformClientData, fetchAndTransformStaffData } from '@/pages/api/Select';
import { IconUpload } from '@tabler/icons-react';
import { useTranslation } from "next-i18next";
export const  FieldsArray= ()=>{
    const [clients, setClient] = useState([]);
    const { t } = useTranslation("common");
    const [userData,setUserdata] =useState([])

    const fetchAllData = async () => {
      try {
        const [clientData,userData] = await Promise.all([
          fetchAndTransformClientData(),
          fetchAndTransformStaffData()
        ]);
  
        setClient(clientData);
        setUserdata(userData);
      } catch (error) {
      }}
    useEffect(() => {
      fetchAllData();
    }, [])
    const fields = [
    { label: t('Machine.Machine Id'), placeholder: '', name: 'machineid' ,withAsterisk:true },
    { label: t('Machine.Registration Date'), placeholder: 'Pick a date', name: 'registrationdate', type: 'date',withAsterisk:true },
    { label: t('Machine.Description'), placeholder: '', name: 'description' },
    { name:"registeredby",label: t('Machine.Registered By'),type: "select", data:userData,readOnly:true,},
    { label: t('Machine.Machine Line'), placeholder: '', name: 'machineline',type:"number" },
    {
        name: 'client',
        label: t('Machine.Client'),
        type:"select",
        placeholder: 'Please Select',
        data: clients,
        placeholder:"Pick one",
        withAsterisk:true
      },    
    { label: t('Machine.Machine Type'), placeholder: '', name: 'machinetype' },
    { label: t('Machine.Model'), placeholder: '', name: 'machinemodels' },
    { label: t('Machine.Spec Image'), placeholder: 'Upload Image', name: 'specimage' ,type:"file", icon:<IconUpload size="0.4cm" />},

    
];

return fields;
};