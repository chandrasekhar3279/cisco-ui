import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import urls from "constants/urls";
import request from "utils/request";
import { ReactDataTable, DetailHeader, CloudProviderImages } from "components";
import {
  Column,
  InputText,
  Toast,
  FilterMatchMode,
} from "components/primereact";
import { MenuItemCommandParams } from "primereact/menuitem";
import { Col, Row } from "react-bootstrap";

const VPCs = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    namespace: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    idStatus: { value: null, matchMode: FilterMatchMode.IN },
    cloudprovider: { value: null, matchMode: FilterMatchMode.EQUALS },
    regions: { value: null, matchMode: FilterMatchMode.EQUALS },
    vpcs: { value: null, matchMode: FilterMatchMode.EQUALS },
    inventrystatus: { value: null, matchMode: FilterMatchMode.EQUALS },
    cost: { value: null, matchMode: FilterMatchMode.IN },
  });
  const toast = useRef(null);

  const [selectedCloud, setSelectedCloud] = useState("All Clouds");
  const [rerender, setRerender] = useState(true);
  const [apiValues, setApiValues] = useState([]);
  const location = useLocation();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState("All Clouds");

  const executePromise = async (promises: any[]) => {
    return await Promise.all(promises.map((p) => p.catch(() => "error")));
  };

  const getApiData = (url: string) => {
    return request(url, {
      method: "GET",
    });
  };

  const callApis = async () => {
    let values = await executePromise([
      getApiData(urls.ROUTE_TABLES_GCP),
      getApiData(urls.ROUTE_TABLES_AWS),
      getApiData(urls.ROUTE_TABLES_AZ),
      getApiData(urls.SUBNETS),
      getApiData(urls.SUBNETS_AWS),
      getApiData(urls.SUBNETS_AZ),
      getApiData(urls.ENDPOINTS_AWS),
      getApiData(urls.ENDPOINTS_AZURE),
      getApiData(urls.ENDPOINTS_GCP),
      getApiData(urls.ACCOUNT_DETAILS),
    ]);
    const resp = values.length
      ? values.map((value) => (value === "error" ? [] : value?.items || []))
      : [];
    setApiValues(resp);
    fecthVpcData(resp);
  };

  const getCountFromData = (vpcId: string, providerName: string, data: any) => {
    if (providerName === "All Clouds" && data[0]?.length) {
      return getCount(vpcId, data[0]);
    } else if (providerName === "AWS" && data[1]?.length) {
      return getCount(vpcId, data[1]);
    } else if (providerName === "Azure" && data[2]?.length) {
      return getCount(vpcId, data[2]);
    } else if (providerName === "GCP" && data[3]?.length) {
      return getCount(vpcId, data[3]);
    } else {
      return 0;
    }
  };

  const getCount = (vpcId: string, providerArray: any) => {
    let count = 0;
    if (providerArray === undefined || providerArray?.length === 0) {
      return count;
    }
    providerArray.forEach((item: any) => {
      if (vpcId === item?.spec?.vpcID) {
        count++;
      }
    });
    return count;
  };

  const fecthVpcData = async (values: any) => {
    let url = "";
    const routesData = values.slice(0, 3);
    const subnetsData = values.slice(3, 6);
    const endpointsData = values.slice(6, 9);
    const accountData = values.slice(9, 10);
    if (provider === "All Clouds") {
      url = urls.CLOUD_RESOURCES;
    } else if (provider === "AWS") {
      url = urls.AWS_VPCS;
    } else if (provider === "Azure") {
      url = urls.AZ_VPCS;
    } else if (provider === "GCP") {
      url = urls.GCP_VPCS;
    }
    request(url, {
      method: "GET",
    })
      .then((response) => {
        setData(
          response?.items?.map((item: any) => ({
            accountId: item?.spec?.accountId,
            name: item?.spec?.name,
            enable: getRegionCount(
              "enabled",
              item?.spec?.region,
              accountData?.[0]
            ),
            manage: getRegionCount(
              "managed",
              item?.spec?.region,
              accountData?.[0]
            ),
            region: item?.spec?.region,
            endpoints: getCountFromData(item?.spec?.vpcId, provider, [
              endpointsData.flat(),
              ...endpointsData,
            ]),
            subnets: getCountFromData(item?.spec?.vpcId, provider, subnetsData),
            routeTables: getCountFromData(item?.spec?.vpcId, provider, [
              routesData.flat(),
              ...routesData,
            ]),
            cloudprovider: item?.spec?.providerName,
          }))
        );
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: `Something went wrong. Please try again`,
          life: 10000,
        });
      })
      .finally(() => {
        setRerender(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    rerender && callApis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerender]);

  useEffect(() => {
    !rerender && fecthVpcData(apiValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  useEffect(() => {
    const state: any = location.state;
    state?.accountId && onGlobalFilterChange(state?.accountId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const onGlobalFilterChange = (e: any, _noEvent = false) => {
    const value = !_noEvent ? e.target.value : e;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const getRegionCount = (type: string, name: string, accountData: any) => {
    let count = 0;
    if (accountData) {
      if (type === "enabled") {
        accountData.forEach((item: any) => {
          item?.status?.enabledRegions?.length &&
            item.status.enabledRegions.includes(name) &&
            count++;
        });
      } else {
        accountData.forEach((item: any) => {
          item?.status?.managedRegions?.length &&
            item.status.managedRegions.includes(name) &&
            count++;
        });
      }
    }
    return count;
  };

  const renderHeader = () => {
    return (
      <Row>
        <Col>
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Filter by attributes"
            className="form-control"
          />
        </Col>
      </Row>
    );
  };

  const items = [
    {
      label: "All Clouds",
      command: (e: MenuItemCommandParams) => {
        setSelectedCloud(e.item.label);
        setProvider("All Clouds");
      },
    },
    {
      label: "AWS",
      command: (e: MenuItemCommandParams) => {
        setProvider("AWS");
        setSelectedCloud(e.item.label);
      },
    },
    {
      label: "Azure",
      command: (e: MenuItemCommandParams) => {
        setProvider("Azure");
        setSelectedCloud(e.item.label);
      },
    },
    {
      label: "Google Cloud Platform",
      command: (e: MenuItemCommandParams) => {
        setProvider("GCP");
        setSelectedCloud(e.item.label);
      },
    },
  ];

  const fetchRefreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setRerender(true);
    }, 1000);
  };

  return (
    <>
      <Toast ref={toast} baseZIndex={2000} />
      <DetailHeader
        title="VPCs in"
        type="dropdown"
        loading={loading}
        showSync={true}
        fetchData={fetchRefreshData}
        defaultValue={selectedCloud}
        items={items}
      />
      <div className="datatable-account">
        <div className="card shadow-none">
          <ReactDataTable
            value={data}
            loading={loading}
            header={renderHeader()}
            filters={filters}
            emptyMessage="No Vpcs found."
            //selection={selectedProducts}
            /*onSelectionChange={(e: { value: any }) =>
              setSelectedProducts(e.value)
            }*/
            globalFilterFields={[
              "name",
              "namespace",
              "idStatus",
              "cloudprovider",
              "cost",
            ]}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3em" }}
              hidden
            />
            <Column field="idStatus" header="ID" sortable hidden />
            <Column field="name" header="Name" />
            <Column field="accountId" header="Accounts" />
            <Column
              field="cloudprovider"
              header="Cloud Provider"
              body={CloudProviderImages}
              sortable
            />
            <Column field="region" header="Region" />
            <Column field="endpoints" header="Endpoint" />
            <Column field="subnets" header="Subnets" />
            <Column field="routeTables" header="RouteTables" />
            <Column field="enable" header="Enable" />
            <Column field="manage" header="Manage" />
          </ReactDataTable>
        </div>
      </div>
    </>
  );
};

export default VPCs;
