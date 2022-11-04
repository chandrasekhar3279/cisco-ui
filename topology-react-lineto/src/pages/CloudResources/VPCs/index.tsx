import React, { useState, useEffect } from "react";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { InputText } from "primereact/inputtext";
import { Col, Row } from "react-bootstrap";
import urls from "constants/urls";
import request from "utils/request";
import ReactDataTable from "components/DataTable";
import DetailHeader from "components/DetailHeader";
import { MenuItemCommandParams } from "primereact/menuitem";
import CloudProviderImages from "components/CloudProviderImages";
import { useLocation } from "react-router-dom";

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

  const [selectedCloud, setSelectedCloud] = useState("All Clouds");
  const [rerender, setRerender] = useState(true);
  const [apiValues, setApiValues] = useState([]);
  const location = useLocation();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [provider, setProvider] = useState("All Clouds");

  const getApiData = (url: string) => {
    return request(url, {
      method: "GET",
    });
  };

  const callApis = async () => {
    Promise.all([
      getApiData(urls.ROUTE_TABLES),
      getApiData(urls.ROUTE_TABLES_AWS),
      getApiData(urls.ROUTE_TABLES_AZ),
      getApiData(urls.SUBNETS),
      getApiData(urls.SUBNETS_AWS),
      getApiData(urls.SUBNETS_AZ),
      getApiData(urls.ENDPOINTS_AWS),
      getApiData(urls.ENDPOINTS_AZURE),
      getApiData(urls.ENDPOINTS_GCP),
      getApiData(urls.ACCOUNT_DETAILS),
    ]).then((values) => {
      console.log("route_tables promise all ::: ", values);
      setApiValues(values);
      fecthVpcData(values);
    });
  };

  const getCountFromData = (vpcId: string, providerName: string, data: any) => {
    if (providerName === "All Clouds") {
      return getCount(vpcId, data[0]);
    } else if (providerName === "AWS") {
      return getCount(vpcId, data[1]);
    } else if (providerName === "Azure") {
      return getCount(vpcId, data[2]);
    } else {
      return 0;
    }
  };

  const getCount = (vpcId: string, providerArray: any) => {
    let count = 0;
    if (providerArray === undefined || providerArray.length === 0) {
      console.log("array is undefined or length 0");
      return count;
    }
    providerArray.forEach((item: any) => {
      if (vpcId === item.spec.vpcID) {
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
    const response = await request(url, {
      method: "GET",
    });
    setRerender(false);
    setLoading(false);

    setData(
      response.map((item: any) => ({
        accountId: item.spec.accountId,
        name: item.spec.name,
        enable: getRegionCount("enabled", item.spec.region, accountData[0]),
        manage: getRegionCount("managed", item.spec.region, accountData[0]),
        region: item.spec.region,
        endpoints: getCountFromData(item.spec.vpcId, provider, endpointsData), //replace testABC with item.spec.vpcId
        subnets: getCountFromData(item.spec.vpcId, provider, subnetsData), //replace testABC with item.spec.vpcId
        routeTables: getCountFromData(item.spec.vpcId, provider, routesData), //replace testABC with item.spec.vpcId
        cloudprovider: item.spec.providerName,
      }))
    );
  };

  useEffect(() => {
    rerender && callApis();
  }, [rerender]);

  useEffect(() => {
    const state: any = location.state;
    state?.accountId && onGlobalFilterChange(state?.accountId, true);
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
    if (type === "enabled") {
      accountData.forEach((item: any) => {
        item.status.enabledRegions.includes(name) && count++;
      });
    } else {
      accountData.forEach((item: any) => {
        item.status.managedRegions.includes(name) && count++;
      });
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

  const headerGroup = (
    <ColumnGroup>
      <Row>
        {/* <Column selectionMode="multiple" headerStyle={{ width: "3em" }} /> */}
        <Column field="idStatus" header="ID" sortable hidden />
        <Column field="name" header="Name" sortable />

        <Column field="accountId" header="Account" sortable />
        <Column
          field="cloudprovider"
          header="Cloud Provider"
          headerStyle={{ width: "3em" }}
          sortable
        />
        <Column field="region" header="Region" />
        <Column field="endpoints" header="Endpoint" />
        <Column field="subnets" header="Subnets" />
        <Column field="routeTables" header="RouteTables" />
        <Column field="enable" header="Enable" />
        <Column field="manage" header="Manage" />
      </Row>
    </ColumnGroup>
  );

  const items = [
    {
      label: "All Clouds",
      command: (e: MenuItemCommandParams) => {
        setSelectedCloud(e.item.label);
        fecthVpcData(apiValues);
      },
    },
    {
      label: "AWS",
      command: (e: MenuItemCommandParams) => {
        setProvider("AWS");
        fecthVpcData(apiValues);
        setSelectedCloud(e.item.label);
      },
    },
    {
      label: "Azure",
      command: (e: MenuItemCommandParams) => {
        setProvider("Azure");
        fecthVpcData(apiValues);
        setSelectedCloud(e.item.label);
      },
    },
    {
      label: "Google Cloud Platform",
      command: (e: MenuItemCommandParams) => {
        setProvider("GCP");
        fecthVpcData(apiValues);
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
            headerColumnGroup={headerGroup}
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
            {/* <Column
              selectionMode="multiple"
              headerStyle={{ width: "3em" }}
            ></Column> */}
            <Column field="name" header="Name" />
            <Column field="accountId" header="Accounts" />
            <Column field="cloudprovider" body={CloudProviderImages} />
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
