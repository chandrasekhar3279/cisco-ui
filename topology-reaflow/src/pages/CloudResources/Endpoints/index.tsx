import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import urls from "constants/urls";
import request from "utils/request";
import { ReactDataTable, DetailHeader } from "components";
import {
  Column,
  ColumnGroup,
  InputText,
  Toast,
  FilterMatchMode,
} from "components/primereact";
import { MenuItemCommandParams } from "primereact/menuitem";
import { Col, Row } from "react-bootstrap";
import { ShieldSVG } from "components/SVGs";

const API_MAPPING: any = {
  AWS: urls.ENDPOINTS_AWS,
  Azure: urls.ENDPOINTS_AZURE,
  "Google Cloud Platform": urls.ENDPOINTS_GCP,
};

const Endpoints = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    namespace: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    idStatus: { value: null, matchMode: FilterMatchMode.IN },
    cloudprovider: { value: null, matchMode: FilterMatchMode.EQUALS },
    regions: { value: null, matchMode: FilterMatchMode.EQUALS },
    vpcs: { value: null, matchMode: FilterMatchMode.EQUALS },
    inventorystatus: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const location = useLocation();
  const [selectedCloud, setSelectedCloud] = useState("AWS");
  const [rerender, setRerender] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  const fetchEndPoints = async () => {
    try {
      const response = await request(API_MAPPING[selectedCloud], {
        method: "GET",
      });
      setRerender(false);
      setLoading(false);
      response?.items?.length &&
        setData(
          response?.items?.map((item: any) => ({
            id: item?.spec?.accountId,
            alertscore: "Healthy",
            name: item?.spec?.name,
            privateIpAddress:
              item?.spec?.ipAddresses?.[0]?.privateIpAddress || "",
            publicIpAddress:
              item?.spec?.ipAddresses?.[0]?.publicIpAddress || "",
            instances: item?.spec?.instanceId,
            idStatus: item?.spec?.accountId,
            cloudprovider: item?.spec?.providerName,
          }))
        );
    } catch (err) {
      setLoading(false);
      toast.current.show({
        severity: "error",
        summary: `Something went wrong. Please try again`,
        life: 10000,
      });
    }
  };
  const checkForAccess = () => {
    if (API_MAPPING[selectedCloud]) {
      fetchEndPoints();
    } else {
      setLoading(false);
      setRerender(false);
      setData([]);
    }
  };

  useEffect(() => {
    if (rerender) {
      checkForAccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerender]);

  const onGlobalFilterChange = (e: any, _noEvent = false) => {
    const value = !_noEvent ? e.target.value : e;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  useEffect(() => {
    !rerender && checkForAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCloud]);

  useEffect(() => {
    const state: any = location.state;
    state?.accountId && onGlobalFilterChange(state.accountId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

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

  const alertscoreTemplate = (rowData: any) => {
    const alertscore = rowData.alertscore || "-";
    return (
      <React.Fragment>
        <div className="alertscoreTemplate" style={{ width: "80px" }}>
          <span className="icon-style">
            <ShieldSVG color="green" size={13} borderColor="green" />
          </span>
          <span style={{ fontSize: "13px" }}>{alertscore}</span>
        </div>
      </React.Fragment>
    );
  };

  const headerGroup = (
    <ColumnGroup>
      {selectedCloud !== "All Clouds" && (
        <Row>
          <Column colSpan={6} headerStyle={{ width: "69.5rem" }}></Column>

          {selectedCloud === "AWS" && (
            <Column
              colSpan={2}
              header="Cloud Resources"
              className="tab-category text-center border-bottom"
            />
          )}
          {selectedCloud === "Azure" && (
            <Column
              colSpan={3}
              header="Cloud Resources"
              className="tab-category text-center border-bottom"
            />
          )}
          {selectedCloud === "Google Cloud Platform" && (
            <Column
              header="Cloud Resources"
              className="tab-category text-center border-bottom"
            />
          )}
        </Row>
      )}

      <Row>
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3em" }}
          hidden
        />

        <Column header="Status" />

        {selectedCloud === "All Clouds" && (
          <Column field="idStatus" header="ID" sortable />
        )}

        <Column
          field="name"
          header="Name"
          headerStyle={{ width: "11.059rem" }}
          sortable
        />

        <Column
          field="id"
          header="Account Name"
          headerStyle={{ width: "13.73rem" }}
        />

        {selectedCloud !== "All Clouds" && (
          <Column
            field="privateIpAddress"
            header="Private IPv4 Address"
            headerStyle={{ width: "11.82rem" }}
          />
        )}

        {selectedCloud !== "All Clouds" && (
          <Column
            field="publicIpAddress"
            header="Public IPv4 Address"
            headerStyle={{ width: "13.24rem" }}
          />
        )}

        {selectedCloud !== "All Clouds" && (
          <Column
            field="type"
            header="EP Type"
            headerStyle={{ width: "11.05rem" }}
          />
        )}

        {selectedCloud === "All Clouds" && (
          <Column field="type" header="Managed" />
        )}

        {selectedCloud === "All Clouds" && (
          <Column field="limit" header="Resource Limits" />
        )}

        {selectedCloud === "AWS" && (
          <Column header="Security Groups" field="securityGroups" />
        )}
        {selectedCloud === "AWS" && (
          <Column
            header="Instances"
            field="instances"
            headerStyle={{ width: "11.05rem" }}
          />
        )}

        {selectedCloud === "Azure" && (
          <Column
            header="Network Security Group"
            field="networksecuritygroup"
          />
        )}
        {selectedCloud === "Azure" && (
          <Column header="App Security Group" field="appsecuritygroup" />
        )}
        {selectedCloud === "Azure" && (
          <Column header="Virtual Machines" field="virtualmachines" />
        )}

        {selectedCloud === "Google Cloud Platform" && (
          <Column header="Instances" field="instances" />
        )}
      </Row>
    </ColumnGroup>
  );

  const items = [
    {
      label: "AWS",
      command: (e: MenuItemCommandParams) => setSelectedCloud(e.item.label),
    },
    {
      label: "Azure",
      command: (e: MenuItemCommandParams) => setSelectedCloud(e.item.label),
    },
    {
      label: "Google Cloud Platform",
      command: (e: MenuItemCommandParams) => setSelectedCloud(e.item.label),
    },
  ];

  const fetchRefreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setRerender(true);
    }, 500);
  };

  return (
    <>
      <Toast ref={toast} baseZIndex={2000} />
      <DetailHeader
        title="Endpoints in"
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
            emptyMessage="No records found."
            filters={filters}
            globalFilterFields={[
              "name",
              "namespace",
              "idStatus",
              "cloudprovider",
              "regions",
              "vpcs",
              "inventorystatus",
            ]}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3em" }}
              hidden
            />

            <Column
              style={{ minWidth: "rem" }}
              body={alertscoreTemplate}
              className="p-2"
            />

            {selectedCloud === "All Clouds" && <Column field="idStatus" />}

            <Column field="name" />

            <Column field="id" />

            {selectedCloud !== "All Clouds" && (
              <Column field="privateIpAddress" />
            )}

            {selectedCloud !== "All Clouds" && (
              <Column field="publicIpAddress" />
            )}

            <Column field="type" />

            {selectedCloud === "All Clouds" && <Column field="limit" />}

            {selectedCloud === "AWS" && <Column field="securityGroups" />}
            {selectedCloud === "AWS" && <Column field="instances" />}

            {selectedCloud === "Azure" && (
              <Column field="networksecuritygroup" />
            )}
            {selectedCloud === "Azure" && <Column field="appsecuritygroup" />}
            {selectedCloud === "Azure" && <Column field="virtualmachines" />}

            {selectedCloud === "Google Cloud Platform" && (
              <Column field="instances" />
            )}
          </ReactDataTable>
        </div>
      </div>
    </>
  );
};

export default Endpoints;
