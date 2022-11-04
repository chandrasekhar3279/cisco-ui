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

const API_MAPPING: any = {
  AWS: urls.INSTANCESVMS_AWS,
  Azure: urls.INSTANCESVMS_AZURE,
  "Google Cloud Platform": urls.INSTANCESVMS_GCP,
};

const InstancesVMs = () => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    accountId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    region: { value: null, matchMode: FilterMatchMode.CONTAINS },
    resourcegroup: { value: null, matchMode: FilterMatchMode.CONTAINS },
    vpcid: { value: null, matchMode: FilterMatchMode.CONTAINS },
    cloudprovider: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const [selectedCloud, setSelectedCloud] = useState("AWS");
  const [rerender, setRerender] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState(null);

  const fetchData = async () => {
    const response = await request(API_MAPPING[selectedCloud], {
      method: "GET",
    });
    setRerender(false);
    setLoading(false);

    setData(
      response.map((item: any) => ({
        id: item.spec.accountId,
        instancetype: item.spec.instanceType,
        name: item.spec.name,
        nics: item.spec?.nics?.length || 0,
        cloudprovider: item.spec.providerName,
        region: item.spec.region,
        resourcegroup: item.spec.resourceGroup,
        vpcid: item.spec.vpcId,
      }))
    );
  };
  const checkForAccess = () => {
    if (API_MAPPING[selectedCloud]) {
      fetchData();
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
          header="Account ID"
          headerStyle={{ width: "14.56rem" }}
          sortable
        />
        <Column field="instancetype" header="Instance Type" sortable />
        <Column
          field="name"
          header="Name"
          headerStyle={{ width: "11rem" }}
          sortable
        />
        <Column
          field="nics"
          header="NICs"
          headerStyle={{ width: "5.15rem" }}
          sortable
        />
        <Column
          field="cloudprovider"
          header="Cloud Provider"
          headerStyle={{ width: "10.69rem" }}
          sortable
        />
        <Column
          field="region"
          header="Region"
          headerStyle={{ width: "11.05rem" }}
        />
        <Column
          field="resourcegroup"
          header="Resource Group"
          headerStyle={{ width: "11.05rem" }}
          sortable
        />
        <Column
          field="vpcid"
          header="VPC ID"
          sortable
          headerStyle={{ width: "14.38rem" }}
        />
      </Row>
    </ColumnGroup>
  );

  return (
    <>
      <DetailHeader
        title="Instances and Virtual Machines in"
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
            emptyMessage="No records found."
            //selection={selectedProducts}
            /*onSelectionChange={(e: { value: any }) =>
              setSelectedProducts(e.value)
            }*/
            globalFilterFields={[
              "name",
              "accountId",
              "region",
              "resourcegroup",
              "cloudprovider",
              "instancetype",
              "vpcid",
            ]}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3em" }}
              hidden
            />
            <Column field="id" header="Account ID" sortable />
            <Column field="instancetype" header="Instance Type" />
            <Column field="name" header="Name" sortable />
            <Column field="nics" header="NICs" />
            <Column
              field="cloudprovider"
              header="Cloud Provider"
              body={CloudProviderImages}
            />
            <Column field="region" header="Region" />
            <Column field="resourcegroup" header="Resource Group" />
            <Column field="vpcid" header="VPC ID" />
          </ReactDataTable>
        </div>
      </div>
    </>
  );
};

export default InstancesVMs;
