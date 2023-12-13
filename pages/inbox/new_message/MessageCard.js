import { Box, Button, FileInput, Flex, Group, Paper, Select, SimpleGrid, Stack, Text, TextInput, Textarea, Title } from "@mantine/core";
import {useStyles} from '../../../styles/newmsg_style'
import { IconCalendar, IconAt, IconUpload, } from '@tabler/icons-react';
import ViewMessageCard from "./ViewMessageCard";
import { useCallback, useEffect, useState } from "react";
import { fetchAndTransformClientData } from "@/pages/api/Select";
import { useForm } from "@mantine/form";
import { post } from "@/pages/api/apiUtils";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { format } from 'date-fns';
import { UserManagement } from "@/utils/UserManagement";
import { handleApiError } from "@/utils/handleApiError";
import { useRouter } from "next/router";

export default function MessageCard({value}) {
    const {classes} = useStyles();
    const [client, setClient] = useState([]);
    const [id, setId] = useState('');
    const [userName, setUserName] = useState('');
    const { t } = useTranslation("common");
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'dd/MM/yyyy');
    const router =useRouter();
    const form = useForm({
      initialValues:{
        msg_attach: '',
        msg_title: '',
        msg_content: '',
        msg_client:'',
      },
      validate:{
        msg_title:(value)=> value.length == 0 && t('Message Subject Required'),
        msg_client:(value)=>value == '' && t('To is Required'),
        msg_attach:(value) => value?.size > 2097152 && t('File size exceeds 2MB limit')
    }
    })
    const fetchClientData = useCallback(async () => {
      try {
        const [clientData] = await Promise.all([fetchAndTransformClientData()]);
        const updatedClientList = clientData.filter((client) => {
          return !(client.value == id);
        });
        setClient(updatedClientList);
      } catch (error) {
      }
    }, [id]);
    useEffect(()=>{
      fetchClientData();
      const id = JSON.parse(UserManagement.getItem("profile_data"));
      setId(id.client)
      const username = UserManagement.getItem("username");
      setUserName(username);
    },[fetchClientData])

    const sendMessage = async () =>{
      try{
        let formData = new FormData();
        let data = form.values;
        for(const name in data){
          formData.append(name,form.values[name])
        }
        const response = await post('/message/sent',formData)
        notifications.show({
          title:t("Success"),
          message:t(response),
          color:'green'
        })
        form.reset();
      }catch(error){
        handleApiError(error, router, t);
      }
    }

    const onSubmit = (e) =>{
      if(!form.validate().hasErrors){
        sendMessage();
      }
    }

  return (
    <Box>
      {value == 'new'?
      <Paper shadow="md" radius="lg">
<Box className={classes.wrapper}>
  <Box className={classes.contacts}>
    <Text fz="lg" fw={700} className={classes.title} c="#fff">
      {t('New Message')}
    </Text>
    <Stack>
      <Box>
          <Flex direction='row'>
              <Flex align='center'mr='lg'> <IconAt color='white'/> </Flex>
              <Flex direction='column'>
                  <Title order={6} color='white'>{t('To')}</Title>
                  {id == 1? 
                  <Select
                      placeholder="Pick one"
                      clearable='true'
                      data={client}
                      name="msg_client"
                      required
                      {...form.getInputProps('msg_client')}
                  />:
                  <Select
                  placeholder="Pick one"
                  clearable='true'
                  required
                  data={[
                    { value: 1, label: 'Seibushoko' },]}
                  name="msg_client"
                  {...form.getInputProps('msg_client')}
              />
                  }
              </Flex>
          </Flex>
      </Box>
      <Box>
          <Flex direction='row'>
              <Flex align='center'mr='lg'> <IconAt color='white'/> </Flex>
              <Flex direction='column'>
                  <Title order={6} color='white'>{t('From')}</Title>
                  <Text color='white'>{userName}</Text>
              </Flex>
          </Flex>
      </Box>
      <Box>
          <Flex direction='row'>
              <Flex align='center'mr='lg'> <IconCalendar color='white'/> </Flex>
              <Flex direction='column'>
                  <Title order={6} color='white'>{t('Date')}</Title>
                  <Text color='white'>{formattedDate}</Text>
              </Flex>
          </Flex>
      </Box>
    </Stack>

  </Box>

  <form className={classes.form} onSubmit={(event) => event.preventDefault()}>


    <Box className={classes.fields}>
      <SimpleGrid  breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
      <TextInput name="msg_title" mt="md" label={t("Subject")} placeholder="Subject" required {...form.getInputProps('msg_title')}/>
      </SimpleGrid>

      <FileInput 
        name="msg_attach" 
        clearable={true} icon={<IconUpload size="0.4cm"/>} 
        mt="md" 
        label={t('Attachment')}
        accept="image/png,image/jpeg,image/jpg"
        placeholder="Upload File" 
        {...form.getInputProps('msg_attach')}/>

      <Textarea
        mt="md"
        label={t("Your Message")}
        name="msg_content"
        placeholder="Please include all relevant information"
        minRows={3}
        {...form.getInputProps('msg_content')}
      />

      <Group position="right" mt="md">
        <Button 
        type="submit" 
        className={classes.control}
        onClick={(e)=>onSubmit(e)}>
          {t('Send Message')}
        </Button>
      </Group>
    </Box>
  </form>
</Box>
</Paper>
:
<ViewMessageCard value={value}/>
}
</Box>
  )
}
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});