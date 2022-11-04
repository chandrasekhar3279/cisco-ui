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

interface SubnetTableProps {
  displaySubnetsSideBar?: boolean;
  setDisplaySubnetsSideBar?: (value: boolean) => void;
}

const SubnetsTable = ({
  displaySubnetsSideBar,
  setDisplaySubnetsSideBar,
}: SubnetTableProps) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    subnetID: { value: null, matchMode: FilterMatchMode.IN },
    accountName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    directnameion: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const onGlobalFilterChange = (e: any, _noEvent = false) => {
    const value = !_noEvent ? e.target.value : e;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onHideSidebar = () => {
    setDisplaySubnetsSideBar(false);
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
      subnetID: item?.subnetID,
      name: item?.name,
      accountName: item?.accountName,
      operState: item?.operState,
      managedState: item?.managedState,
      range: item?.range,
      routeTables: item?.routeTables,
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
    const id = rowData.subnetID;
    return <div className="text-primary">{id}</div>;
  };

  const routeTableBodyTemplate = (rowData: any) => {
    const routeTables = rowData.routeTables;
    return <div className="text-primary">{routeTables}</div>;
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
  const operStateBodyTemplate = (rowData: any) => {
    const state = rowData.operState;
    return (
      <div>
        <span className="oper-state border p-1">
          <span className="pi pi-check-circle"></span>
          <span className="pl-1">{state}</span>
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
    <div className="subnets-sidebar">
      <Sidebar
        visible={displaySubnetsSideBar}
        position="right"
        className="sidebar-right-topology"
        onHide={() => onHideSidebar()}
      >
        <h2 className="warning-detail-heading">VPC vpc-1 : Subnets</h2>
        <div className="datatable-account">
          <div className="card shadow-none">
            <ReactDataTable
              value={constructData(data)}
              loading={loading}
              header={renderHeader()}
              globalFilterFields={["name", "subnetID", "accountName"]}
            >
              <Column selectionMode="multiple" hidden />
              <Column field="name" header="Name" />
              <Column
                field="subnetID"
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
                field="operState"
                header="Oper State"
                body={operStateBodyTemplate}
                sortable
              />
              <Column
                field="managedState"
                header="Managed State"
                body={managedStateBodyTemplate}
                sortable
              />
              <Column field="range" header="CIDR Block Range" />
              <Column
                field="routeTables"
                header="Route Tables"
                body={routeTableBodyTemplate}
              />
              <Column
                header={settingsiconTemplate}
                body={settingsBodyTemplate}
              />
            </ReactDataTable>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default SubnetsTable;
