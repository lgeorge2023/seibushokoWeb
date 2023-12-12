import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { UserManagement } from "@/utils/UserManagement";
import {  Flex, Group, Paper, Text, Title } from "@mantine/core";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from "react";

function UserProfile() {
    const { t } = useTranslation('common');
    const [userName, setUsername] = useState('');
    const [clientName, setClientName] =useState('');
    const [email,setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [roleName, setRoleName] = useState('')
    const breadcrumbs = [{ label: t('View Profile'), link: '/user_profile' },];
    useEffect(() => {
      const profileData = UserManagement.getItem('profile_data');
      if (profileData) {
          const data = JSON.parse(profileData);
          const username = data.username;
          const emailU = data.email;
          const name = data.first_name + " " + data.last_name;
          const client = data.client_name;
          const role = data.role_name;
          setUsername(username);
          setFullName(name);
          setClientName(client);
          setEmail(emailU);
          setRoleName(role);
      }
  }, []);
  return (
    <Layout breadcrumbs={breadcrumbs}>
        <Title ml='md' order={3}>{t('Profile')}</Title>
        <Paper p="md"  radius="md" mt='sm' shadow="sm" style={{background:'#EEEEEE'}}>
            <Group >
                    <Flex>
                        <Flex direction='column' justify='space-around'>
                        <Text  size="md" p='lg'>{t('User.User Name')}</Text>
                        <Text  size="md"p='lg'>{t('User.Full Name')}</Text>
                        <Text  size="md"p='lg'>{t('User.Role')}</Text>
                        <Text  size="md"p='lg'>{t('User.Email')}</Text>
                        <Text  size="md"p='lg'>{t('User.Client/Segment')}</Text>
                        </Flex>
                        <Flex ml='md' direction='column' >
                        <Text  size="md"p='lg'>: {userName}</Text>
                        <Text  size="md"p='lg'>: {fullName}</Text>
                        <Text  size="md"p='lg'>: {roleName}</Text>
                        <Text  size="md"p='lg'>: {email}</Text>
                        <Text  size="md"p='lg'>: {clientName}</Text>
                        </Flex>
                    </Flex>
            </Group>

        </Paper>
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
  export default ProtectedRoute(UserProfile);