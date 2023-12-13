// utils/apiUtils.js

import { notifications } from "@mantine/notifications";

export const handleApiError = (error, router, t) => {

  if (error === 404) {
    notifications.show({
      title: t('Error'),
      message: t('ERROR_OCCURED'),
      color: 'red',
    });

  } else if (error === 500) {
    router.push('/500');
  } else {
    notifications.show({
      title: t('Error'),
      message: t(error?.trim()),
      color: 'red',
    });
  }
};
