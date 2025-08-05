import Layout from "@/components/layout/Layout";
import { Title, Flex, Group, Text, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getFormattedDate } from "@/utils/dateUtils";
import { notifications } from "@mantine/notifications";
import { get, post, put } from "@/pages/api/apiUtils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { UserManagement } from "@/utils/UserManagement";
import { removeNulls } from "@/utils/removeNulls";
import Formpart1 from "@/components/fields/inspection_rpt/formpart1";
import FormPart2 from "@/components/fields/inspection_rpt/formpart2";
import FormPart3 from "@/components/fields/inspection_rpt/formpart3";
import FormPart4 from "@/components/fields/inspection_rpt/formpart4";
import FormPart5 from "@/components/fields/inspection_rpt/formpart5";
import FormPart6 from "@/components/fields/inspection_rpt/formpart6";
import FormPart7 from "@/components/fields/inspection_rpt/formpart7";
import SubmitButtons from "@/components/SubmitButtons";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { handleApiError } from "@/utils/handleApiError";
import {
  fetchAndTransformRegrindData,
  fetchAndTransformWorkNo,
} from "@/pages/api/Select";
import { autofilInspectionReport } from "@/components/fields/inspection_rpt/workordermodal";
import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconTrash, IconUpload, IconX } from "@tabler/icons-react";

const registerBy = UserManagement.getItem("id");
const userid = parseInt(registerBy);
const AddInspectionReport = () => {
  const initialDate = getFormattedDate();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { slug } = router.query;
  const report_id = slug && slug[0] !== ("edit" || "new");
  const isEditing = slug && slug[0] === "edit";
  const id = slug && slug[1]; // Extract the id from the slug array
  const { t } = useTranslation("common");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regrinddata, setregrindData] = useState([]);
  const [cutterData, setCutterData] = useState([]);
  const [droppedData, setDroppedData] = useState([]);
  const [newFiles,setNewFiles] = useState([]);
  const [deletedFiles,setDeletedFiles] = useState([])

  const form = useForm({
    initialValues: {
      report_trial: {
        cc_angle_axial_cross: "",
        cc_diagonal_angle: "",
        cc_cutter_speed: "",
        cc_tranverse_feed1: "",
        cc_tranverse_feed2: "",
        cc_amount_cut: "",
        cc_no_of_cuts: "",
        cc_stroke: "",
        cc_straddle_thickness: "",
        cc_no_teeth: "",
        cc_obd: "",
        cc_obd_dia: "",
        cc_approach: "",
        pc_angle_axial_cross: "",
        pc_cutter_speed: "",
        pc_plunge_feed: "",
        pc_amount_cut: "",
        pc_t1: "",
        pc_t2: "",
        pc_t3: "",
        pc_bm_amount: "",
        pc_straddle_thickness: "",
        pc_no_teeth: "",
        pc_obd: "",
        pc_obd_dia: "",
        pc_approach: "",
      },
      serial_no: "",
      order_date: initialDate,
      gear_dwg_no: "",
      ts_module: "",
      ts_pressure_angle: "",
      ts_no_teeth: "",
      ts_helix_angle: "",
      ts_helix_direction: "LEFT",
      ts_material: "",
      tw_work_no: "",
      tw_disloc_coeff: "",
      tw_no_teeth: "",
      tw_helix_angle: "",
      tw_twist_direction: "LEFT",
      tw_material: "",
      specified_profile: "",
      trial: "TRIAL",
      tooth_profile_err: "",
      profile_err_img: "",
      total_helix_deviation: "",
      extraction_err_img: "",
      tooth_groove_runout: "",
      runout_img: "",
      pitch_err: "",
      pith_out_img: "",
      no_polishing_times: "",
      outside_dia: "",
      straddle_tooth_thick: "",
      no_straddle_tooth: "",
      overball_measure: "",
      overball_dia: "",
      axial_dist_life_span: "",
      sign_date: initialDate,
      test_date: initialDate,
      report_status: "NEW",
      created_at: initialDate,
      updated_at: initialDate,
      work_order: "",
      cutter_no: "",
      order_no: "",
      client: "",
      ts_shaving_method: "",
      person_charge: userid,
      ...(isEditing && { delete_image: [] }),
    },
    validate: {
      work_order: (value) => value == 0 && t("Work Order is required"),
    },
  });
  const breadcrumbs = [
    { label: t("inspectionReport"), link: "/inspection_report" },
    {
      label: isEditing
        ? t("edit_inspectionreport")
        : t("add__inspectionreport"),
      link: "",
    },
  ];

  // const autofillReport = (id) =>{
  //   let reportData = get(`/workorder/${id}`);
  //   reportData.then(
  //     (data) =>{
  //       removeNulls(data);
  //       form.setValues({"work_order":data.id,"client":data.client_id,"cutter_no":data.cutter_no ,
  //       "order_no":data.order_no,"serial_no":data.mfg_no, "gear_dwg_no":data.geardrawing_no,
  //       "ts_module":data.module,
  //       "ts_shaving_method":data.regrind_type,
  //       "trial":data.test,"no_polishing_times":data.regrind_count,
  //      "product_no":data.product,"regrind_count":data.regrind_count,
  //       "regrind_type":data.regrind_type})
  //     }
  //   )
  // }
  const fetchWorkNoData = async (cutter_no) => {
    if (!cutter_no || cutter_no === "" || cutter_no === "0") {
      setCutterData([]);
      return;
    }

    try {
      const data = await fetchAndTransformWorkNo(cutter_no);
      setCutterData(data);
    } catch (error) {
      console.error("Error fetching work no data:", error);
      setCutterData([]);
    }
  };
  useEffect(() => {
    if (
      form.values.cutter_no &&
      form.values.cutter_no !== "" &&
      form.values.cutter_no !== "0"
    ) {
      fetchWorkNoData(form.values.cutter_no);
    } else {
      setCutterData([]);
    }
  }, [form.values.cutter_no]);

  const fetchData = async () => {
    try {
      const api_data = await get(`report/${id}/`);
      const nulltostring = removeNulls(api_data);
      form.setValues(nulltostring);
      setDroppedData(nulltostring.report_files)
    } catch (error) {
      handleApiError(error, router, t);
    }
  };
  const fetchAllData = async () => {
    try {
      const [regindData] = await Promise.all([fetchAndTransformRegrindData()]);
      setregrindData(regindData);
    } catch (error) {}
  };
  useEffect(() => {
    fetchAllData();
  }, []);
  useEffect(() => {
    if (isEditing && id) {
      fetchData();
    }
  }, [id, isEditing]);
  useEffect(() => {
    if (report_id && slug[0] != "new") {
      //  autofillReport(slug[0])
      autofilInspectionReport(slug[0], form, );
    }
  }, []);
  const fetchClientId = () => {
    const profile_data = JSON.parse(
      UserManagement.getItem("profile_data") || "{}"
    );
    const visible = profile_data?.client === 1;
    setVisible(visible);
  };

  useEffect(() => {
    fetchClientId();
  }, []);

  const createOrUpdateData = async (addanother) => {
    try {
      let formData = new FormData();
      let data = form.values;

      if (
        typeof data.profile_err_img != "object" ||
        data.profile_err_img == null
      ) {
        data = { ...data, profile_err_img: "" };
      }
      if (
        typeof data.extraction_err_img != "object" ||
        data.extraction_err_img == null
      ) {
        data = { ...data, extraction_err_img: "" };
      }
      if (typeof data.pith_out_img != "object" || data.pith_out_img == null) {
        data = { ...data, pith_out_img: "" };
      }
      if (typeof data.runout_img != "object" || data.runout_img == null) {
        data = { ...data, runout_img: "" };
      }

      for (let key in data) {
        if (key == "report_trial") {
          for (let subKey in data[key]) {
            formData.append(
              `${key}.${subKey}`,
              data[key][subKey] != null ? data[key][subKey] : ""
            );
          }
        } else {
          formData.append(key, data[key] != null ? data[key] : "");
        }
      }
      if(!isEditing){
        formData.delete("delete_image")
      }
      const endpoint = isEditing ? `/report/${id}/` : "/report/";
      const response = isEditing
        ? await put(endpoint, formData)
        : await post(endpoint, formData);
        handleMultipleFileUpload(response.workorder_id)
      const message = isEditing ? t("Update") : t("Success");
      notifications.show({
        title: message,
        message: t(response.message),
        color: "green",
      });
      form.reset();
      addanother
        ? form.setFieldValue("person_charge", userid)
        : router.push("/inspection_report");
    } catch (error) {
      handleApiError(error, router, t);
    } finally {
      setIsSubmitting(false); // Reset the submission state
    }
  };

  const handleDeleteItem = (id, index) =>{
    const updateNewDroppedData = newFiles.filter((item, i) => (id !== undefined && id !== null) ? item.id !== id : i !== index);
    const updateDroppedData = droppedData.filter((item, i) => (id !== undefined && id !== null) ? item.id !== id : i !== index);
    setDroppedData(updateDroppedData);
    setNewFiles(updateNewDroppedData);

    if (id !== undefined && id !== null) {
      setDeletedFiles(prevDeletedFiles => [...prevDeletedFiles, id]);
    }
  }

  const handleMultipleFileUpload = async (id) => {
    if(newFiles.length > 0 || deletedFiles.length > 0){
      try {
        const formData = new FormData();
        if(isEditing){
          formData.append("workorder_id", id);
          formData.append("delete",deletedFiles)
          newFiles.length > 0 ?
          newFiles.forEach((file)=>{
            formData.append("report_files", file)
          }):
          formData.append("report_files",[])  
          
        }else{  
          formData.append("workorder_id", id);
          droppedData.forEach((file) => {
            formData.append("report_files", file);
        
          });
        }
        const endpoint = '/report/files/';
        const response = isEditing ? await put(endpoint, formData) : await post(endpoint, formData);
        const message = isEditing ? t('Update') : t('Success');
        notifications.show({
          title: message,
          message: t(response),
          color: "green",
        });
      } catch (error) {
        handleApiError(error, router, t);
      }
    }
}


  const onSubmit = (e, addanother) => {
    e.preventDefault();
    setIsSubmitting(true);
    form.validate();
    if (!form.validate().hasErrors) {
      createOrUpdateData(addanother);
    } else {
      notifications.show({
        title: t("Error"),
        message: t("Please fill the mandatory feilds."),
        color: "red",
      });
      setIsSubmitting(false);
    }
  };
  let resultLabel = "no";

  const result = regrinddata.find((entry) => {
    if (entry.value === form.values.ts_shaving_method) {
      if (entry.label.includes("Conventional")) {
        resultLabel = "Conventional";
        return true;
      } else if (entry.label.includes("Plunge")) {
        resultLabel = "PlungeCut";
        return true;
      } else {
        resultLabel = "Both";
        return true;
      }
    }
    return false;
  });

  return (
    <Layout breadcrumbs={breadcrumbs}>
      {visible == 1 ? 
        <Title order={3}>
          {isEditing ? t("edit_inspectionreport") : t("add__inspectionreport")}
      </Title>:
      <Title order={3}>
        { t("View Inspection Report")}
      </Title>}
      <Formpart1 form={form} isEditing={isEditing} locale={router.locale}/>
      <FormPart2 form={form} cutterData={cutterData} visible={visible} />
      <FormPart3 form={form} visible={visible}/>
      <FormPart4 form={form} visible={visible}/>
      <Flex>
        {(resultLabel === "Conventional" || resultLabel === "Both") && (
          <FormPart5 form={form} visible={visible}/>
        )}
        {(resultLabel === "PlungeCut" || resultLabel === "Both") && (
          <FormPart6 form={form} visible={visible}/>
        )}
      </Flex>
      <FormPart7 form={form} locale={router.locale}visible={visible}/>
      <Dropzone
        onDrop={(droppedFiles) => {
          setDroppedData((prevDroppedData) => [...prevDroppedData, ...droppedFiles]);
          setNewFiles((prevFiles) => [...prevFiles,...droppedFiles])
        }}
        accept={['image/png','	image/jpeg' ,'application/pdf','	text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']}
        mt="md"
      >
        <Group
          justify="center"
          gap="md"
          mih={80}
          style={{ pointerEvents: "none", }}
          ml={160}
        >
          <Dropzone.Idle>
            <IconPhoto
              style={{
                width: "52px",
                height: "52px",
                color: "var(--mantine-color-dimmed)",
              }}
              stroke={1.5}
            />
          </Dropzone.Idle>
          <Box>
            <Text size="xl" inline>
              {t("Upload Inspection Report Files")}
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
             {t("Attach as many files as you like, each file should not exceed 5mb")}
            </Text>
          </Box>
        </Group>
      </Dropzone>
      <Box ml={185}>
        <Text color="green" mt="sm" ml="sm">
          {droppedData.map((item,index) => (
            <ul key={index}>
              <li><a href={item.file_path} style={{color:"#40c057",textDecoration:"none"}} target="_blank">{item.name}</a>

                <IconTrash color="red" size={17} onClick={()=>handleDeleteItem(item.id,index)}/>
              </li>
            </ul>
          ))}
        </Text>
      </Box>

      {visible == 1 && (
        <SubmitButtons
          isEditing={isEditing}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      )}
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
export default ProtectedRoute(AddInspectionReport);