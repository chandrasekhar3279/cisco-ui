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
import { useLocation } from "react-router-dom";

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
  const [selectedProducts, setSelectedProducts] = useState(null);

  const fetchEndPoints = async () => {
    const response = await request(API_MAPPING[selectedCloud], {
      method: "GET",
    });
    setRerender(false);
    setLoading(false);

    setData(
      response.map((item: any) => ({
        id: item.spec.accountId,
        alertscore: "Healthy",
        name: item.spec.name,
        privateIpAddress: item.spec.ipAddresses?.[0]?.privateIpAddress || "",
        publicIpAddress: item.spec.ipAddresses?.[0]?.publicIpAddress || "",
        instances: item.spec.instanceId,
        idStatus: item.spec.accountId,
        cloudprovider: item.spec.providerName,
      }))
    );
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
  }, [selectedCloud]);

  useEffect(() => {
    const state: any = location.state;
    state?.accountId && onGlobalFilterChange(state.accountId, true);
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="green"
              stroke="green"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-shield"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
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
          <Column
            header="Application Management"
            className="tab-category text-center border-bottom"
          />
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

        {selectedCloud !== "All Clouds" && (
          <Column
            field="type"
            header="EPGs"
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

            {selectedCloud !== "All Clouds" && <Column field="type" />}

            {selectedCloud !== "All Clouds" && <Column field="type" />}

            {selectedCloud === "All Clouds" && <Column field="type" />}

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
