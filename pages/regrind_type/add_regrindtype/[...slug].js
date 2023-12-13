import React, { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { Box, NumberInput,TextInput, Title } from '@mantine/core';
import Layout from '@/components/layout/Layout';
import { get, post, put } from '@/pages/api/apiUtils';
import { useRouter } from 'next/router';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { stringtoNull } from '@/utils/stringtoNull';
import { removeNulls } from '@/utils/removeNulls';
import SubmitButtons from '@/components/SubmitButtons';
import ProtectedRoute from '@/utils/ProtectedRoute';


function AddRegrindType() {
  const { t } = useTranslation('common')
  const router = useRouter();
  const { slug } = router.query;
  const isEditing = slug && slug[0] === 'edit';
  const id = slug && slug[1]; // Extract the id from the slug array
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {  
      type: '',
      feed_speed1: '',
      horz_feed: '',
      axial_angle: '',
      feed_speed2: '',
      depth_cut: '',
      axial_degree: '',
      axial_minute: '',
      t2: '',
      matagi: '',
      axial_second: '',
      t3: '',
      no_of_teeth: '',
      diagonal_angle: '',
      bm: '',
      cutter_speed: '',
      sparkout: '', 
      obd_dia: '',
    },
    validate: {
      type: (value) => value.length < 1 && t('Type is required'),
    },
  });

  const fields = [
    { name: 'type', label: t('Regrind.Type'), required:true,type:'string' },
    { name: 'feed_speed1', label: t('Regrind.Feed Speed1') },
    { name: 'horz_feed', label: t('Regrind.Horz Feed') },
    { name: 'axial_angle', label: t('Regrind.Axial Angle') },
    { name: 'feed_speed2', label: t('Regrind.Feed Speed2') },
    { name: 'depth_cut', label: t('Regrind.Depth Cut') },
    { name: 'axial_degree', label: t('Regrind.Axial Degree') },
    { name: 't1', label: 'T1' },
    { name: 'depth_times', label: t('Regrind.Depth Times') },
    { name: 'axial_minute', label: t('Regrind.Axial Minute') },
    { name: 't2', label: 'T2' },
    { name: 'matagi', label: t('Regrind.Matagi') },
    { name: 'axial_second', label: t('Regrind.Axial Second') },
    { name: 't3', label: 'T3' },
    { name: 'no_of_teeth', label: t('Regrind.No Of Teeth') },
    { name: 'diagonal_angle', label: t('Regrind.Diagonal Angle'),type:'string'  },
    { name: 'bm', label: 'BM' },
    { name: 'obd', label: 'OBD' },
    { name: 'cutter_speed', label: t('Regrind.Cutter Speed') },
    { name: 'sparkout', label: t('Regrind.Sparkout') },
    { name: 'obd_dia', label: t('Regrind.OBD Dia') },
  ];

  const fetchData  = async () => {
    try {
      const data = await get(`regrindtype/${id}/`);
      const nulltostring = removeNulls(data);
      form.setValues(nulltostring);
    } catch (error) {
    }
  };

  useEffect(() => {
    if (isEditing && id) {
      fetchData();
    }
  }, [isEditing, id]);
  const createOrUpdateData = async (addanother,values) => {
    try {
      const newdata = {...values};
      let data = stringtoNull(newdata);
      const endpoint = isEditing ? `/regrindtype/${id}/` : '/regrindtype/';
      const response = isEditing ? await put(endpoint, data) : await post(endpoint, data);
      const message =  isEditing ? t('Update') : t('Success');
      notifications.show({
        title: message,
        message: t(response),
        color: 'green',
      });
      form.reset();
      addanother?null: router.push("/regrind_type");
    } catch (error) {
      notifications.show({
        title: t('Error'),
        message: t(error.trim()),
        color: 'red',
      });
    }
    finally {
      setIsSubmitting(false); // Reset the submission state
    }
  };
  const onSubmit = (e, addanother) => {
    e.preventDefault();
    setIsSubmitting(true);
    form.validate();
    if (!form.validate().hasErrors) {
      createOrUpdateData(addanother,form.values);
    } else {
      notifications.show({
        title: t('Error'),
        message: t('Please fill the mandatory feilds.'),
        color: 'red',
      });
      setIsSubmitting(false);
    }
  };
  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return;
    }
  };
  const breadcrumbs = [
    { label: t('regrindType'), link: '/regrind_type' },
    { label:isEditing ?t('edit_regrind_type'):t('add_regrind_type'), link: '/regrind_type/add_regrindtype/new' },
  ];
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Box>
       <Title order={3}>{isEditing ?t('edit_regrind_type'):t('add_regrind_type')}</Title>
        <form onSubmit={onSubmit} onKeyDown={onKeyDown}>
          <div className='container'>
            {fields.map((field) => (
              (field.type=='string') ?<TextInput
                key={field.name}
                label={field.label}
                withAsterisk={field?.required}
                {...form.getInputProps(field.name)}
              />: <NumberInput 
               key={field.name}
               label={field.label}
               precision={6}
               min={0}
               removeTrailingZeros= {true}
               {...form.getInputProps(field.name)}
              />  
            ))}   
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
export default ProtectedRoute(AddRegrindType);