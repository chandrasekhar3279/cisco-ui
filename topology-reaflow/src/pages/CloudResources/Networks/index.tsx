import React, { useState, useEffect, useRef } from "react";
import urls from "constants/urls";
import request from "utils/request";
import { getVpcNames } from "./utils";
import { ReactDataTable, DetailHeader, CustomDialog } from "components";
import {
  Column,
  Dropdown,
  Tooltip,
  Dialog,
  InputText,
  Toast,
  FilterMatchMode,
} from "components/primereact";
import { ColumnBodyOptions } from "primereact/column";
import { Col, Row } from "react-bootstrap";
import { FillCircleSVG } from "components/SVGs";
import ShowDetailComponent from "./DetailPage";
import AddNetwork from "./AddNetwork";

const NetworkServices = () => {
  const [data, setData] = useState([]);
  const [actionItem, setActionItem] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    desc: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [rerender, setRerender] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [vpcData, setVpcData] = useState({});
  const toast = useRef(null);

  const fecthVpcData = async () => {
    try {
      const response = await request(urls.CLOUD_RESOURCES, {
        method: "GET",
      });
      let temp: any = {};
      response?.items?.length &&
        response.items.forEach((rec: any) => {
          temp[rec.spec.vpcId] = rec.spec.name;
        });
      setVpcData(temp);
    } catch (err) {
      setLoading(false);
      toast.current.show({
        severity: "error",
        summary: `Something went wrong. Please try again`,
        life: 10000,
      });
    }
  };

  const statusIssues = (rowData: any) => {
    return (
      <div style={{ margin: "1rem 0" }}>
        <i
          className="icon-style"
          data-pr-tooltip={
            rowData.statusissues
              ? "There are some vpc processing errors"
              : "Network created successfully"
          }
          data-pr-position="left"
          data-pr-at="right+265 bottom"
          data-pr-my="left center-2"
        >
          <FillCircleSVG color={rowData.statusissues ? "#da3611" : "green"} />
        </i>
        <Tooltip target=".icon-style" />
      </div>
    );
  };

  const fetchNetworkData = async () => {
    try {
      const url = urls.NETWORKS;

      let response = await request(url, {
        method: "GET",
      });
      setLoading(false);
      setRerender(false);
      await fecthVpcData();
      response?.items?.length && setData(response?.items || []);
    } catch (err) {
      setLoading(false);
      toast.current.show({
        severity: "error",
        summary: `Something went wrong. Please try again `,
        life: 10000,
      });
    }
  };

  const constructData = (data: any[]) => {
    return data?.map((item: any) => ({
      name: item?.spec?.name,
      desc: item?.spec?.desc,
      labels:
        item?.metadata?.labels && Object.keys(item?.metadata?.labels)
          ? Object.keys(item?.metadata?.labels)
          : [],
      vpcselectormatches: item?.spec?.vpcSelectorSpec?.matchExpression.operator,
      vpcids: item?.status?.vpcIds,
      resolvedids: item?.status?.vpcSelectorStatus?.resolvedIDs,
      statusissues: item?.status?.issues?.vpcProcessingErrors.length > 0,
    }));
  };

  useEffect(() => {
    rerender && fetchNetworkData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerender]);

  const onGlobalFilterChange = (e: any, _noEvent = false) => {
    const value = !_noEvent ? e.target.value : e;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const actionItems = [{ label: "Add Network", value: "Add Network" }];

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
            className="action-dropdown"
            appendTo="self"
          />
        </Col>
      </Row>
    );
  };

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
      <div
        className="alert-link text-underline details-column"
        onClick={(e) => goToDetail(e, data[options.rowIndex])}
      >
        {rowData.name}
      </div>
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
      <Toast ref={toast} baseZIndex={2000} />
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
                reRenderAfterPopup={reRenderAfterPopup}
                toast={toast}
              />
            </Dialog>
          </CustomDialog>
          <ReactDataTable
            value={constructData(data)}
            loading={loading}
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
            <Column
              field="name"
              header="Name"
              body={nameTemplate}
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
              body={labelsData}
              style={{ width: "15rem" }}
              sortable
            />

            <Column
              field="vpcselectormatches"
              header="VPCSelectorMathces"
              hidden
            />
            <Column
              field="vpcids"
              header="VPC-IDs"
              style={{ width: "18rem" }}
              sortable
              hidden
            />
            <Column
              field="resolvedids"
              header="Resolved VPCs"
              body={vpcTemplate}
              style={{ width: "18rem" }}
              align="center"
            />
            <Column
              field="statusissues"
              header="Status"
              align="center"
              body={statusIssues}
              style={{ width: "18rem" }}
              sortable
            />
          </ReactDataTable>
        </div>
      </div>
    </>
  );
};

export default NetworkServices;
