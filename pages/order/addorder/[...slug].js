import {
  Grid,
  Box,
  Button,
  TextInput,
  Select,
  Textarea,
  Title,
  NumberInput,
  Paper,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useEffect, useState } from "react";
import { CircleMinus, CirclePlus } from "tabler-icons-react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "@/components/layout/Layout";
import DatePicker from "@/components/DatePicker";
import {
  fetchAndTransformClientData, fetchAndTransformStaffData,fetchAndTransformCutterData
} from "@/pages/api/Select";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { get, post, put } from "@/pages/api/apiUtils";
import { getFormattedDate } from "@/utils/dateUtils";
import { UserManagement } from "@/utils/UserManagement";
import SubmitButtons from "@/components/SubmitButtons";


const AddOrder = () => {
  const initialDate = getFormattedDate();
  const router = useRouter();
  const { slug } = router.query;
  const isEditing = slug && slug[0] === "edit";
  const id = slug && slug[1]; // Extract the id from the slug array
  const registerBy = UserManagement.getItem("id");
  const userId = parseInt(registerBy);
  const profile_data = JSON.parse(UserManagement.getItem("profile_data"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [client, setClient] = useState([]);
  const [cutter, setCutter] = useState([]);
  const [managerData,setManagerData]=useState([]);
  const [numForms, setNumForms] = useState(1);
  const [visible,setVisible]=useState(0);
 
  const form = useForm({
    initialValues: {
      order_no: "",
      placed_by: userId,
      order_date: initialDate,
      client: 0,
    
      order_lines: [
        {
          order_line: 1,
          product: "",
          drawing_no: "",
          order_detail: "",
          remarks: "",
          cutter_no: 0,
          mfg_no: 0,
        },
      ],
    },
    validate: {
      order_no: (value) => {
        if(!value){
          return 'Order No is required'
        }
        if(!/^\d+$/.test(value)){
          return 'Order No must contain only numbers'
        }
      },
      client: (value) => value === 0 && `Client is required`,
      order_lines: {
        mfg_no: (value) => value === 0 && `MFG No is required for order line`,
        cutter_no: (value) => value === 0 && `Cutter No is required`,
      },
    },
  });
  const handleChange =  useCallback(async (value, index) => {
    form.setFieldValue(`order_lines.${index}.cutter_no`, value);
    form.setFieldValue(`order_lines.${index}.mfg_no`, 0);
    let client_id=form.values.client;
    const data = await get(`/mfg/select/${client_id}/${value}`);
    setMFGData((prevMfgData) => {
      const updatedMfgData = [...prevMfgData];
      updatedMfgData[index] = data.map((item) => ({
        value: item.id,
        label: item.mfg_no,
        disabled:item.disabled
      }));
      return updatedMfgData;
    });
  }, [form]);
  const fetchData  =async () => {
    try {
      const data = await get(`order/${id}/`);
      data.delete_order_lines = [];
      form.setValues(data);
      let formsCount = data.order_lines.length;
      setNumForms(formsCount);
      for (let i = 0; i < formsCount; i++) {
        const cutterValue = data?.order_lines[i].cutter_no;
        const mfgValue = data?.order_lines[i].mfg_no;
        handleChange(cutterValue, i); // Update mfgData based on the cutter
        form.setFieldValue(`order_lines.${i}.mfg_no`, mfgValue);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [mfgData, setMFGData] = useState(Array.from({ length: numForms }, () => []));

  const { t } = useTranslation("common");

  const removeForm = (index,id) => {
    setNumForms((prevNumForms) => prevNumForms - 1);
    const list = [...form.values.order_lines];
    list.splice(index, 1);
    form.setFieldValue(
      "order_lines",
      list.map((item, i) => ({ ...item, order_line: i + 1}))
    );
    id?
    form.setFieldValue("delete_order_lines", [...form.values.delete_order_lines, id]):null;
  };

  const addMoreForm = () => {
    setNumForms((prevNumForms) => prevNumForms + 1);
    setMFGData((prevMfgData) => [...prevMfgData, []]);
   
  const newOrderLine = {
    order_line: form.values.order_lines.length + 1,
    product: "",
    drawing_no: "",
    order_detail: "",
    remarks: "",
    cutter_no: 0,
    mfg_no: 0,
    order_status:"NEW"
  };

  if (isEditing) {
    newOrderLine.id = 0; // Include the id value
  }

  form.setFieldValue("order_lines", [
    ...form.values.order_lines,
    newOrderLine,
  ]);
  };
  const fetchAllData = async () => {
    try {
      const [clientData, cutterData, managerData] = await Promise.all([
        fetchAndTransformClientData(),
        fetchAndTransformCutterData(),
        fetchAndTransformStaffData()
      ]);

      setClient(clientData);
      setCutter(cutterData);
      setManagerData(managerData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAllData();
    let clientid=profile_data?.client
   setVisible(clientid)
  }, [profile_data?.client]);
  useEffect(() => {
    if (isEditing && id) {
      fetchData();
    }
  }, [isEditing,id])
  const createOrUpdateData = async (addanother) => {
    try {
      const data = form.values;
      const endpoint = isEditing ? `/order/${id}/` : "/order/undefined";
      const response = isEditing
        ? await put(endpoint, data)
        : await post(endpoint, data);
      const message = isEditing ? t('Update') : t('Success');
      notifications.show({
        title: message,
        message: t(response),
        color: "green",
      });
      form.reset();
      addanother?form.setFieldValue("placed_by",userId): router.push("/order");
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
      createOrUpdateData(addanother);
    } else {
      notifications.show({
        title: t('Error'),
        message: t('Please fill the mandatory feilds.'),
        color: 'red',
      });
      setIsSubmitting(false); // Reset the submission state
    }
  };
 
  
    const breadcrumbs = [
      { label: t('order'), link: "/order" },
      { label: isEditing ? visible == 1? t("editOrder"): t("vieworder") : t("addOrder"), link: "/order/addorder" },
    ];
  return (
    <Layout breadcrumbs={breadcrumbs}>
        <Box >
          { visible == 1?
          <Title order={1}>
            {isEditing ? t("editOrder") : t("addOrder")}
          </Title>
          :
          <Title order={1}>{t("Order")}</Title> }
        </Box>
    <Grid>
      <Grid.Col  md={6} lg={3}>        
        <TextInput
                  label={t('content.orderno')}
                  withAsterisk
                  placeholder=""
                  {...form.getInputProps(`order_no`)}
                />
              </Grid.Col>
              <Grid.Col  md={6} lg={3}>                   
                <Select
                  label={t('content.client')}
                  placeholder="Please Select"
                  data={client}
                  {...form.getInputProps(`client`)}
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col  md={6} lg={3}>                   
                <Select
                  label={t('content.registedBy')}
                  data={managerData}
                  disabled
                  {...form.getInputProps(`placed_by`)}
                />
              </Grid.Col>
              <Grid.Col  md={6} lg={3}>                   
                <DatePicker
                  label={t('content.orderDate')}
                  name={"order_date"}
                  form={form}
                />
              </Grid.Col>
            </Grid>
              {Array.from({ length: numForms }).map((_, index) => (
                <Paper withBorder p='sm' mt='sm' shadow="sm" key={index}>               
                <Grid key={index}>
                  <Grid.Col  md={6} lg={3}>                   
                    <NumberInput
                    min={0}
                      label={t('content.orderLine')}
                      placeholder=""
                      {...form.getInputProps(`order_lines.${index}.order_line`)}
                    />
                  </Grid.Col>
                  <Grid.Col  md={6} lg={3}>                   
                    <TextInput
                      label={t('content.Product')}
                      placeholder=""
                      {...form.getInputProps(`order_lines.${index}.product`)}
                    />
                  </Grid.Col>
                  <Grid.Col  md={6} lg={3}>                   
                    <TextInput
                      label={t('content.drawing')}
                      placeholder=""
                      {...form.getInputProps(`order_lines.${index}.drawing_no`)}
                    />
                  </Grid.Col>
                  <Grid.Col  md={6} lg={3}>                   
                    <Select
                      label={t('content.cutter')}
                      withAsterisk
                      placeholder="Please Select"
                      {...form.getInputProps(`order_lines.${index}.cutter_no`)}
                      onChange={(value) => {
                        handleChange(value,index)
                        
                      }}
                      data={cutter}
                    />
                  </Grid.Col>
                  <Grid.Col  md={6} lg={3}>                   
                    <Select
                      label={t('content.MFG')}
                      placeholder="Please Select"
                      data={mfgData[index]||[]}      
                       withAsterisk
                      {...form.getInputProps(`order_lines.${index}.mfg_no`)}
                    />
                  </Grid.Col>
                
                  <Grid.Col  md={6}  lg={6}>                   
                    <Textarea
                      placeholder="Comments"
                      label={t('content.orderDetails')}
                      {...form.getInputProps(
                        `order_lines.${index}.order_detail`
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col  md={6} lg={3}>                   
                    <Textarea
                      label={t('content.remark')}
                      placeholder=""
                      {...form.getInputProps(`order_lines.${index}.remarks`)}
                    />
                  </Grid.Col>
                  {(!isEditing &&index !== 0 || (isEditing && form.values.order_lines[index]?.order_status  == 'NEW'))&&(
                    visible == 1?
                      <Button
                        variant="subtle"
                        color="red"
                        mb='sm'
                        ml='sm'
                        leftIcon={<CircleMinus />}
                        onClick={() => {
                          const orderLine = form.values.order_lines[index];
                          if (orderLine && orderLine.id) {
                            removeForm(index, orderLine.id);
                          } else {
                            removeForm(index);
                          }
                        }}>
                       {t('content.remove')}
                      </Button>
                    :null
                  )}
                </Grid>
                  </Paper>
              ))}
              {visible == 1&&
                <Button
                  variant="subtle"
                  mt='sm'
                  color="teal"
                  leftIcon={<CirclePlus />}
                  onClick={addMoreForm}
                >
                  {t('content.addmore')}
                </Button>
              }
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

export default AddOrder;
