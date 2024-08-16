import { downloadFile } from "@/pages/api/downloadFile";
import { UserManagement } from "@/utils/UserManagement";
import { ActionIcon, Box, Flex, Tooltip, useMantineTheme } from "@mantine/core";
import {
  IconFileAnalytics,
  IconAlignBoxLeftTop,
  IconTrash,
  IconPrinter,
  IconEye,
} from "@tabler/icons-react";
import { IconEdit } from "@tabler/icons-react";
import { useMantineReactTable, MantineReactTable } from "mantine-react-table";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
const MantineReactTables = (props) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const language = router.locale;
  const {
    column,
    data,
    deleteData,
    editInfo,
    listWorkOrders,
    listMfg,
    columnVisibility,
    page,
    visible,
    loading,
    noaction,
    TableRowStyle,
  } = props;
  const { colorScheme } = useMantineTheme();
  const [columnvisibility, setColumnVisibility] = useState(columnVisibility);
  useEffect(() => {
    UserManagement.setItem(page, JSON.stringify(columnvisibility));
  }, [columnvisibility, page]);
  const size = 23;
  const downloadExcelFile = async (id) => {
    const fileUrl =
      page == "workorder" || page == "dash-wo"
        ? `/workorder/job_sheet/${language}/${id}`
        : `/report/print/${language}/${id}/`;
    await downloadFile(
      fileUrl,
      page == "workorder" || page == "dash-wo"
        ? "JobSheet.pdf"
        : "InspectionReport.pdf",
      t
    );
  };
  const table = useMantineReactTable({
    localization: {
      actions: t("action"),
      rowsPerPage: t("Rows per page"),
    },
    columns: column.map((col) => ({
      ...col,
      headerProps: {
        sx: {
          backgroundColor: "rgba(52, 210, 235, 0.1)",
          borderRight: "1px solid rgba(224, 224, 224, 1)",
          color: "#facbcb",
        },
        editVariant: col.editVariant,
        mantineEditSelectProps: col.mantineEditSelectProps,
        editVariant: col.editVariant,
      },
    })),
    data: data,
    editDisplayMode: "table",
    enableEditing: true,
    state: { columnVisibility: columnvisibility || {}, isLoading: loading },
    onColumnVisibilityChange: (state) => {
      setColumnVisibility(state);
    },
    mantineTableProps: {
      highlightOnHover: false,
      withBorder: true,
      withColumnBorders: true,
      striped: true,
      withBorder: colorScheme === "light",
    },
    enableRowVirtualization: false,
    mantineTableBodyRowProps: TableRowStyle,
    initialState: {
      showGlobalFilter: true,
      density: "xs",
      columnVisibility: columnvisibility || {},
    },
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableRowActions: noaction ? false : true,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
        {visible == 1 ? (
          <Tooltip label={t("Edit")}>
            <ActionIcon
              onClick={() => {
                editInfo(row.original);
              }}
            >
              <IconEdit color=" #4a4747" size={size} />
            </ActionIcon>
          </Tooltip>
        ) : null}
      {page == 'dash-mfg' && (
        <>
          <Tooltip label={t("View Cutter")}>
            <Link href={`/cutter/addcutter/edit/${row.original.cutter_id}`}>
              <IconEye color="black" size={size}></IconEye>
            </Link>
          </Tooltip>
        </>
      )}
        {(page == "workorder" || page == "inspection" || page == "dash-wo") && (
          <>
            <Tooltip label={t("Print")}>
              <ActionIcon>
                <IconPrinter
                  cursor="pointer"
                  color=" #4a4747"
                  size={size}
                  onClick={() => downloadExcelFile(row.original.id)}
                />
              </ActionIcon>
            </Tooltip>
            {page =="inspection"&&
            <Tooltip label={t("View Inspection Report")}>
        <Link href={`/inspection_report/add/edit/${row.original.id}`}>
          <IconEye color="black" size={size}></IconEye>
        </Link>
      </Tooltip>}
          </>
        )}
        {page == "client" && (
          <Box>
            {row.original.id != 1 ? (
              <Tooltip label={t("Delete")}>
                <ActionIcon
                  color="red"
                  onClick={() => {
                    deleteData(row.original);
                  }}
                >
                  <IconTrash size={size} />
                </ActionIcon>
              </Tooltip>
            ) : null}
          </Box>
        )}
        {deleteData && (
          <Tooltip label={t("Delete")}>
            <ActionIcon
              color="red"
              onClick={() => {
                deleteData(row.original);
              }}
            >
              <IconTrash size={size} />
            </ActionIcon>
          </Tooltip>
        )}
        {page == "workorder" && (
          <Box>
            {visible == 1 ? (
              row.original.inspection_report === 0 ? (
                row.original.workorder_status === "FINISHED" ||
                row.original.workorder_status === "DELIVERED" ||
                row.original.workorder_status === "INSPECTIONRPT" ? (
                  <Tooltip label={t("add__inspectionreport")}>
                    <Link href={`/inspection_report/add/${row.original.id}`}>
                      <IconFileAnalytics
                        color="green"
                        size={size}
                      ></IconFileAnalytics>
                    </Link>
                  </Tooltip>
                ) : null
              ) : (
                <Tooltip label={t("edit_inspectionreport")}>
                  <Link
                    href={`/inspection_report/add/edit/${row.original.inspection_report}`}
                  >
                    <IconFileAnalytics
                      color="indigo"
                      size={size}
                    ></IconFileAnalytics>
                  </Link>
                </Tooltip>
              )
            ) : null}
          </Box>
        )}
        {page == "cutter" && (
          <Box>
            <Flex gap="sm" direction={row}>
              <Tooltip label={t("MFG.Regrind")}>
                <ActionIcon>
                  <IconFileAnalytics
                    size={size}
                    color="#518FE2 "
                    onClick={() => listWorkOrders(row.original)}
                  />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={t("MFG")}>
                <ActionIcon>
                  <IconAlignBoxLeftTop
                    size={size}
                    color="#518FE2 "
                    onClick={() => listMfg(row.original)}
                  />
                </ActionIcon>
              </Tooltip>
            </Flex>
          </Box>
        )}
        {page == "mfg" && (
          <Box>
            <Tooltip label={t("MFG.Regrind")}>
              <ActionIcon>
                <IconFileAnalytics
                  size={size}
                  color="#518FE2 "
                  onClick={() => listWorkOrders(row.original)}
                />
              </ActionIcon>
            </Tooltip>
          </Box>
        )}
        {page == "order" &&
          (visible == 1 ? (
            <Box>
              {row.original.workorder_placed === 0 ? (
                <Tooltip label={t("Add Work Order")}>
                  <Link href={`/work_order/add_workorder/${row.original.id}`}>
                    <IconFileAnalytics
                      color="green"
                      size={size}
                    ></IconFileAnalytics>
                  </Link>
                </Tooltip>
              ) : (
                <Tooltip label={t("Edit Work Order")}>
                  <Link
                    href={`/work_order/add_workorder/edit/${row.original.workorder_placed}`}
                  >
                    <IconFileAnalytics
                      color="indigo"
                      size={size}
                    ></IconFileAnalytics>
                  </Link>
                </Tooltip>
              )}
            </Box>
          ) : null)}
      </Box>
    ),
  });
  return <MantineReactTable table={table} />;
};

export default MantineReactTables;
