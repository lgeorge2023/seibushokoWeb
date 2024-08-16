import Layout from "@/components/layout/Layout";
import { Box, TextInput, Title, Grid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import {  useEffect, useState } from "react";
import { get, post, put } from "@/pages/api/apiUtils";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { removeNulls } from "@/utils/removeNulls";
import { stringtoNull } from "@/utils/stringtoNull";
import FormInput from "@/components/FormInput";
import SubmitButtons from "@/components/SubmitButtons";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { handleApiError } from "@/utils/handleApiError";
import ImageFile from "@/components/ImageFile";
import { UserManagement } from "@/utils/UserManagement";

const AddCutter = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { slug } = router.query;
  const [type, setType] = useState([]);
  const isEditing = slug?.[0] === "edit";
  const id = slug?.[1];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [disabled,setDisabled] = useState(true);

  const form = useForm({
    initialValues: {
      cutter_no: "",
      cutter_dwg_no: "",
      module: "",
      pressure_ang: "",
      lead: "",
      helix_angle: "",
      no_of_teeth: "",
      supplier: "",
      pitch_circle_dia: "",
      base_circle_dia: "",
      span_measurement: "",
      no_teeth_span: "",
      gear_no: "",
      helix_degree: "",
      helix_min: "",
      helix_sec: "",
      hardness: "",
      lifespan: "",
      type: 0,
      cutter_dwg_file:''
    },
    validate: {
      cutter_no: (value) => value.length < 1 && t("Cutter No is required"),
      cutter_dwg_no: (value) =>
        value.length < 1 && t("Cutter drawing number is required"),
      type: (value) => value == 0 && t("Type is required"),
    },
  });
  const regrindType = async () => {
    const typeData = await get("/regrindtype/select/");
    const transformedTypeData = typeData.map((item) => ({
      value: item.id,
      label: item.type,
    }));
    setType(transformedTypeData);
  };
  useEffect(() => {
    regrindType();
    fetchClientId();
    if(visible == 1 ){
      setDisabled(false)
    }
  }, [visible]);
  const fetchData = async () => {
    try {
      const data = await get(`cutter/${id}/`);
      const nulltostring = removeNulls(data);
      form.setValues(nulltostring);
    } catch (error) {
      handleApiError(error, router, t);

    }
  };
  useEffect(() => {
    if (isEditing && id) {
      fetchData();
    }
  }, [isEditing, id]);

  const fields = [
    {
      name: "cutter_no",
      label: t("cutter.Cutter No"),
      type: "text",
      withAsterisk: true,
      readOnly:disabled,
    },
    {
      name: "type",
      label: t("cutter.Type"),
      type: "select",
      placeholder: "Please Select",
      data: type,
      withAsterisk: true,
      disabled:disabled,
    },
    { name: "module", label: t("cutter.Module"), type: "number", precision: 6,readOnly:disabled, },
    { name: "supplier", label: t("cutter.Supplier"), type: "text",readOnly:disabled},
    {
      name: "lead",
      label: t("cutter.Lead"),
      type: "select",
      placeholder: t("Please Select"),
      data: [
        { value: "LEFT", label: t("Left") },
        { value: "RIGHT", label: t("Right") },
      ],
      disabled:disabled,
    },
    {
      name: "pressure_ang",
      label: t("cutter.Pressure Angle"),
      type: "number",
      precision: 6,
      readOnly:disabled,
    },
    {
      name: "span_measurement",
      label: t("cutter.Span Measurement"),
      type: "number",
      precision: 6,
      readOnly:disabled,
    },
    {
      name: "helix_angle",
      label: t("cutter.Helix Angle"),
      type: "number",
      precision: 6,
      readOnly:disabled,
    },
    {
      name: "cutter_dwg_no",
      label: t("cutter.Cutter Drawing No"),
      type: "text",
      withAsterisk: true,
      readOnly:disabled,
    },
    {
      name: "no_teeth_span",
      label: t("cutter.No Of Teeth In Span"),
      type: "number",
      precision: 6,
      readOnly:disabled
    },
    { name: "helix_degree", label: t("cutter.Helix Angle CBD"), type: "text",readOnly:disabled },
    {
      name: "no_of_teeth",
      label: t("cutter.Number Of Teeth"),
      type: "number",
      precision: 6,
      readOnly:disabled
    },
    { name: "hardness", label: t("cutter.Hardness"), type: "text",readOnly:disabled },
    {
      name: "pitch_circle_dia",
      label: t("cutter.Pitch Circle Diameter"),
      type: "number",
      precision: 6,
      readOnly:disabled,
    },
    { name: "gear_no", label: t("cutter.Gear No"), type: "text",readOnly:disabled },
    {
      name: "lifespan",
      label: t("cutter.Life Span"),
      type: "number",
      precision: 6,
      readOnly:disabled
    },
    {
      name: "base_circle_dia",
      label: t("cutter.Base Circle Diameter"),
      type: "number",
      precision: 6,
      readOnly:disabled
    },
    {
      name: "cutter_dwg_file",
      label: t("cutter.dwgfile"),
      type: "file",
      readOnly:disabled
    },
  ];
  const fetchClientId = () => {
    const profile_data = JSON.parse(
      UserManagement.getItem("profile_data") || "{}"
    );
    const visible = profile_data?.client === 1;
    setVisible(visible);
  };

 
  const createOrUpdateData = async (addanother, values) => {
    const formData = new FormData();
    let data = values;
    // let data = stringtoNull(data);
    if (typeof(data.cutter_dwg_file)!= 'object' || data.cutter_dwg_file==null ) {
      data = { ...data, cutter_dwg_file: "" };
    }
    for (const key in data) {
        formData.append(key,data[key]);
    }
    try {
      const endpoint = isEditing ? `/cutter/${id}/` : "/cutter/";
      const response = isEditing
        ? await put(endpoint, formData)
        : await post(endpoint, formData);
      const message = isEditing ? t("Update") : t("Success");
      notifications.show({
        title: message,
        message: t(response),
        color: "green",
      });
      form.reset();
      addanother ? null : router.push("/cutter");
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
    if (form.isValid()) {
      createOrUpdateData(addanother, form.values);
    } else {
      notifications.show({
        title: t("Error"),
        message: t("Please fill the mandatory feilds."),
        color: "red",
      });
      setIsSubmitting(false);
    }
  };
  return (
    <Layout
      breadcrumbs={[
        { label: t("Cutter"), link: "/cutter" },
        {
          label: isEditing ? t("editCutter") : t("addCutter"),
          link: "/cutter/addcutter",
        },
      ]}
    >
      <Box>
        {visible == 1 ?
        <Title order={3}>{isEditing ? t("editCutter") : t("addCutter")}</Title>:
        <Title order={3}> {t("View Cutter")}</Title>}
        <form>
          <div className="container">
            {fields.map((field) => {
              const {  ...props } = field;

              if (props.name === "helix_degree") {
                return (
                  <Grid key={props.name}>
                    <Grid.Col span={4}>
                      {" "}
                      <TextInput
                        label={props.label}
                        readOnly={disabled}
                        {...props}
                        {...form.getInputProps("helix_degree")}
                      />
                    </Grid.Col>
                    <Grid.Col span={4} mt="xl">
                      {" "}
                      <TextInput
                        style={{ color: "white" }}
                        readOnly={disabled}
                        {...form.getInputProps("helix_min")}
                      />
                    </Grid.Col>
                    <Grid.Col span={4} mt="xl">
                      {" "}
                      <TextInput
                        color="white"
                        readOnly={disabled}
                        {...form.getInputProps("helix_sec")}
                      />
                    </Grid.Col>
                  </Grid>
                );
              }
              if (props.type === "file") {
                return (
               <ImageFile key={props.name} name={props.name} form={form} isEditing={isEditing}  {...props}/>)
             }


              return <FormInput {...props} form={form} key={props.name} />;
            })}
          </div>
          {visible == 1 && (
          <SubmitButtons isEditing={isEditing} onSubmit={onSubmit} isSubmitting={isSubmitting}/>)}
        </form>
      </Box>
    </Layout>
  );
};
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

export default ProtectedRoute(AddCutter);
