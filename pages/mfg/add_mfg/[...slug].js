import React, {useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  Box,
  NumberInput,
  Select,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";
import Layout from "@/components/layout/Layout";
import { get, post, put } from "@/pages/api/apiUtils";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import CustomDataTable from "@/components/cutterListModal";
import DatePicker from "@/components/DatePicker";
import {FieldsArray} from '../../../components/fields/mfg_fields';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getFormattedDate } from "@/utils/dateUtils";
import { UserManagement } from "@/utils/UserManagement";
import { removeNulls } from "@/utils/removeNulls";
import SubmitButtons from "@/components/SubmitButtons";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { handleApiError } from "@/utils/handleApiError";

const registerBy = UserManagement.getItem("id");
const userid = parseInt(registerBy);
function AddMFG() {
  const initialDate = getFormattedDate();
  const { t } = useTranslation('common')
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const fields = FieldsArray();
  const { slug } = router.query;
  const isEditing = slug && slug[0] === "edit";
  const id = slug && slug[1]; // Extract the id from the slug array

  const breadcrumbs = [
    { label:  t('mfg'), link: "/mfg" },
    { label:isEditing? t('editmfg'):t('addmfg'), link: "/mfg/add_mfg/new" },
  ];

 
  const form = useForm({
    initialValues: {
      mfg_no:"",
      register_date: initialDate,
      location: "",
      drawing_no: "",
      supplier: "",
      status: "AVAILABLE",
      process_no: "",
      process_type: "",
      remarks: "",
      module:"",
      regrind_count: 0,
      cutter_no: 0,
      register_by: userid,
      manager: 0,
      client: 0,
      EOL:"FALSE"
    },
    validate: {
      cutter_no:(value) => value == 0 && t('Cutter No is required'),
      mfg_no: (value) => value.length < 1 && t('MFG no is required'),
      client: (value) => value == 0 && t('Client is required'),
      manager: (value) => value == 0 && t('Manager is required'),
      module: (value) => value.length == 0 && t('Module is required'),
    },
  }); 
  const fetchData = async () => {
    try {
      const data = await get(`mfg/${id}/`);
      const nulltostring = removeNulls(data);
      form.setValues(nulltostring);
    } catch (error) {
      handleApiError(error, router, t);
    }
  };
  const fetchClientDatabyManager=async(id)=>{
    try {
      const data = await get(`/staff/belong/${id}`);
      form.setFieldValue("client",data.client_id)
    } catch (error) {
    }
  }
  useEffect(() => {
    if (isEditing && id) {
      fetchData();
    }
  }, [isEditing, id]);
  const   createOrUpdateData = async (addanother,values) => {
    try {
      const formData = new FormData();
      let data = values;
      for (const key in data) {
          formData.append(key, data[key]);
      }
      const endpoint = isEditing ? `/mfg/${id}/` : "/mfg/";
      const response = isEditing
        ? await put(endpoint, formData)
        : await post(endpoint, formData);
      const message =  isEditing ? t('Update') : t('Success');
      notifications.show({
        title: message,
        message: t(response),
        color: "green",
      });
      form.reset();
        addanother?form.setFieldValue("register_by", userid)
        : router.push("/mfg");
    }
     catch (error) {
      handleApiError(error, router, t);
    }
    finally {
      setIsSubmitting(false); // Reset the submission state
    }
  };
  const onSubmit = (e, addanother) => {
    e.preventDefault();
    setIsSubmitting(true);
    form.validate();
    if (!form.validate().hasErrors) {
      createOrUpdateData(addanother,form.values);
    } else {
      notifications.show({
        title: t('Error'),
        message: t('Please fill the mandatory feilds.'),
        color: 'red',
      });
      setIsSubmitting(false);
    }
  };
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Box>
          <CustomDataTable    setShowModal={setShowModal} showModal={showModal} form={form}/>
      <Title order={3}>  {isEditing? t('editmfg'):t('addmfg')}</Title>
        <form >
          <div className="container">
          {fields.map((field) => {
              const {  name, type, ...props } = field;
              if (name === "manager") {
                return (
                  <Select
                    key={name}
                    placeholder="Pick one"
                    searchable
                    nothingFound="Nothing found..."
                    value={form.values[field.name]}
                    onChange={(value) => {
                      form.setFieldValue(field.name, value);
                      fetchClientDatabyManager(value)
                    }}
                    {...props}
                  />
                );
              }
              if (type === "select") {
                return (
                  <Select
                    key={name}
                    placeholder="Pick one"
                    searchable
                    nothingFound="Nothing found..."
                    value={form.values[field.name]}
                    onChange={(value) => {
                      form.setFieldValue(field.name, value);
                    }}
                    {...form.getInputProps(name)}
                    {...props}
                  />
                );
              }

              if (type === "date") {
                return (
                  <div key={name}>
                    <DatePicker key={name} name={name} form={form} locale={router.locale} {...props} />
                  </div>
                );
              }
              if (type === "number") {
                return (
                  <div key={name}>
                    <NumberInput
                      key={name}
                      removeTrailingZeros
                      min={0}
                      {...props}
                      {...form.getInputProps(name)}  
                    />
                  </div>
                );
              }
              if (name == "cutter_no") {
                return (
                  <Box   key={name}>
                      <Select
                        {...form.getInputProps(name)}  
                        {...props}
                          onClick={() => setShowModal(true)}
              />
                    {/* {cutter} */}
                    {name == "cutter_no" && (
                      <UnstyledButton
                        onClick={() => setShowModal(true)}
                        className="selectbutton"
                      >
                        {t('Select')}
                      </UnstyledButton>
                    )}
                  </Box>
                );
              }
              // Default to TextInput for other types
              return (
                <TextInput
                  key={name}
                  {...form.getInputProps(name)}
                  {...props}
                />
              );
            })}          
          </div>
        </form>
      </Box>
     <SubmitButtons isEditing={isEditing} onSubmit={onSubmit} isSubmitting={isSubmitting}/>
    </Layout>
  );
}
export const getStaticPaths = async () => {

  return {
      paths: [],
      fallback: 'blocking'
  }
}

export const getStaticProps = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', [
      'common'
    ])),
  },
})
export default ProtectedRoute(AddMFG);