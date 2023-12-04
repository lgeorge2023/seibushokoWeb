import React, { useEffect, useState } from "react";
import {
  Box,
  NumberInput,
  Select,
  SimpleGrid,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { FieldsArray } from "./fields_form1";
import DatePicker from "@/components/DatePicker";
import OrderDataTable from "@/components/OrderListModal";
import styles from "./add_workorder.module.css";
import { UserManagement } from "@/utils/UserManagement";
import { get } from "@/pages/api/apiUtils";
export default function FormPart1(props) {
  const [showOrderModal, setOrderShowModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [requesterData,setRequesterdata]=useState([])
  const {form,isEditing} = props;
  const fields = FieldsArray();
  const profile_data = JSON.parse(
    UserManagement.getItem("profile_data") || "{}"
  );
  let client= form.values.client_id;
  useEffect(() => {
    const client_id = profile_data?.client === 1;
    setVisible(client_id);
  }, []);
  useEffect(() => {
    if(client){
    handleRequester(client);
    }
  }, [client]);
  const handleRequester = async (e,orderChange) => {
    form.setFieldValue('client_id', e);
      try {
      const requesterlist = await get(`/staff/client/${e}`);
      const transformedRequestorData = requesterlist.map((item) => ({
        value: item.id,
        label: item.user_full_name,
        disabled: item.disabled,
      }));
      setRequesterdata(transformedRequestorData);
      const firstNonDisabled = transformedRequestorData.find((item) => !item.disabled);
      if (firstNonDisabled && (!isEditing|| orderChange)) {
        form.setFieldValue("requester", firstNonDisabled.value);
      } 
      } catch (error) {
      console.error(error);
    }
  };
  return (
    <SimpleGrid cols={3}>
      <OrderDataTable
        form={form}
        setOrderShowModal={setOrderShowModal}
        showOrderModal={showOrderModal}
        handleRequester={handleRequester}

      />
      {fields.map((field, i) => {
        const { name, type, ...props } = field;
        if (type === "requesterselect") {
          return (
            <div   key={i}>
            <Select
              {...form.getInputProps(name)}
              {...props}
              data={requesterData}
            /></div> 
          );
        }
        if (type === "select") {
          return (
            <Select
              key={i}
              placeholder={props.disabled?null:"Pick one"}
              value={form.values[field.name]}
              {...form.getInputProps(name)}
              {...props}
            />
          );
        }
        if (type === "label") {
          return (
            <div key={i}>
              <TextInput {...props} />
            </div>
          );
        }

        if (type === "date") {
          return (
            <div key={i}>
              <DatePicker name={name} form={form} {...props} id={name + i} />
            </div>
          );
        }
        if (type === "number") {
          return (
            <div key={i}>
              <NumberInput
                min={0}
                {...props}
                removeTrailingZeros
                {...form.getInputProps(name)}
              />
            </div>
          );
        }

        if (name == "order_no") {
          return (
            <Box key={i}>
              <Select
                {...form.getInputProps(name)}
                {...props}
                onClick={() => setOrderShowModal(true)}
              />
              {visible == 1 &&
                name == "order_no" &&
                (!isEditing ||
                  (isEditing && form.values.workorder_status == "PENDING")) && (
                  <UnstyledButton
                    onClick={() => setOrderShowModal(true)}
                    className={styles.selectbutton}
                  >
                    select
                  </UnstyledButton>
                )}
            </Box>
          );
        }
        // Default to TextInput for other types
        return <TextInput key={i} {...form.getInputProps(name)} {...props} />;
      })}
    </SimpleGrid>
  );
}
