import {  ActionIcon, Flex, Group, Paper, Text, Title } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import instance from "../api/axiosInstance";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

export default function Export() {
  const { t } = useTranslation("common");
  const [MFGloading,setMFGloading]=useState(false);
  const [cutterloading,setCutterloading]=useState(false);
  const [productloading,setProductloading]=useState(false);
  const [orderloading, setOrderLoading] = useState(false);
  const [workorderLoading, setWorkorderLoading] = useState(false);
  const downloadFile = async (url,setLoading) => {
    setLoading(true)
    instance
      .get(url, { responseType: "blob" })
      .then((response) => {
        const urlD = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        const urlParts = url.split("/");
        const fileName = urlParts[urlParts.length - 1];
        link.href = urlD;
        link.setAttribute("download", `${fileName}.csv`);
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if(err.response.status == '409'){
          notifications.show({
            title:t('Error'),
            message:t("You don't have permission to download this file"),
            color:'red'
          })
        }
      });
  };
  return (
    <Paper p="md" radius="md" shadow="sm" mt='md'>
        <Title order={3}>{t("Export")}</Title>
        <Group justify="space-between" mt="xl" noWrap>
            <Flex direction="row" gap="md">
            <Paper p="md" radius="md" shadow="sm">
                <Flex>
                <Text mr="3.5rem">{t('content.MFG')}</Text>
                <ActionIcon loading={MFGloading}>
                <IconDownload
                    color="green"
                    cursor="pointer"
                    onClick={() => downloadFile("/importexport/export_mfg",setMFGloading)}
                />
                </ActionIcon>
                </Flex>
            </Paper>
            <Paper p="md" radius="md" shadow="sm">
                <Flex>
                <Text mr="3.5rem">{t('content.cutter')}</Text>
                <ActionIcon loading={cutterloading}>
                <IconDownload
                    color="green"
                    cursor="pointer"
                    onClick={() => downloadFile("/importexport/export_cutter",setCutterloading)}
                /></ActionIcon>
                </Flex>
            </Paper>
            <Paper p="md" radius="md" shadow="sm">
                <Flex>
                <Text mr="3.5rem">{t('content.Product')}</Text>
                <ActionIcon loading={productloading}>
                <IconDownload
                    color="green"
                    cursor="pointer"
                    onClick={() => downloadFile("/importexport/export_product",setProductloading)}
                /></ActionIcon>
                </Flex>
            </Paper>
            <Paper p="md" radius="md" shadow="sm">
                <Flex>
                <Text mr="3.5rem">{t('order')}</Text>
                <ActionIcon loading={orderloading}>
                <IconDownload
                    color="green"
                    cursor="pointer"
                    onClick={() => downloadFile("/importexport/export_order",setOrderLoading)}
                /></ActionIcon>
                </Flex>
            </Paper>
            <Paper p="md" radius="md" shadow="sm">
                <Flex>
                <Text mr="3.5rem">{t('Workorder')}</Text>
                <ActionIcon loading={workorderLoading}>
                <IconDownload
                    color="green"
                    cursor="pointer"
                    onClick={() => downloadFile("/importexport/export_workorder",setWorkorderLoading)}
                /></ActionIcon>
                </Flex>
            </Paper>
            </Flex>
        </Group>
      </Paper>
  );
}
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});
