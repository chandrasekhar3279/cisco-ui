import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import urls from "constants/urls";
import request from "utils/request";
import {
  Alertscore,
  ReactDataTable,
  CloudProviderImages,
  DetailHeader,
} from "components";
import {
  Column,
  InputText,
  Toast,
  FilterMatchMode,
} from "components/primereact";
import { MenuItemCommandParams } from "primereact/menuitem";

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
  const [rerender, setRerender] = useState(false);
  const [provider, setProvider] = useState("All Clouds");
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState([]);
  /* For ConfirmDailog */
  const toast = useRef(null);
  const accountDataNew = async () => {
    try {
      const response = await request(urls.ACCOUNT_DETAILS, {
        method: "GET",
      });
      response?.items?.length && setAccountData(response.items);
      setRerender(true);
    } catch (err) {
      setLoading(false);
      toast.current.show({
        severity: "error",
        summary: `Something went wrong. Please try again`,
        life: 10000,
      });
    }
  };

  useEffect(() => {
    accountDataNew();
  }, []);

  const fetchRegionsData = async (provider: string) => {
    const url = urls.CLOUD_REGIONS;

    try {
      const response = await request(url, {
        method: "GET",
      });
      let tempResponse: any[] = [];
      setLoading(false);
      setRerender(false);

      tempResponse = [...(response?.items || [])];

      setData(
        tempResponse.map((item: any) => ({
          id: item?.metadata?.id,
          alertscore: "OK",
          name: item?.spec?.name,
          enable: getRegionCount("enabled", item?.spec?.name),
          manage: getRegionCount("managed", item?.spec?.name),
          namespace: item?.metadata?.namespace,
          idStatus: item?.metadata?.id,
          cloudprovider: item?.spec?.providerName,
          regions: 0,
          vpcs: 0,
        }))
      );
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: `Something went wrong. Please try again`,
        life: 10000,
      });
    }
  };

  const constructData = () => {
    if (provider === "All Clouds") {
      return data;
    } else {
      return data.filter(
        (rec: any) =>
          rec.cloudprovider ===
          (provider === "Google Cloud Platform" ? "GCP" : provider)
      );
    }
  };

  const getRegionCount = (type: string, name: string) => {
    let count = 0;
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
    return count;
  };

  useEffect(() => {
    rerender && fetchRegionsData(provider);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerender, provider]);

  useEffect(() => {
    const state: any = location.state;
    state?.accountId && onGlobalFilterChange(state.accountId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <Toast ref={toast} baseZIndex={2000} />
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
            value={constructData()}
            loading={loading}
            header={renderHeader()}
            emptyMessage="No Regions found."
            filters={filters}
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
            <Column header="Status" body={Alertscore} />
            <Column
              field="cloudprovider"
              header="Cloud Provider"
              body={CloudProviderImages}
              sortable
            />
            <Column field="accounts" header="Accounts" hidden />
            <Column field="enable" header="Enabled" sortable />
            <Column field="manage" header="Managed" sortable />
          </ReactDataTable>
        </div>
      </div>
    </>
  );
};

export default Regions;
