import { notifications } from "@mantine/notifications";
import instance from "./axiosInstance";

export const downloadFile = async (url,filename,t) =>{
    instance.get(url, { responseType: "blob" })
                    .then((response) => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download",filename);
                        document.body.appendChild(link);
                        link.click();
                    })
                    .catch((err) => {
                        // toast.error(errorMessage(err.response.data.detail));
                        if(err.response.status == '409'){
                            notifications.show({
                              title:t('Error'),
                              message:t("You don't have permission to download this file"),
                              color:'red'
                            })
                          }
                    });
  };