import Layout from "@/components/layout/Layout";
import { Box, Title, Flex, Button, Loader, Input, Card, Grid } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { get } from "../api/apiUtils";
import { useRouter } from "next/router";
import formatdate from "@/utils/formatdate";
import MantineReactTables from "@/components/MantineReactTable";
import { UserManagement } from "@/utils/UserManagement";
import ProtectedRoute from "@/utils/ProtectedRoute";
import Link from "next/link";
import { handleApiError } from "@/utils/handleApiError";
import { ListSearch } from "tabler-icons-react";
import InspectionReportDetail from "@/components/mobile/InspectionReportDetail";
import { useRef } from "react";
function InspectionReport() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [records, setRecords] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
  const fetchData = async () => {
    try {
      setLoading(true);
      if(isMobile){
        const data = await get("/report/");
        setRecords(data.reverse());
        setLoading(false);
      }else{
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
          // Process column filters and format date values
          const processedFilters = columnFilters.map(filter => {
            let filterValue = filter.value;
            
            // Handle date filters - convert to YYYY-MM-DD format
            if (filter.id === 'order_date' && filterValue instanceof Date) {
              const year = filterValue.getFullYear();
              const month = String(filterValue.getMonth() + 1).padStart(2, '0');
              const day = String(filterValue.getDate()).padStart(2, '0');
              filterValue = `${year}-${month}-${day}`;
            }
            
            return {
              ...filter,
              value: filterValue
            };
          });
          
          params.append('columnFilters', JSON.stringify(processedFilters));
        }
        const data = await get(`/report/page?${params.toString()}`);
        setRecords(data.results);
        setTotalCount(data.count);
        setLoading(false);
      } 
    } catch (error) {
      handleApiError(error, router, t);
      setLoading(false);
    }
  };
  const fetchClientId = () => {
    const profile_data = JSON.parse(
      UserManagement.getItem("profile_data") || "{}"
    );
    const visible = profile_data?.client === 1;
    setVisible(visible);
  };

  useEffect(() => {
    handleResize();
    //fetchData();
    fetchClientId();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
    if (isMobile) {
      fetchData();
    } else {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      fetchData();
    }
  }, [isMobile, pagination, globalFilter, sorting, columnFilters]);

  const handleResize = () => {
    if (window.innerWidth <= 600) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  const editInfo = (row) => {
    router.push(`inspection_report/add/edit/${row.id}`);
  };
  const hideColumn = {
    gear_dwg_no: false,
    order_date: false,
    serial_no: false,
    shaving_method: false,
  };
  const columns = [
    { header: t("content.orderno"), accessorKey: "order_no", size: 100, enableEditing: false,sortable:true },
    {
      header: t("workOrder.workOrderNo"),
      accessorKey: "work_order_no",
      size: 100,
      enableEditing: false,
      sortable:true
    },
    { header: t("Customer"), accessorKey: "client_name", size: 100,enableEditing: false,sortable:true},
    { header: t("Tool No"), accessorKey: "cutter_no", size: 100,enableEditing: false,sortable:true },
    { header: t("Gear Dwg No"), accessorKey: "gear_dwg_no", size: 100,enableEditing: false,sortable:true },
    { header: t("Person in Charge"), accessorKey: "person_charge", size: 100,enableEditing: false,sortable:true },
    {
      header: t("workOrder.orderdate"),
      accessorKey: "order_date",
      accessorFn: (row) => {
        //convert to Date for sorting and filtering
        const sDay = new Date(row.order_date);

        sDay.setHours(0, 0, 0, 0); // remove time from date (useful if filter by equals exact date)

        return sDay;
      },
      filterVariant: "date",
      Cell: ({ renderedCellValue }) => formatdate(renderedCellValue),
      size: 100,
      enableEditing: false,
      sortable:true
    },
    { header: t("Serial No"), accessorKey: "serial_no", size: 100,enableEditing: false,sortable:true },
    { header: t("Shaving Method"), accessorKey: "shaving_method", size: 100,enableEditing: false,sortable:true },
  ];
  const breadcrumbs = [
    { label: t("inspectionReport"), link: "./inspection_report" },
  ];
  return (
    <Box>
      <Layout breadcrumbs={breadcrumbs}>
        {isMobile ? (
          <Box style={{ position: "absolute", top: "50px", left: "10px" }}>
            <Card style={{width:'400px'}}>
              <Grid>
              <Grid.Col span={5}>
                <Title mt='sm' order={5}>
                {t("inspectionReport")}
                </Title>
                </Grid.Col>
                <Grid.Col>
                  <Input
                    placeholder="Search here"
                    icon={<ListSearch />}
                    mb="md"
                    mt="md"
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(event.currentTarget.value)
                    }
                  />
                </Grid.Col>
              </Grid>
            </Card>
              <InspectionReportDetail reportRecords={records} searchQuery={searchQuery}/>
          </Box>
        ) : (
          <Box>
            <Flex justify="space-between" mb="sm">
              <Title order={3}>{t("inspectionReport")}</Title>
              {visible == 1 && (
                <Button component={Link} href="/inspection_report/add/new">
                  {t("Add New")}
                </Button>
              )}
            </Flex>
            <MantineReactTables
              column={columns}
              data={records}
              editInfo={editInfo}
              columnVisibility={hideColumn}
              visible={visible}
              loading={loading}
              page={"inspection"}
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
        )}
      </Layout>
    </Box>
  );
}
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});
export default ProtectedRoute(InspectionReport);
