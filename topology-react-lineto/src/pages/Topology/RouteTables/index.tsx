import { useState, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Row, Col } from "react-bootstrap";
import ReactDataTable from "components/DataTable";
import axios from "axios";
import { FilterMatchMode } from "primereact/api";

interface RouteTablesProps {
  displayRouteSideBar?: boolean;
  setDisplayRouteSideBar?: (value: boolean) => void;
}

const RouteTables = ({
  displayRouteSideBar,
  setDisplayRouteSideBar,
}: RouteTablesProps) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    routeTables: { value: null, matchMode: FilterMatchMode.IN },
    accountName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    direction: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const onGlobalFilterChange = (e: any, _noEvent = false) => {
    const value = !_noEvent ? e.target.value : e;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onHideSidebar = () => {
    setDisplayRouteSideBar(false);
  };

  useEffect(() => {
    axios
      .get("../data.json")
      .then((res) => setData(res.data))
      .then((data) => {
        console.log(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const constructData = (data: any[]) => {
    return data.map((item: any) => ({
      routeTables: item?.routeTables,
      accountName: item?.accountName,
      managedState: item?.managedState,
      subnets: item?.subnets,
      routes: item?.routes,
      direction: item?.direction,
    }));
  };

  const settingsiconTemplate = () => {
    return (
      <button className="table-button-style">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          className="feather feather-settings"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>
    );
  };

  const settingsBodyTemplate = () => {
    return (
      <Button
        className="p-button-text shadow-none p-button-secondary"
        icon="pi pi-ellipsis-h"
      />
    );
  };

  const idBodyTemplate = (rowData: any) => {
    const id = rowData.routeTables;
    return <div className="text-primary">{id}</div>;
  };

  const accountNameBodyTemplate = (rowData: any) => {
    const accountName = rowData.accountName;
    return <div className="text-primary">{accountName}</div>;
  };

  const managedStateBodyTemplate = (rowData: any) => {
    const state = rowData.managedState;
    return (
      <div>
        <span className="border p-1">
          <span className="pi pi-circle-fill"></span>
          <span className="pl-1">{state ? "Managed" : "Unmanaged"}</span>
        </span>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div>
        <Row className="justify-content-between align-self-center">
          <Col xl={11} lg={10} md={10}>
            <InputText
              placeholder="Filter by attributes"
              className="form-control input-filter"
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
            />
          </Col>
          <Col xl={1} lg={2} md={2} className="drop-right">
            <Dropdown placeholder="Action" />
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div className="route-tables-sidebar">
      <Sidebar
        visible={displayRouteSideBar}
        position="right"
        className="sidebar-right-topology"
        onHide={() => onHideSidebar()}
      >
        <h2 className="warning-detail-heading">VPC vpc-1 : Route Tables</h2>
        <div className="datatable-account mt-3">
          <div className="card shadow-none">
            <ReactDataTable
              value={constructData(data)}
              loading={loading}
              header={renderHeader()}
              globalFilterFields={["routeTables", "accountName", "direction"]}
            >
              <Column selectionMode="multiple" hidden />
              <Column
                field="routeTables"
                header="ID"
                body={idBodyTemplate}
                sortable
              />
              <Column
                field="accountName"
                header="Account Name"
                body={accountNameBodyTemplate}
                sortable
              />
              <Column
                field="managedState"
                header="Managed State"
                body={managedStateBodyTemplate}
                sortable
              />
              <Column field="subnets" header="Subnets" />
              <Column field="routes" header="Routes" />
              <Column field="direction" header="Direction" />
              <Column
                header={settingsiconTemplate}
                body={settingsBodyTemplate}
                style={{ maxWidth: "2.5rem" }}
              />
            </ReactDataTable>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default RouteTables;
