import React, {  useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { Box, Checkbox, TextInput, Title } from '@mantine/core';
import Layout from '@/components/layout/Layout';
import { get, post, put } from '@/pages/api/apiUtils';
import { useRouter } from 'next/router';
import { notifications } from '@mantine/notifications';
import ProtectedRoute from '@/utils/ProtectedRoute';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import SubmitButtons from '@/components/SubmitButtons';
import { handleApiError } from '@/utils/handleApiError';

function AddClient() {
  const { t } = useTranslation('common')
  const router = useRouter();
  const { slug } = router.query;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = slug?.[0] === 'edit';
  const id = slug?.[1]; // Extract the id from the slug array

  const breadcrumbs = [
    { label:  t('Client'), link: '/client' },
    { label:isEditing ?t('edit_client'):t('add_client'), link: '/client/addclient' },
  ];

  const form = useForm({
    initialValues: {
      segment_name: '',
      address: '',
      email: '',
      contact_phone_no: '',
      contact_person1: '',
      contact_person2: '',
      contact_person1_email: '',
      contact_person2_email: '',
      contact_person1_phone: '',
      contact_person2_phone: '',
      active: 1,
    },
    validate: {
      segment_name: (value) => value.length < 1 && t('Client is required'),
      email: (value) => (!value ? t('Email is required') : /^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      contact_phone_no: (value) => {
        if (!value) {
          return t('Phone Number is required');
        }
        return null;
      },
    },
  });

  const fields = [
    { name: 'segment_name', label: t('Client.Client'), required:true},
    { name: 'address', label: t('Client.Address') },
    { name: 'email', label: t('Client.General Email'),required :true},
    { name: 'contact_phone_no', label: t('Client.General Contact No'),required:true,},
    { name: 'contact_person1', label: t('Client.Person In Charge 1') ,hidden:!isEditing},
    { name: 'contact_person2', label: t('Client.Person In Charge 2'),hidden:!isEditing},
    { name: 'contact_person1_email', label: t('Client.Email'),hidden:!isEditing},
    { name: 'contact_person2_email', label: t('Client.Email'),hidden:!isEditing},
    { name: 'contact_person1_phone', label: t('Client.Phone No'),type:'number',hidden:!isEditing},
    { name: 'contact_person2_phone', label: t('Client.Phone No'),type:'number' ,hidden:!isEditing},
  ];

  const fetchData = async () => {
    try {
      const data = await get(`client/${id}/`);
      form.setValues(data);
    } catch(error) {
      handleApiError(error, router, t);
    }
  };
  useEffect(() => {
    if (isEditing && id) {
      fetchData();
    }
  }, [isEditing, id]);

  const createOrUpdateData = async (addanother) => {
    try {
      const data = form.values;
      const endpoint = isEditing ? `/client/${id}/` : '/client/';
      const response = isEditing ? await put(endpoint, data) : await post(endpoint, data);
      const message = isEditing ? t('Update') : t('Success');
      notifications.show({
        title: message,
        message: t(response),
        color: 'green',
      });
      form.reset()
      addanother?null: router.push("/client");
    } catch (error) {
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
  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return;
    }
  };
  const onSubmit = (e, addanother) => {
    e.preventDefault();
    setIsSubmitting(true);
    form.validate();
    if (!form.validate().hasErrors) {
      createOrUpdateData(addanother);
    }
    else {
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
      <Box>
      <Title order={3}> {isEditing ?t('edit_client'):t('add_client')}</Title>
        <form onSubmit={onSubmit} onKeyDown={onKeyDown}>
          <div className="clientContainer">
            {fields.map((field) => (
            field.hidden!=true &&   <TextInput key={field.name} label={field.label}   withAsterisk={field?.required} {...form.getInputProps(field.name)} />
            ))}
            <Checkbox
              label={t('User.Active')}
              checked={form.values.active === 1}
              onChange={handleActiveChange}
            />
          </div>
          <SubmitButtons isEditing={isEditing} onSubmit={onSubmit} isSubmitting={isSubmitting}/>
        </form>
      </Box>
    </Layout>
  );
}
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

export default ProtectedRoute(AddClient);