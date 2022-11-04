import React, { useState, useEffect, useRef, useMemo } from "react";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { MenuItemCommandParams } from "primereact/menuitem";
import { ColumnGroup } from "primereact/columngroup";
import { InputText } from "primereact/inputtext";
import { Col, Row } from "react-bootstrap";
import urls from "constants/urls";
import request from "utils/request";
import ReactDataTable from "components/DataTable";
import DetailHeader from "components/DetailHeader";
import CloudProviderImages from "components/CloudProviderImages";
import Alertscore from "components/Alertscore";
import { useLocation } from "react-router-dom";

const Regions = () => {
  const [data, setData] = useState([]);
  const location = useLocation();
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
  const [rerender, setRerender] = useState(true);
  const [provider, setProvider] = useState("All Clouds");
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState(null);

  /* For ConfirmDailog */
  const toast = useRef(null);
  const accountDataNew = useMemo(async () => {
    return await request(urls.ACCOUNT_DETAILS, {
      method: "GET",
    });
  }, []);

  let accountData: any = [];
  accountDataNew.then((res) => {
    accountData = res;
  });

  const fetchRegionsData = async (provider: string) => {
    console.log("provider name ::", provider);
    const url =
      provider === "All Clouds"
        ? urls.CLOUD_REGIONS
        : `${urls.CLOUD_REGIONS_PROVIDERNAME}${
            provider === "Google Cloud Platform" ? "GCP" : provider
          }`;

    let response = await request(url, {
      method: "GET",
    });
    setLoading(false);
    setRerender(false);
    if (provider !== "All Clouds") {
      response = [response];
    }
    setData(
      response.map((item: any) => ({
        id: item?.meta?.ID,
        alertscore: "OK",
        name: item.spec.name,
        enable: getRegionCount("enabled", item.spec.name),
        manage: getRegionCount("managed", item.spec.name),
        namespace: item.meta.namespace,
        idStatus: item?.meta?.ID,
        cloudprovider: item.spec.providerName,
        regions: 0,
        vpcs: 0,
      }))
    );
  };

  const getRegionCount = (type: string, name: string) => {
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

  useEffect(() => {
    rerender && fetchRegionsData(provider);
  }, [rerender, provider]);

  useEffect(() => {
    const state: any = location.state;
    state?.accountId && onGlobalFilterChange(state.accountId, true);
  }, [location]);

  const onGlobalFilterChange = (e: any, _noEvent = false) => {
    const value = !_noEvent ? e.target.value : e;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div>
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
      </div>
    );
  };

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3em" }}
          hidden
        />
        <Column
          field="idStatus"
          header="ID"
          style={{ width: "25rem" }}
          sortable
        />
        <Column
          field="name"
          header="Name"
          style={{ width: "18rem" }}
          sortable
        />
        <Column
          field="namespace"
          header="NameSpace"
          style={{ width: "21rem" }}
          sortable
        />
        <Column header="Status" body={Alertscore} />
        <Column
          field="cloudprovider"
          header="Cloud Provider"
          body={CloudProviderImages}
          sortable
        />
        <Column field="cloudprovider" header="Accounts" hidden />
        <Column field="enable" header="Enabled" sortable />
        <Column field="manage" header="Managed" sortable />
      </Row>
    </ColumnGroup>
  );

  const items = [
    {
      label: "All Clouds",
      command: (e: MenuItemCommandParams) => {
        setProvider(e.item.label);
        setRerender(true);
      },
    },
    {
      label: "AWS",
      command: (e: MenuItemCommandParams) => {
        setProvider(e.item.label);
        setRerender(true);
      },
    },
    {
      label: "Azure",
      command: (e: MenuItemCommandParams) => {
        setProvider(e.item.label);
        setRerender(true);
      },
    },
    {
      label: "Google Cloud Platform",
      command: (e: MenuItemCommandParams) => {
        setProvider(e.item.label);
        setRerender(true);
      },
    },
  ];

  return (
    <>
      <DetailHeader
        title="Regions in"
        type="dropdown"
        loading={loading}
        showSync={true}
        fetchData={() => setRerender(true)}
        defaultValue={provider}
        items={items}
      />
      <div className="datatable-account">
        <div className="card shadow-none">
          <ReactDataTable
            value={data}
            loading={loading}
            headerColumnGroup={headerGroup}
            header={renderHeader()}
            emptyMessage="No Regions found."
            //selection={selectedProducts}
            filters={filters}
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
            <Column field="idStatus" header="ID" />
            <Column field="name" header="Name" />
            <Column field="namespace" header="NameSpace" />
            <Column body={Alertscore} />
            <Column
              field="cloudprovider"
              header="Cloud Provider"
              body={CloudProviderImages}
            />
            <Column field="accounts" header="Accounts" hidden />
            <Column field="enable" header="Enabled" />
            <Column field="manage" header="Managed" />
          </ReactDataTable>
        </div>
      </div>
    </>
  );
};

export default Regions;
