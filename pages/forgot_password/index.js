import { Paper, Title, Text, TextInput, Button, Container, Group, Anchor, Center, Box, rem } from '@mantine/core';
import { useStyles } from '../../styles/forgot_pwd_style';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { post } from '../api/apiUtils';
import { notifications } from '@mantine/notifications';
import { useForm } from "@mantine/form";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

  
function ForgotPassword() {
    const { classes } = useStyles();
    const { t } = useTranslation('common')


    const form = useForm({
      initialValues:{
        email:"",
      },
      validate:{
        email: (value) => value?(/^\S+@\S+$/.test(value) ? null : "Invalid email"):"Email is required",
      }
    })

    const onSubmit = (e) =>{
      e.preventDefault();
      form.validate();
      if(!form.validate().hasErrors){
        updateEmail();
      }
    };

    const updateEmail = async () =>{
      try{
        const userEmail = form.values
        const endpoint = `/auth/request_reset_email/`
        const response = await post(endpoint, userEmail);

        notifications.show({
          title:t('Success'),
          message: t(response.trim()),
          color:'green'
        })
        form.reset();
      }catch(error){
        notifications.show({
          title: t('Error'),
          message: t(error?.trim()),
          color:'red',
        });
      }
    };
  
    return (
      <Container size={460} my={30}>
        <Title className={classes.title} align="center">
          {t('Forgot your password?')}
        </Title>
        <Text c="dimmed" fz="sm" ta="center">
          Enter your email to get a reset link
        </Text>
  
        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          <form onSubmit={onSubmit}>
              <TextInput
                label="Your email"
                placeholder="user@outlook.com"
                name="email"
                required
                {...form.getInputProps("email")} />
              <Group position="apart" mt="lg" className={classes.controls}>
                  <Center inline>
                    <IconArrowLeft size={rem(12)} stroke={1.5} />
                    <Box ml={5}>
                      <Link href='/login'>
                        <Anchor component="button" size="sm" color='dimmed'>Back to the login page</Anchor>
                      </Link>
                      </Box>
                  </Center>
                <Button type='submit' className={classes.control} >Reset password</Button>
              </Group>
          </form>    
        </Paper>
      </Container>
    );
  }
  export const getStaticProps = async ({
    locale,
  }) => ({
    props: {
      ...(await serverSideTranslations(locale ?? 'en', [
        'common'
      ])),
    },
  })
  export default ForgotPassword;