import Layout from "@/components/layout/Layout"
import { Button, Container, Group, Paper, PasswordInput, Title } from "@mantine/core";
import { useStyles } from '../../styles/changepswd_style';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useForm } from "@mantine/form";
import { put } from "../api/apiUtils";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";

export default function Index() {
    const { t } = useTranslation('common');
    const { classes } = useStyles();
    const router = useRouter();

    const breadcrumbs = [
        { label: t('Change Password'), link: '/change_password' },
      ];

    const form = useForm({
        initialValues:{
            currentPassword:'',
            newPassword:'',
            confirmPassword:'',
        },
        validate:{
            newPassword:(value) => {
                if (!value) {
                  return 'Password is required';
                }
                if (value.length < 8) {
                  return 'Your password must contain at least 8 characters';
                }
                if (!/[!@#$%^&*]/.test(value)) {
                  return 'Your password should have a special symbol';
                }
                return null;
              },
              confirmPassword:(value, values)=>{
                if (value !== values.newPassword) {
                  return 'Passwords do not match';
                }
                return null;
              }
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        form.validate();
        if (!form.validate().hasErrors) {
          updatePassword();
        }
  
      };

    const updatePassword = async() => {
        const encodedNewPassword = btoa(form.values.confirmPassword);
        const encodedCurrentPassword = btoa(form.values.currentPassword);
        const result = {
            old_password: encodedCurrentPassword,
            new_password: encodedNewPassword
        }
        try{
            const endpoint = `/auth/change_password/`
            const response = await put(endpoint,result);
            notifications.show({
                title:t('Success'),
                message: t(response.message),
                color:'green'
            })
            router.push('/client_dashboard')
            form.reset()
        } catch(error){
            notifications.show({
                title: t('Error'),
                message:t(error?.trim()),
                color:'red',
            })
        }

    }


  return (
    <Layout breadcrumbs={breadcrumbs}>
        <Container size={460} my={30}>
        <Title className={classes.title} align="center">
          {t('Change your password!')}
        </Title>
  
        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form onSubmit={handleSubmit}>
        <PasswordInput
           label={t('Current Password')} 
           required
           name='currentPassword'
           {...form.getInputProps("currentPassword")}
          />
          <PasswordInput
           label={t("New Password")} 
           required
           name='newPassword'
           {...form.getInputProps("newPassword")}
          />
          <PasswordInput
            label={t("Confirm Password")}
            required
            name='confirmPassword'
            {...form.getInputProps("confirmPassword")}
          />
          <Group position="right" mt="lg" className={classes.controls}>
            <Button type='submit' className={classes.control}>{t('Change Password')}</Button>
          </Group>
          </form>
        </Paper>
      </Container>
    </Layout>
  )
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