import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode } from "primereact/api";
import { Column, ColumnBodyOptions } from "primereact/column";
import { Toast } from "primereact/toast";
import { ColumnGroup } from "primereact/columngroup";
import { InputText } from "primereact/inputtext";
import { Col, Row } from "react-bootstrap";
import urls from "constants/urls";
import request from "utils/request";
import ReactDataTable from "components/DataTable";
import DetailHeader from "components/DetailHeader";
import { Dropdown } from "primereact/dropdown";
import { Tooltip } from "primereact/tooltip";
import ShowDetailComponent from "./DetailPage";
import CustomDialog from "components/Dailog";
import { Dialog } from "primereact/dialog";
import AddNetwork from "./AddNetwork";
import { getVpcNames } from "./utils";

const NetworkServices = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    desc: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [rerender, setRerender] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [vpcData, setVpcData] = useState({});

  const fecthVpcData = async () => {
    const response = await request(urls.CLOUD_RESOURCES, {
      method: "GET",
    });
    let temp: any = {};
    response.forEach((rec: any) => {
      temp[rec.spec.vpcId] = rec.spec.name;
    });
    setVpcData(temp);
  };

  const statusIssues = (rowData: any) => {
    return (
      <div>
        <i
          className="icon-style"
          data-pr-tooltip={
            rowData.statusissues
              ? "There are some vpc processing errors"
              : "Network created successfully"
          }
          //data-pr-position="bottom"
          // data-pr-at="bottom+5 left"
          // data-pr-my="right"

          data-pr-position="left"
          data-pr-at="right+265 bottom"
          data-pr-my="left center-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            className={
              rowData.statusissues ? "error-circlestatus" : "active-circle"
            }
            style={{ margin: "1.25rem 0" }}
          >
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </i>
        <Tooltip target=".icon-style" />
      </div>
    );
  };

  const fetchNetworkData = async () => {
    const url = urls.NETWORKS;

    let response = await request(url, {
      method: "GET",
    });
    setLoading(false);
    setRerender(false);
    await fecthVpcData();
    setData(response);
  };

  const constructData = (data: any[]) => {
    return data.map((item: any) => ({
      name: item.spec.name,
      desc: item.spec.desc,
      labels:
        item.meta.labels && Object.keys(item.meta.labels)
          ? Object.keys(item.meta.labels)
          : [],
      vpcselectormatches: item.spec.vpcSelectorSpec.matchExpression.operator,
      vpcids: item?.status?.vpcIds,
      resolvedids: item?.status?.vpcSelectorStatus?.resolvedIDs,
      statusissues: item?.status?.issues?.vpcProcessingErrors.length > 0,
    }));
  };

  useEffect(() => {
    rerender && fetchNetworkData();
  }, [rerender]);

  const onGlobalFilterChange = (e: any, _noEvent = false) => {
    const value = !_noEvent ? e.target.value : e;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const [actionItem, setActionItem] = useState("");
  const actionItems = [{ label: "Add Network", value: "Add Network" }];

  const toast = useRef(null);

  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: "feature will be available soon",
      life: 3000,
    });
  };

  const actionChange = (e: any) => {
    setActionItem(e.value);
    setActionItem("");
    if (e.value === "Add Network") {
      setShowAddModal(true);
    }
  };

  const renderHeader = () => {
    return (
      <Row className="justify-content-between align-self-center">
        <Col xl={11} lg={10} md={10}>
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Filter by attributes"
            className="form-control input-filter"
          />
        </Col>
        <Col xl={1} lg={2} md={2} className="drop-right">
          <Dropdown
            value={actionItem}
            options={actionItems}
            onChange={actionChange}
            placeholder="Action"
            className="p-button-danger"
          />
        </Col>
      </Row>
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
          field="name"
          header="Name"
          style={{ width: "25rem" }}
          sortable
        />
        <Column
          field="desc"
          header="Description"
          style={{ width: "30rem" }}
          sortable
        />
        <Column
          field="labels"
          header="Labels"
          sortable
          style={{ width: "15rem" }}
        />

        <Column
          field="vpcselectormatches"
          header="VPCSelectorMathces"
          sortable
          hidden
        />
        <Column
          field="vpcselector"
          header="VPC-IDs"
          style={{ width: "18rem" }}
          hidden
        />

        <Column
          field="resolvedids"
          header="Resolved VPCs"
          sortable
          style={{ width: "18rem" }}
          align="center"
        />
        <Column
          field="statusissues"
          header="Status"
          sortable
          style={{ width: "18rem" }}
          align="center"
        />
      </Row>
    </ColumnGroup>
  );

  const goToDetail = (event: any, data: any) => {
    event.stopPropagation();
    setShowDetail(true);
    setSelectedRecord(data);
  };

  const showtoolTipContent = (records: any[], title: string) => {
    const content: string =
      records?.length > 3
        ? `${records.slice(0, 3).toString()},...`
        : records.toString();

    return (
      <div>
        <span className={title}>{records?.length ? content : "-"}</span>
        {records?.length > 3 && (
          <Tooltip
            target={`.${title}`}
            style={{ color: "rgba(0,0,0,0.87)", maxWidth: "400" }}
          >
            {records.toString()}
          </Tooltip>
        )}
      </div>
    );
  };

  const vpcTemplate = (rowData: any, options: ColumnBodyOptions) => {
    const values: any = getVpcNames(rowData.resolvedids, vpcData);
    return showtoolTipContent(values, "vpc-template" + options.rowIndex);
  };

  const labelsData = (rowData: any, options: ColumnBodyOptions) => {
    const values: any = rowData.labels;

    return showtoolTipContent(values, "label-template" + options.rowIndex);
  };

  const nameTemplate = (
    rowData: {
      name:
        | boolean
        | React.ReactChild
        | React.ReactFragment
        | React.ReactPortal;
    },
    options: ColumnBodyOptions
  ) => {
    return (
      <a
        className="alert-link text-underline"
        onClick={(e) => goToDetail(e, data[options.rowIndex])}
      >
        {rowData.name}
      </a>
    );
  };

  const reRenderAfterPopup = () => {
    setShowAddModal(false);
    setActionItem("");
    setRerender(true);
  };

  return showDetail ? (
    <ShowDetailComponent
      data={selectedRecord}
      {...{ setShowDetail, vpcData }}
    />
  ) : (
    <>
      <Toast ref={toast} />
      <DetailHeader
        title="Networks"
        loading={loading}
        showSync={true}
        fetchData={() => setRerender(true)}
      />

      <div className="datatable-account">
        <div className="card shadow-none">
          <CustomDialog open={showAddModal}>
            <Dialog
              header="Add Network"
              onMaskClick={() => setActionItem("")}
              visible={true}
              style={{ width: "95%" }}
              maximized
              draggable={false}
              modal
              onHide={() => setShowAddModal(false)}
            >
              <AddNetwork
                toast={toast}
                reRenderAfterPopup={reRenderAfterPopup}
              />
            </Dialog>
          </CustomDialog>
          <ReactDataTable
            value={constructData(data)}
            loading={loading}
            headerColumnGroup={headerGroup}
            header={renderHeader()}
            emptyMessage="No Networks found."
            //selection={selectedProducts}
            filters={filters}
            /*onSelectionChange={(e: { value: any }) =>
              setSelectedProducts(e.value)
            }*/
            globalFilterFields={[
              "name",
              "desc",
              "labels",
              "vpcselectormatches",
              "vpcids",
              "resolvedids",
              "statusissues",
            ]}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3em" }}
              hidden
            />
            <Column field="name" header="Name" body={nameTemplate} />
            <Column field="desc" header="Description" />
            <Column field="labels" header="Labels" body={labelsData} />

            <Column
              field="vpcselectormatches"
              header="VPCSelectorMathces"
              hidden
            />
            <Column field="vpcids" header="VPC-IDs" hidden />
            <Column
              field="resolvedids"
              header="Resolved Vpcs"
              body={vpcTemplate}
              align="center"
            />
            <Column align="center" body={statusIssues} />
          </ReactDataTable>
        </div>
      </div>
    </>
  );
};

export default NetworkServices;
