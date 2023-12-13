import Layout from "@/components/layout/Layout";
import {
  Box,
  TextInput,
  Title,
  Select,
  UnstyledButton,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {  useEffect, useState } from "react";
import { get, post, put } from "@/pages/api/apiUtils";
import DatePicker from "@/components/DatePicker";
import CustomDataTable from "@/components/cutterListModal";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { format, startOfDay } from "date-fns";
import { FieldsArray } from "../../../components/fields/product_fields";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ImageFile from "@/components/ImageFile";
import { UserManagement } from "@/utils/UserManagement";
import { removeNulls } from "@/utils/removeNulls";
import SubmitButtons from "@/components/SubmitButtons";
import ProtectedRoute from "@/utils/ProtectedRoute";

const registerBy = UserManagement.getItem("id");
const userId = parseInt(registerBy);

const AddProduct = () => {
  const { t } = useTranslation('common')
  const router = useRouter();
  const { slug } = router.query;
  const isEditing = slug && slug[0] === "edit";
  const id = slug && slug[1]; // Extract the id from the slug array
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fields = FieldsArray();
  const form = useForm({
    initialValues: {
      cutter_no: "",
      pressure_ang: "",
      product_id: "",
      module: "",
      helix: "",
      gear_dwg_no: "",
      root_dia: "",
      register_by: userId,
      no_of_teeth: "",
      shaving_dia: "",
      no_teeth_span: "",
      outside_dia: "",
      material: "",
      measure_type: "",
      coeff_add_mod: "",
      tooth_thickness: "",
      obd: "",
      client:0,
      span_measurement: "",
      gear_width: "",
      twist_direction: "",
      register_date: format(startOfDay(new Date()), "yyyy-MM-dd"),
      product_image: "",
    },
    validate: {
      client: (value) => {
        if (value==0) {
          return t("Client is required");
        }
        // Add additional validation logic for the product ID if needed
        return null;
      },
      product_id: (value) => {
        if (!value) {
          return t("Product ID is required");
        }
        // Add additional validation logic for the product ID if needed
        return null;
      },
    },
 
  });
  const createOrUpdateData = async (addanother,values) => {
    try {
      const formData = new FormData();
      let data = values;
      if (typeof(data.product_image)!= 'object' || data.product_image==null ) {
        data = { ...data, product_image: "" };
      }
      for (const key in data) {
          formData.append(key,data[key]);
      }
      const endpoint = isEditing ? `/product/${id}/` : "/product/";
      const response = isEditing
        ? await put(endpoint, formData)
        : await post(endpoint, formData);
      const message = isEditing ? t('Update') : t('Success');
      notifications.show({
        title: message,
        message: t(response),
        color: "green",
      });
   form.reset();
   addanother?form.setFieldValue("register_by", userId)
   : router.push("/product");
    } catch (error) {
      notifications.show({
        title: t('Error'),
        message: t(error.trim()),
        color: "red",
      });
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
  const fetchData  = async () => {
    try {
      const data = await get(`product/${id}/`);
      const nulltostring = removeNulls(data);
      form.setValues(nulltostring);
    } catch (error) {
      console.error(error);
    }
  };
useEffect(() => {
  if (isEditing && id) {
    fetchData();
  }
}, [id,isEditing])
const breadcrumbs = [
  { label: t('Product'), link: "/product" },
  { label: isEditing?t('edit_product'): t('add_new_product'), link: "/product/add_product" },
];
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Box>
      <CustomDataTable  setShowModal={setShowModal} showModal={showModal} form={form}/>
         <Title order={3}>{isEditing?t('edit_product'): t('add_new_product')}</Title>
          <div className='container'>
            {fields.map((field) => {
              const { name, type, ...props } = field;

              if (type === "select") {
                return (
                  <Select
                    key={name}
                    placeholder="Pick one"
                    value={form.values[field.name]}
                    onChange={(value) => {
                      form.setFieldValue(field.name, value);
                    }}
                    {...form.getInputProps(name)}
                    {...props}
                  />
                );
              }

              if (type === "file") {
                 return (
                <ImageFile key={name} name={name} form={form}  {...props}/>)
              }

              if (type === "date") {
                return (
                  <DatePicker key={name} name={name} form={form} {...props} />
                );
              }
              if (type === "number") {
                return (
                    <NumberInput
                      key={name}
                      min={0}
                      removeTrailingZeros
                      {...form.getInputProps(name)}
                      {...props}
                    />
                );
              }
              if (name == "cutter_no") {
                return (
                  <Box key={name}>
                 <Select
                key={name}
               {...form.getInputProps(name)}  
               {...props}
                 onClick={() => setShowModal(true)}
     />
                    {/* {cutter} */}
                    {name == "cutter_no" && (
                      <UnstyledButton
                        onClick={() => setShowModal(true)}
                        className='selectbutton'
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
          <SubmitButtons isEditing={isEditing} onSubmit={onSubmit} isSubmitting={isSubmitting}/>
      </Box>
    </Layout>
  );
};
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
export default ProtectedRoute(AddProduct) ;
