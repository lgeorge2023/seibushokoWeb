import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  Box,
  Grid,
  NumberInput,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import Layout from "@/components/layout/Layout";
import { get, post, put } from "@/pages/api/apiUtils";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FieldsArray } from "../../../components/fields/machines_fields";
import DatePicker from "@/components/DatePicker";
import { getFormattedDate } from "@/utils/dateUtils";
import ImageFile from "@/components/ImageFile";
import { UserManagement } from "@/utils/UserManagement";
import { removeNulls } from "@/utils/removeNulls";
import SubmitButtons from "@/components/SubmitButtons";
import { handleApiError } from "@/utils/handleApiError";
const id = UserManagement.getItem("id");
const parsedid = parseInt(id)
function AddMachines() {
  const { t } = useTranslation("common");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { slug } = router.query;
  const isEditing = slug && slug[0] === "edit";
  const id = slug && slug[1]; // Extract the id from the slug array
  const fields = FieldsArray();
  const breadcrumbs = [
    { label: t('Machines'), link: "/machines" },
    {
      label:isEditing ?t("edit_machines"):t("add_machines"),
      link: "/machines/add_machines/new",
    },
  ];
  const initialDate = getFormattedDate();
  const form = useForm({
    initialValues: {
      machineid: "",
      machineline: "",
      machinetype: "",
      machinemodels: "",
      specimage: "",
      registrationdate: initialDate,
      registeredby: parsedid,
      client: 0,
    },
    validate: {
      machineid: (value) => value.length < 1 && t("Machine id is required"),
      client: (value) => value == 0 && t("Client is required"),
    },
  });
  const fetchData = async () => {
    try {
      const data = await get(`machines/${id}/`);
      const nulltostring = removeNulls(data);
      form.setValues(nulltostring);
    } catch (error) {
      handleApiError(error, router, t);
    }
  }

  useEffect(() => {
    if (isEditing && id) {
      fetchData();
    }
  }, [isEditing, id]);
  const createOrUpdateData = async (addanother,values) => {
    try {
      const formData = new FormData(); 
      let data = values;
      if (typeof(data.specimage)!='object'|| data.specimage==null ) {
        data = { ...data, specimage: '' };
      }
      for (const key in data) {
        formData.append(key, data[key]);
      }
      const endpoint = isEditing ? `/machines/${id}/` : "/machines/";
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
      addanother? form.setFieldValue("registeredby", parsedid):router.push('/machines');
    } catch (error) {
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
          <Title order={3}> {isEditing ?t("edit_machines"):t("add_machines")}</Title>
          <Grid >
            {fields.map((field) => {
              const { name, type, ...props } = field;
              if (type === "select") {
                return (
                  <Grid.Col md={6} lg={4}key={name}>
                    <Select
                      key={name}
                      value={form.values[field.name]}
                      {...form.getInputProps(name)}
                      {...props}
                    />
                  </Grid.Col>
                );
              }
              if (type === "date") {
                return (
                  <Grid.Col md={6} lg={4}  key={name}>
                    <DatePicker key={name} name={name} form={form} {...props} />
                  </Grid.Col >
                );
              }

              if (type === "file") {
                return (
                  <Grid.Col md={6} lg={4}  key={name}>
                  <ImageFile name ={name} form={form} {...props} page="addmachine"/>
                  </Grid.Col>
                );
              }
              if (type === "number") {
                return (
                  <Grid.Col md={6} lg={4}key={name} >
                    <NumberInput
                      min={0}
                      key={name}
                      {...form.getInputProps(field.name)}
                      {...props}
                    />
                  </Grid.Col>
                );
              }

              return (
                <Grid.Col md={6} lg={4} key={name}  >
                  <TextInput
                    key={field.name}
                    {...form.getInputProps(field.name)}
                    {...props}
                  />
                </Grid.Col>
              );
            })}
          </Grid>
          <SubmitButtons isEditing={isEditing} onSubmit={onSubmit} isSubmitting={isSubmitting}/>
      </Box>
    </Layout>
  );
}
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});
export default ProtectedRoute(AddMachines);
