import { notifications } from "@mantine/notifications";

export const handleApiError = (error, router, t) => {
  if (error === 404) {
    notifications.show({
      title: t('Error'),
      message: t('ERROR_OCCURED'),
      color: 'red',
    });
  } else if (typeof error === 'string') {
    notifications.show({
      title: t('Error'),
      message: t(error?.trim()),
      color: 'red',
    });
  } else {
    // Handle non-string error, maybe log it or show a generic error message
    console.error('Unexpected error:', error);
    notifications.show({
      title: t('Error'),
      message: t('An unexpected error occurred'),
      color: 'red',
    });
  }
};
