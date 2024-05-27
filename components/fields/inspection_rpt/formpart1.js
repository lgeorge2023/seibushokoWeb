import { Box, Grid,Select,TextInput, UnstyledButton } from '@mantine/core';
import React, { useState } from 'react'
import styles from './inspection.module.css'
import { FieldsArray } from './fields1';
import DatePicker from '@/components/DatePicker';
import WorkOrderModal from './workordermodal';
import { useTranslation } from "next-i18next";

const Formpart1 = (props) => {

    const { t } = useTranslation("common");
    const fields=FieldsArray();
    const [showModal, setShowModal] = useState(false);
    const {form,isEditing,locale} =props;
  return (<Box>
    <WorkOrderModal  form={form} setShowModal={setShowModal} showModal={showModal} isEditing={isEditing} />
    <Grid >{fields.map((field) => {
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
                      {name == "work_order" &&!isEditing && (
                      <UnstyledButton
                        onClick={() => setShowModal(true)}
                        className={styles.selectbutton}
                      >
                        {t('Select')}
                      </UnstyledButton>
                    )}
                  </Grid.Col>
                );
              }
              if (type === "date") {
                return (
                  <Grid.Col md={6} lg={4}  key={name}>
                    <DatePicker key={name} name={name} form={form} locale={locale} {...props} />
                  </Grid.Col >
                );
              }

              return (
                <Grid.Col md={6} lg={4} key={name}  >
                  <TextInput
                    key={field.name}
                    {...form.getInputProps(name)}
                    {...props}
                  />
                </Grid.Col>
              );
            })}
          </Grid>
          </Box>
  )
}

export default Formpart1;