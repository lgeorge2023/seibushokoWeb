import Layout from "@/components/layout/Layout";
import {Box,TextInput, Title, Select,Checkbox, PasswordInput} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from "next/router";
import { get, post, put } from "@/pages/api/apiUtils";
import { notifications } from "@mantine/notifications";
import  { useState ,useEffect } from 'react';
import { fetchAndTransformClientData,fetchAndTransformRoleData } from '@/pages/api/Select';
import SubmitButtons from "@/components/SubmitButtons";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { handleApiError } from "@/utils/handleApiError";

const AddUser = () => {
  const [clients, setClient] = useState([]);
  const [roles, setRole] = useState([]);
  const { t } = useTranslation('common');
  const router = useRouter();
  const {slug} = router.query;
  const isEditing = slug?.[0] === 'edit';
  const user_id =slug?.[1];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const breadcrumbs = [
    { label:  t('User Management'), link: '/user' },
    { label:isEditing ?t('edit_newuser'):t('add_newuser'), link: '/user/add_user'},
  ];  

  const form = useForm({
    initialValues: {
      username:"",
      password:"",
      first_name: "",
      last_name: "",
      email: "",
      roles:"",
      client_id: 0,
      email_cc: "",
      active:"",
    },
    validate: {
      username:(value)=>value.length==0?t("Username is required"):null,
      first_name:(value)=>{
        if(value.length == 0){
          return t('First Name is required')
        }
      },
      password:(value)=>value.length==0 && !isEditing?t("Password is required"):null,
      email: (value) => value?(/^\S+@\S+$/.test(value) ? null : t("Invalid email")):t("Email is required"),
      email_cc: (value) => value?(/^\S+@\S+$/.test(value) ? null : t("Invalid email")):null,
      roles:(value)=>value.length==0?t("Please select a role"):null,
      client_id:(value)=>value==0?t("Please select a client"):null,
    },
  });

  const fetchData  = async () => {
    try {
      const data = await get(`staff/${user_id}/`);
      form.setValues({
        ...data,
        roles:data.role[0],
        client_id:data.client
      })
    } catch (error) {
    }
  };
  const dropdownClient = () =>{
    const data = fetchAndTransformClientData();
    data.then((clientData) => {
      setClient(clientData) 
    });
  }
  const dropdownRole =()=>{
    const data = fetchAndTransformRoleData();
    data.then((roleData)=>{
      setRole(roleData)
    })
  }

  useEffect(() => {
    dropdownClient();
    dropdownRole();
  }, []);
  useEffect(() => {
    if (isEditing && user_id) {
      fetchData();
    }
  }, [isEditing,user_id]);

  const createOrUpdateData = async (addanother) =>{
    try{ 
      const data = form.values;
      const {password,id,client,role,...putData} = {...data,roles:[data.roles]};
      const encodedPassword = btoa(data.password);
      const postData = {...data,roles:[data.roles]}
      postData.password = encodedPassword;
      const endpoint = isEditing ? `/staff/${user_id}/` : '/staff/';
      const response = isEditing ? await put(endpoint, putData) : await post(endpoint,postData);
      const message = isEditing ? t('Update') : t('Success');
      notifications.show({
        title: message,
        message: t(response),
        color:'green',
      });
    form.reset();
    addanother?null: router.push("/user");
    }catch(error){
      handleApiError(error, router, t);
    }
    finally {
      setIsSubmitting(false); // Reset the submission state
    }
  };

  const handleActiveChange = (event) => {
    const checked = event.target.checked;
    const value = checked ? 1 : 0;
    form.setFieldValue('active', value);
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
      setIsSubmitting(false);
    }
  };

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Box >
      <Title order={3}> {isEditing ?t('edit_newuser'):t('add_newuser')}</Title>
        <form onSubmit={onSubmit}>
          <div className='clientContainer'>
            <TextInput
              withAsterisk
              name="username"
              label={t('User.User Name')}
              {...form.getInputProps("username")}
            />
            {!isEditing ?<PasswordInput
            withAsterisk
              name="password"
              label={t('User.Password')}
              {...form.getInputProps("password")}
            />:null}
            <TextInput
              name="first_name"
              label={t('User.First Name')}
              {...form.getInputProps("first_name")}
              withAsterisk
            />
            <TextInput
              name="last_name"
              label={t('User.Last Name')}
              {...form.getInputProps("last_name")}
            />
            <TextInput
              name="email"
              label={t('User.Email')}
              {...form.getInputProps("email")}
              withAsterisk
            />
            <Select
              name="roles"
              label={t('User.Role')}
              placeholder="Pick one"
              data={roles}
              {...form.getInputProps("roles")}
              withAsterisk
            />
            <Select
              name="client_id"
              label={t('User.Client Id')}
              placeholder="Pick one"
              data={clients}
              {...form.getInputProps("client_id")}
              withAsterisk
            />
            <TextInput
              name="email_cc"
              label="Cc"
              placeholder=""
              {...form.getInputProps("email_cc")}
            />
            {isEditing ? <Checkbox
              label={t('User.Active')}
              checked={form.values.active === 1}
              onChange={handleActiveChange}
            />:null}  
          </div>
          <SubmitButtons isEditing={isEditing} onSubmit={onSubmit} isSubmitting={isSubmitting}/>
        </form>
      </Box>
    </Layout>
  );
};
export const getStaticPaths = async () => {

  return {
      paths: [],
      fallback: 'blocking'
  }
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

export default ProtectedRoute(AddUser);
