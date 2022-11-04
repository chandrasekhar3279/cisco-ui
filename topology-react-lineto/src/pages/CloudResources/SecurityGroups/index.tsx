import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Col, Row } from "react-bootstrap";
import urls from "constants/urls";
import request from "utils/request";
import ReactDataTable from "components/DataTable";
import DetailHeader from "components/DetailHeader";
import { MenuItemCommandParams } from "primereact/menuitem";
import { FilterMatchMode } from "primereact/api";
import CloudProviderImages from "components/CloudProviderImages";
import { useLocation } from "react-router-dom";
import { ColumnGroup } from "primereact/columngroup";

const API_MAPPING: any = {
  AWS: urls.SECURITYGROUPS_AWS,
  Azure: urls.SECURITYGROUPS_AZURE,
};

const SecurityGroups = () => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const [selectedCloud, setSelectedCloud] = useState("AWS");
  const [rerender, setRerender] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    providerId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    accountId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    resourceGroup: { value: null, matchMode: FilterMatchMode.IN },
    cloudprovider: { value: null, matchMode: FilterMatchMode.EQUALS },
    region: { value: null, matchMode: FilterMatchMode.EQUALS },
    vpcId: { value: null, matchMode: FilterMatchMode.EQUALS },
    name: { value: null, matchMode: FilterMatchMode.EQUALS },
    description: { value: null, matchMode: FilterMatchMode.IN },
  });
  const fetchEndPoints = async () => {
    const response = await request(API_MAPPING[selectedCloud], {
      method: "GET",
    });
    setRerender(false);
    setLoading(false);

    setData(
      response.map((item: any) => ({
        id: item.spec.providerId,
        accountId: item.spec.accountId,
        resourceGroup: item.spec.resourceGroup,
        cloudprovider: item.spec.providerName,
        region: item.spec.region,
        vpcId: item.spec.vpcId,
        name: item.spec.name,
        description: item.spec.description,
      }))
    );
  };

  const onGlobalFilterChange = (e: any, _noEvent = false) => {
    const value = !_noEvent ? e.target.value : e;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
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
              placeholder="Filter by attributes"
              onChange={onGlobalFilterChange}
              className="form-control"
            />
          </Col>
        </Row>
      </div>
    );
  };

  const items = [
    {
      label: "AWS",
      command: (e: MenuItemCommandParams) => setSelectedCloud(e.item.label),
    },
    {
      label: "Azure",
      command: (e: MenuItemCommandParams) => setSelectedCloud(e.item.label),
    },
  ];

  const fetchRefreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setRerender(true);
    }, 500);
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
          field="id"
          header="ID"
          headerStyle={{ width: "13rem" }}
          sortable
        />
        <Column
          field="name"
          header="Name"
          headerStyle={{ width: "13.25rem" }}
          sortable
        />
        <Column
          field="accountId"
          header="Account Name"
          headerStyle={{ width: "12.6rem" }}
        />
        <Column field="cloudprovider" header="Provider" sortable />
        <Column
          field="description"
          header="Description"
          headerStyle={{ width: "14rem" }}
        />
        <Column
          field="resourceGroup"
          header="Resource"
          sortable
          headerStyle={{ width: "15rem" }}
        />
        <Column
          field="region"
          header="Region"
          headerStyle={{ width: "12rem" }}
        />
        <Column field="vpcId" header="VPC ID" />
      </Row>
    </ColumnGroup>
  );

  return (
    <>
      <DetailHeader
        title="Security Groups in"
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
              "providerId",
              "accountId",
              "resourceGroup",
              "cloudprovider",
              "region",
              "vpcId",
              "name",
              "description",
            ]}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3em" }}
              hidden
            />
            <Column field="id" header="ID" sortable />
            <Column field="name" header="Name" sortable />
            <Column field="accountId" header="Account Name" />
            <Column
              field="cloudprovider"
              header="Provider"
              body={CloudProviderImages}
            />
            <Column field="description" header="Description" />
            <Column field="resourceGroup" header="Resource" />
            <Column field="region" header="Region" />
            <Column field="vpcId" header="VPC ID" />
          </ReactDataTable>
        </div>
      </div>
    </>
  );
};

export default SecurityGroups;
