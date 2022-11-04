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
import CloudProviderImages from "components/CloudProviderImages";
import { MenuItemCommandParams } from "primereact/menuitem";

const API_MAPPING: any = {
  AWS: urls.KUBERNETS_AWS,
  Azure: urls.KUBERNETS_AZURE,
  "Google Cloud Platform": urls.KUBERNETS_GCP,
};

const KubernetesClusters = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    accountId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    namespace: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ID: { value: null, matchMode: FilterMatchMode.EQUALS },
    providerName: { value: null, matchMode: FilterMatchMode.EQUALS },
    region: { value: null, matchMode: FilterMatchMode.EQUALS },
    vpcId: { value: null, matchMode: FilterMatchMode.EQUALS },
    resourceGroup: { value: null, matchMode: FilterMatchMode.EQUALS },
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
        ID: item.meta.ID,
        desc: item.spec.desc,
        name: item.spec.name,
        kubeVersion: item.spec.kubeVersion,
        providerName: item.spec.providerName,
        namespace: item.meta.namespace,
        region: item.spec.region,
        vpcId: item.spec.vpcId,
        resourceGroup: item.spec.resourceGroup,
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

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  useEffect(() => {
    !rerender && checkForAccess();
  }, [selectedCloud]);

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
          field="id"
          header="Account"
          headerStyle={{ width: "8.62rem" }}
          sortable
        />
        <Column
          field="ID"
          header="ID"
          headerStyle={{ width: "9.87rem" }}
          sortable
        />
        <Column
          field="name"
          header="Name"
          headerStyle={{ width: "12.49rem" }}
          sortable
        />
        <Column field="providerName" header="Cloud Provider" sortable />
        <Column
          field="namespace"
          header="Namescape"
          headerStyle={{ width: "9.99rem" }}
          sortable
        />
        <Column
          field="region"
          header="Region"
          headerStyle={{ width: "14.69rem" }}
          sortable
        />
        <Column
          field="vpcId"
          header="VPC"
          headerStyle={{ width: "13.93rem" }}
          sortable
        />
        <Column
          field="resourceGroup"
          header="Resource Group"
          headerStyle={{ width: "15.94rem" }}
          sortable
        />
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
        title="Kubernetes Clusters in"
        type="dropdown"
        loading={loading}
        showSync={true}
        defaultValue={selectedCloud}
        items={items}
        fetchData={fetchRefreshData}
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
              "accountId",
              "ID",
              "name",
              "providerName",
              "namespace",
              "region",
              "vpcId",
              "resourceGroup",
            ]}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3em" }}
              hidden
            />
            <Column field="id" />
            <Column field="ID" />
            <Column field="name" />
            <Column field="providerName" body={CloudProviderImages} />
            <Column field="namespace" />
            <Column field="region" />
            <Column field="vpcId" />
            <Column field="resourceGroup" />
          </ReactDataTable>
        </div>
      </div>
    </>
  );
};

export default KubernetesClusters;
