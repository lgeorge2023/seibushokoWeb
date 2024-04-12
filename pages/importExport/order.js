import { Box, Button, FileInput, Flex, Grid, Paper, Title } from "@mantine/core";
import {  post, } from '@/pages/api/apiUtils';
import { useForm } from "@mantine/form";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { notifications } from "@mantine/notifications";
import { useTranslation } from 'next-i18next'
import { IconUpload } from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { handleApiError } from "@/utils/handleApiError";

const ImportOrder = () => {
  const { t } = useTranslation('common');
  const router =useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    initialValues: {
      file: [],
    },
    validate: {
      file: (value) => {
        if(value==null ||value.length === 0){
          return t("File is required")
        }
        const fileExtension = value.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'csv') {
          return t("Invalid file format. Only csv files are allowed.");
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
    let response=await post('/importexport/importorder',formData)

    notifications.show({
      title: t('Success'),
      message:(
        <>
          {t(response[0].mesage)}:{response[0].success_count}
          <br />
          {t('failed_rows_all')}: {t(response[0].failed_rows_all)}
        </>
      ),
      color:'green',
    });
    form.reset();
      }
      catch(error){
        handleApiError(error, router, t);}
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
      <Paper p="md" radius="md" shadow="sm">
        <Box>
          <Flex justify='space-between'>
            <Title order={3}>{t("Importorder")}</Title>
            <Button variant="outline" color="teal" radius="xl" size="xs" onClick={()=>downloadTemplate('Order_Template.csv')}>{t('Download Template')}</Button>
          </Flex>
            <Grid>
              <Grid.Col span={6}>  <FileInput  accept=".csv"icon={<IconUpload size="0.4cm" />} clearable placeholder={t("uploadFile")} mt="md" label={t("uploadFile")} {...form.getInputProps('file')}/></Grid.Col>
          </Grid>
          <Button style={{marginTop:"10px"}} onClick={(e)=>{onSubmit(e)}} loading={isSubmitting}>{t("Submit")}</Button>
        </Box>
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

export default ImportOrder;
