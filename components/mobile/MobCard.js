import { Box, Flex, Grid, Paper, Text } from '@mantine/core';
import React from 'react'
import { useTranslation } from "next-i18next";

function MobCard({allrecords}) {
  const { t } = useTranslation("common");
  return (
    <>
      {allrecords.length == 0 ?<Paper p='9.3rem' ><Text  color='dimmed'> {t("No Records")}</Text></Paper>:
      allrecords.map((item,index) => (
    <Grid.Col span={9} key={index}>
      <Paper p="md" radius="md" withBorder shadow="xl">
        <Flex justify="space-between">
          <Flex direction="column">
            <Box>
              {Object.keys(item).map((key) => {
                const label = key.replace(/_/g, ' ').replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
                return (
                  <Flex align="center" gap="sm" key={key}>
                    <Text c="dimmed" tt="uppercase" fw={800} fz="xs">
                      {t(label)}
                    </Text>
                    <Text fz="sm">{item[key]}</Text>
                  </Flex>
                );
              })}
            </Box>
          </Flex>
        </Flex>
      </Paper>
    </Grid.Col>
  ))}
    </>
  )
}

export default MobCard