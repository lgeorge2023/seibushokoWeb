import { useEffect, useState ,useRef} from 'react';
import {  Box, Button, Flex, Title, Loader } from '@mantine/core';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router'
import { del, get } from '../api/apiUtils';
import { notifications } from '@mantine/notifications';
import DeleteModal from '@/components/DeleteModal';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import MantineReactTables from '@/components/MantineReactTable';
import WorkOrderListModal from '@/components/WorkOrderListModal';
import MFGListModal from '@/components/MFGListModal';
import { UserManagement } from '@/utils/UserManagement';
import ProtectedRoute from '@/utils/ProtectedRoute';
import Link from 'next/link';
import { handleApiError } from '@/utils/handleApiError';
 
function CutterList() {
  const { t } = useTranslation('common')
  const [records, setRecords] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [id,setId] = useState(false);
  const [cutterId, setCutterId] = useState(0);
  const [mfgCutterId,setMfgCutterId] = useState(0)
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mfgModal, setMfgModal] = useState(false);
  const [visible, setVisible] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const isInitialMount = useRef(true);
  const isInitialSearchMount = useRef(true);
  const [searchInput, setSearchInput] = useState('');
  const [rawColumnFilters, setRawColumnFilters] = useState([]);
  const isInitialColumnFilterMount = useRef(true);

  const breadcrumbs = [{ label: t("Cutter"), link: "/cutter/addcutter" }];

  const closeModal = () => {
    setIsOpen(false);
  };
  const router = useRouter();
  const editInfo=(row)=>{
    router.push(`/cutter/addcutter/edit/${row.id}`);
  }
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: (pagination.pageIndex + 1).toString(),
        pageSize: pagination.pageSize.toString(),
      });
      if (globalFilter) {
        params.append('search', globalFilter);
      }
      if (sorting.length > 0) {
        const sort = sorting[0];
        params.append('ordering', sort.id);
        params.append('order', sort.desc ? 'desc' : 'asc');
      }
      if (columnFilters && columnFilters.length > 0) {
        params.append('columnFilters', JSON.stringify(columnFilters));
      }
      
      const data = await get(`/cutter/page?${params.toString()}`);
      setRecords(data.results);
      setTotalCount(data.count);
      setLoading(false);
    } catch (error) {
      handleApiError(error, router, t);
      setLoading(false);
    }
  };

  const fetchClientId = () =>{
    const profile_data = JSON.parse(UserManagement.getItem("profile_data") || '{}');
    const visible = profile_data?.client === 1;
   setVisible(visible)
  }

  useEffect(() => { 
    fetchClientId();
  }, []);

  useEffect(() => {
    if (isInitialColumnFilterMount.current) {
      isInitialColumnFilterMount.current = false;
      return;
    }
    // Only update if the contents are different
    if (JSON.stringify(rawColumnFilters) !== JSON.stringify(columnFilters)) {
      const handler = setTimeout(() => {
        setColumnFilters(rawColumnFilters);
      }, 400);
      return () => clearTimeout(handler);
    }
  }, [rawColumnFilters]);

  useEffect(() => {
    if (isInitialSearchMount.current) {
      isInitialSearchMount.current = false;
      return;
    }
    // Only update if different
    if (searchInput !== globalFilter) {
      const handler = setTimeout(() => {
        setGlobalFilter(searchInput);
      }, 400);
      return () => clearTimeout(handler);
    }
  }, [searchInput]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchData();
  }, [pagination, globalFilter, sorting,columnFilters]);

  const hideColumn = {
    cutter_dwg_no: false,
    pressure_ang: false,
    helix_angle: false,
    hardness: false,
    supplier: false,
  };

  const handleDelete = async () => {
    try {
       const response =  await del(`/cutter/${id}/`)
      notifications.show({
        title: t('Success'),
        message: t(response),
        color: 'green',
      });
      fetchData();
    } catch (error) {
      handleApiError(error, router, t);
    }
    closeModal();
  };
  const deleteData = async (row) => {
    setIsOpen(true);
      setId(row.id)
  };
  const listWorkOrders = (row) =>{
    setCutterId(row.id);
    setShowModal(true);
  }
  const listMfg = (row) =>{
    setMfgCutterId(row.id);
    setMfgModal(true);
  };

  const columns = [
    {
      header: t("cutter.Cutter No"),
      accessorKey: "cutter_no",
      sortable: true,
      size: 100,
      enableEditing: false,
    },
    {
      header: t("cutter.Type"),
      accessorKey: "type",
      size: 100,
      enableEditing: false,
    },
    {
      header: t("cutter.Cutter Drawing No"),
      accessorKey: "cutter_dwg_no",
      sortable: true,
      size: 100,
      enableEditing: false,
    },
    {
      header: t("cutter.Module"),
      accessorKey: "module",
      sortable: true,
      size: 100,
      enableEditing: false,
    },
    {
      header: t("cutter.Pressure Angle"),
      accessorKey: "pressure_ang",
      sortable: true,
      size: 100,
      enableEditing: false,
    },
    {
      header: t("cutter.Lead"),
      accessorKey: "lead",
      sortable: true,
      size: 100,
      enableEditing: false,
    },
    {
      header: t("cutter.Helix Angle"),
      accessorKey: "helix_angle",
      sortable: true,
      size: 100,
      enableEditing: false,
    },
    {
      header: t("cutter.Number Of Teeth"),
      accessorKey: "no_of_teeth",
      sortable: true,
      size: 100,
      enableEditing: false,
    },
    {
      header: t("cutter.Hardness"),
      accessorKey: "hardness",
      sortable: true,
      size: 100,
      enableEditing: false,
    },
    {
      header: t("cutter.Supplier"),
      accessorKey: "supplier",
      sortable: true,
      size: 100,
      enableEditing: false,
    },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Box>
        <WorkOrderListModal
          setShowModal={setShowModal}
          showModal={showModal}
          cutterId={cutterId}
        />
        <MFGListModal
          setMfgModal={setMfgModal}
          mfgModal={mfgModal}
          cutterId={mfgCutterId}
        />
        <DeleteModal
          isOpen={isOpen}
          onClose={closeModal}
          onConfirm={handleDelete}
        />
        <Flex justify="space-between">
          <Title order={3}>{t("content.cutterList")}</Title>
          <Button component={Link} mb="sm" href="cutter/addcutter/new">
            {t("Add New")}
          </Button>
        </Flex>
        <MantineReactTables
          column={columns}
          data={records}
          deleteData={deleteData}
          editInfo={editInfo}
          columnVisibility={hideColumn}
          page={"cutter"}
          listWorkOrders={listWorkOrders}
          listMfg={listMfg}
          visible={visible}
          loading={loading}
          pagination={pagination}
          setPagination={setPagination}
          totalCount={totalCount}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          sorting={sorting}
          setSorting={setSorting}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          rawColumnFilters={rawColumnFilters}
          setRawColumnFilters={setRawColumnFilters}
          enableServerSidePagination={true}
          enableServerSideSearch={true}
          enableServerSideSorting={true}
          enableServerSideColumnFilters={true}
        />
      </Box>
    </Layout>
  );
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
export default ProtectedRoute(CutterList)