import Layout from "@/components/layout/Layout";
import { Title,  } from "@mantine/core";
import { useForm } from "@mantine/form";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getFormattedDate } from "@/utils/dateUtils";
import { notifications } from "@mantine/notifications";
import { get, post, put } from "@/pages/api/apiUtils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { stringtoNull } from "@/utils/stringtoNull";
import { removeNulls } from "@/utils/removeNulls";
import { UserManagement } from "@/utils/UserManagement";
import FormPart1 from "@/components/fields/workorder/form_part1";
import FormPart2 from "@/components/fields/workorder/form_part2";
import FormPart3 from "@/components/fields/workorder/form_part3";
import FormPart4 from "@/components/fields/workorder/form_part4";
import SubmitButtons from "@/components/SubmitButtons";
import ProtectedRoute from "@/utils/ProtectedRoute";

const registerBy = UserManagement.getItem("id");
const userId = parseInt(registerBy);

const AddWorkOrder = () => {
  const initialDate = getFormattedDate();
  const router = useRouter();
  const [workorder, setWorkorderValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const { slug } = router.query;
  const order_id = slug && slug[0] !== ("edit" || "new");
  const isEditing = slug && slug[0] === "edit";
  const id = slug && slug[1]; // Extract the id from the slug array
  const { t } = useTranslation("common");
  const form = useForm({
    initialValues: {
      regrind_work_order: {
        regrind_date: initialDate,
        technician: "",
        pregrind_teeth_no: "",
        target: "",
        postgrind_teeth_no: "",
        outdia_pregrind: "",
        outdia_target: "",
        outdia_actual: "",
        sap: "",
        p2: "",
        p3: "",
        p4: "",
        p5: "",
        sap_p2: "",
        p2_p3: "",
        p3_p4: "",
        p4_p5: "",
        crn_sap_p2: "",
        crn_p2_p3: "",
        crn_p3_p4: "",
        crn_p4_p5: "",
        leadtap_r: "",
        leadtap_l: "",
        crn: "",
        // customer: "",
        date_request: initialDate,
        no_teeth: "",
        test_date: initialDate,
        test_technician: "",
        axis_cross_angle: "",
        degree: "",
        minute: "",
        second: "",
        relational_speed: "",
        no_finished: "",
        puranji_speed1: "",
        puranji_speed2: "",
        stroke_lateral_feed: "",
        stroke_t1: "",
        stroke_t2: "",
        stroke_t3: "",
        bm_amount: "",
        cut_amount: "",
        notch_amount: "",
        matagi: "",
        no_bear_teeth: "",
        obd: "",
        obd_dia: "",
        diagonal_angle: "",
        sparkout: "",
      },
      work_order_no: "",
      regrind_from: "WORKORDER",
      workorder_date: initialDate,
      test: "TRIAL",
      geardrawing_no: "",
      arbor: "",
      delivery_date: initialDate,
      regrind_type: "",
      noofworkpiece: "",
      module: "",
      workorder_status: "PENDING",
      regrind_count: "",
      product_no: "",
      location: "",
      numberof_processes: "",
      urgency: "USUALLY",
      soonEOL: "FALSE",
      requester: "",
      order_no: "",
      cutter_no: "",
      mfg_no: "",
      client_id: "",
      created_by: userId,
    },
    validate: {
      order_no: (value) => value == 0 && "Order no is required",
      cutter_no: (value) => value == 0 && "Cutter no is required",
      mfg_no: (value) => value == 0 && "MFG no is required",
      client_id: (value) => value == 0 && "Client is required",
      work_order_no: (value) => value.length == 0 && "Workorder no is required",
      workorder_status: (value) =>value.length == 0 && "Workorder status is required",
    },
  });
  const workOrderNo = async () => {
    let data = await get(`workorder/new`);
    let Workorder = data?.new_workorder_no.split("-");
    form.setValues({
      "work_order_no": data?.new_workorder_no,
      "workorder_no": Workorder[0],
      "workorder_mcode": Workorder[1]
    });    setWorkorderValue(data?.new_workorder_no);
  };
  const fetchData = async () => {
    try {
      const data = await get(`workorder/${id}`);
      const nulltostring = removeNulls(data);
      const workorderno=data?.workorder_no+"-"+data?.workorder_mcode;
      form.setValues(nulltostring);
      form.setValues({ "work_order_no": workorderno });
    } catch (error) {
    }
  };
  const autofilWorkOrder = (id) => {
    let Orderdata = get(`/order/${id}/workorder`);
    Orderdata.then(
      (data) => {
        removeNulls(data);
        form.setValues({
          order_no: parseInt(id),
          client_id: data.client_id,
          cutter_no: data.cutter_no,
          geardrawing_no: data.drawing_no,
          mfg_no: data.mfg_no,
          module: data.module,
          product_no: data.product,
          regrind_count: data.regrind_count,
          regrind_type: data.regrind_type,
        });
      },
      (error) => {
      }
    );
    form.setValues({});
  };
  useEffect(() => {
    if (isEditing && id) {
      fetchData();
    }
    if (!isEditing) {
      workOrderNo();
    }
    fetchClientId();
  }, []);

  const fetchClientId = () => {
    const profile_data = JSON.parse(
      UserManagement.getItem("profile_data") || "{}"
    );
    const visible = profile_data?.client === 1;
    setVisible(visible);
  };
  useEffect(() => {
    if (order_id && slug[0] != "new") autofilWorkOrder(slug[0]);
  }, []);
  const createOrUpdateData = async (addanother, values) => {
    const newdata = {...values};
    let data = stringtoNull(newdata);
    try {
      const endpoint = isEditing ? `/workorder/${id}` : "/workorder/all";
      const response = isEditing
        ? await put(endpoint, data)
        : await post(endpoint, data);
      const message = isEditing ? t("Update") : t("Success");
      notifications.show({
        title: message,
        message: t(response),
        color: "green",
      });
      form.reset();
      addanother ? form.setValues({ work_order_no: workorder, created_by:userId}) : router.push("/work_order");
   
    } catch (error) {
      notifications.show({
        title: t("Error"),
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
  const breadcrumbs = [
    { label: t("Work_Order_Regrind"), link: "/work_order" },
    { label: isEditing ? visible == 1? t("edit_workorder"):t("View Work order") : t("add_workorder"), link: "" },
  ];
  return (
    <Layout breadcrumbs={breadcrumbs}>
      {visible == 1 ? (
        <Title order={3}>
          {isEditing ? t("edit_workorder") : t("add_workorder")}
        </Title>
      ) : (
        <Title order={3}>Work Order</Title>
      )}
      <FormPart1 form={form} isEditing={isEditing} />
      <FormPart2 form={form} />
      <FormPart3 form={form} />
      <FormPart4 form={form} />
      {visible == 1 &&
          <SubmitButtons isEditing={isEditing} onSubmit={onSubmit} isSubmitting={isSubmitting}/>}
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
export default ProtectedRoute(AddWorkOrder);