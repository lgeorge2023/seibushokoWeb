import {
    Group,
    Paper,
    Text,
    SimpleGrid,
} from '@mantine/core';
import { useTranslation } from "next-i18next";

export function StatusGroup ({data}){
    const { t } = useTranslation("common");

    const stats = data?.map(stat => {
    return (
        <Paper key={stat.title} p="md" radius="md" withBorder shadow="xl">
            <Group position="apart">
                {/* <div> */}
                    <Text c="dimmed" tt="uppercase" fw={900} fz="xs" >
                        {t(stat.title)}
                    </Text>
                    <Text fw={700} fz="xl">
                        {stat.value}
                    </Text>
                {/* </div> */}
            </Group>
        </Paper>
    );
});

return (
    <SimpleGrid cols={5} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {stats}
    </SimpleGrid>
);
}