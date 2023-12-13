import {  Button, FileInput, Flex, Grid, Paper, Title } from "@mantine/core";
import {  post, } from '@/pages/api/apiUtils';
import { useForm } from "@mantine/form";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { notifications } from "@mantine/notifications";
import { useTranslation } from 'next-i18next'
import { IconUpload } from "@tabler/icons-react";
import { useState } from "react";
import { handleApiError } from "@/utils/handleApiError";
import { useRouter } from "next/router";

const ImportWorkOrder = () => {
  const { t } = useTranslation('common');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router =useRouter(); 
  const form = useForm({
    initialValues: {
      file: [],
    },
    validate: {
      file: (value) => {
        if(value==null ||value.length === 0){
          return "File is required"
        }
        const fileExtension = value.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'csv') {
          return "Invalid file format. Only csv files are allowed.";
        }
      },
    },
  });

  const downloadTemplate= (fileName) =>{
    const link = document.createElement('a');
    link.href = `/Templates/${fileName}`;
    link.download = fileName;
    link.click();
  };

  const onSubmit=async()=>{
    setIsSubmitting(true);
    if (!form.validate().hasErrors) {
      let formData = new FormData();
      try{
      let data=form.values
      formData.append('file',data.file)
    let response=await post('/importexport/importworkorder',formData)
    notifications.show({
      title: t('Success'),
      message: response[0].success_count+" "+t(response[0].mesage),
      color:'green',
    });
    form.reset();
      }
      catch(error){
        handleApiError(error, router, t);
      }
      finally {
        setIsSubmitting(false); // Reset the submission state
      }
    }
    else {
      notifications.show({
        title: t("Error"),
        message: t("Please upload a file"),
        color: "red",
      });
      setIsSubmitting(false);
    }
  }
    return (
      <Paper p="md" radius="md" shadow="sm" mt='md'>
        <Flex justify='space-between'>
          <Title order={3}>{t("ImportWorkorder")}</Title>
          <Button variant="outline" color="teal" radius="xl" size="xs" onClick={()=>downloadTemplate('Workorder_Template.csv')}>{t('Download Template')}</Button>
        </Flex>
          <Grid>
            <Grid.Col span={6}>  <FileInput accept=".csv" icon={<IconUpload size="0.5cm" />} mt="md" clearable placeholder={t("uploadFile")} label={t("uploadFile")} {...form.getInputProps('file')}/></Grid.Col>
          </Grid>
        <Button style={{marginTop:"10px"}} loading={isSubmitting} onClick={(e)=>{onSubmit(e)}}>{t("Submit")}</Button>
      </Paper>
  );
};  
export const getStaticProps = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', [
      'common'
    ])),
  },
})

export default ImportWorkOrder;