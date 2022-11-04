import React, { useState, useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import yaml from "js-yaml";
import urls from "constants/urls";
import request from "utils/request";
import { addAccount, constructDataFromFile } from "./utils";
import {
  CloudProviderImages,
  CellOptions,
  ReactDataTable,
  DetailHeader,
  CustomDialog,
  Alertscore,
} from "components";
import {
  Dialog,
  Column,
  ColumnGroup,
  Dropdown,
  ConfirmDialog,
  confirmDialog,
  InputText,
  FilterMatchMode,
  Toast,
} from "components/primereact";
import { ColumnBodyOptions } from "primereact/column";
import ShowDetailPopup from "./ShowDetail";
import AddAccount from "./AddAccount";
import { SettingsSVG } from "components/SVGs";
import { useDispatch } from "react-redux";
import * as actionTypes from "store/actions";

const Accounts = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(null);
  const [displayBasic, setDisplayBasic] = useState(false);
  const [rerender, setRerender] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionItem, setActionItem] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const uploadButton = useRef(null);
  const [vpcsResponse, setVpcsResponse] = useState([]);
  const dispatch = useDispatch();

  const initFilters1 = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      namespace: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      idStatus: { value: null, matchMode: FilterMatchMode.IN },
      cloudprovider: { value: null, matchMode: FilterMatchMode.EQUALS },
      regions: { value: null, matchMode: FilterMatchMode.EQUALS },
      vpcs: { value: null, matchMode: FilterMatchMode.EQUALS },
      inventrystatus: { value: null, matchMode: FilterMatchMode.EQUALS },
      cost: { value: null, matchMode: FilterMatchMode.IN },
    });
    setGlobalFilterValue("");
  };

  const onGlobalFilterChange2 = (e: any) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  /* For ConfirmDailog */
  const toast = useRef(null);

  const accept = async (providername: string, id: string) => {
    providername && id && (await deleteAccountRecord(providername, id));
  };

  const confirmDeleteAction = (providername: string, id: string) => {
    confirmDialog({
      message: "Do you want to delete this record?",
      acceptClassName: "p-button-danger",
      accept: () => accept(providername, id),
      // reject: () => {},
    });
  };

  /* For ConfirmDailog */
  const showPopup = () => {
    setDisplayBasic(true);
  };

  const onHide = () => {
    dispatch({ type: actionTypes.RESET_ACCOUNT_DATA });
    setDisplayBasic(false);
  };

  const fetchAccountDetails = async () => {
    try {
      const vpcsResponse = await request(urls.CLOUD_RESOURCES, {
        method: "GET",
      });
      setVpcsResponse(vpcsResponse?.items || []);
      const response = await request(urls.ACCOUNT_DETAILS, {
        method: "GET",
      });
      setData(response?.items || []);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: `Something went wrong. Please try again`,
        life: 10000,
      });
    } finally {
      setLoading(false);
      setRerender(false);
    }
  };

  const constructData = (data: any[]) => {
    return data.length
      ? data?.map((item?: any) => ({
          id: item?.spec?.accountId,
          alertscore: "OK",
          name: item?.spec?.name,
          cloudresources: {
            regions: "",
            code: "",
          },
          namespace: "",
          idStatus: item?.spec?.accountId,
          cloudprovider: item?.spec?.providerName,
          regions: item?.status?.managedRegions?.length || 0,
          vpcs: vpcsCount(item?.spec?.accountId, vpcsResponse),
          inventorystatus: "",
          cost: "",
          settings: "...",
        }))
      : [];
  };

  const vpcsCount = (accountId: string, vpcsRes: any) => {
    let count = 0;
    vpcsRes.forEach((item: any) => {
      if (accountId === item?.spec?.accountId) {
        count++;
      }
    });
    return count;
  };

  useEffect(() => {
    rerender && fetchAccountDetails();
    initFilters1();
  }, [rerender]);

  const reRenderAfterPopup = () => {
    setDisplayBasic(false);
    setActionItem("");
    setRerender(true);
  };

  const actionChange = (e: any) => {
    setActionItem(e.value);
    setActionItem("");
    if (e.value === "AD") {
      showPopup();
    } else if (e.value === "upload") {
      uploadButton.current.click();
    }
  };

  const actionItems = [
    { label: "Add Account", value: "AD" },
    { label: "Import Accounts", value: "upload" },
  ];

  let fileReader: FileReader;

  const createAccounts = async (doc: any) => {
    const loadApis = doc.accounts.map(async (rec: any) =>
      addAccount(constructDataFromFile(rec))
    );

    const result = await Promise.all(loadApis);
    const fulfilled: any[] = [];
    const rejected: any[] = [];
    result.forEach((res: any) => {
      if (res.error) {
        rejected.push(res.error);
      } else {
        fulfilled.push(res?.spec?.name);
      }
    });
    if (rejected.length) {
      const accountNames = rejected.filter((rej: any) =>
        ["string"].includes(typeof rej)
      );

      toast.current.show({
        severity: "error",
        summary: `Error in addition of ${
          rejected.length === result.length ? "" : "some"
        } accounts.`,
        detail: accountNames.length ? accountNames.toString() : undefined,
        life: 10000,
      });
    }
    if (fulfilled.length) {
      const accountNames = fulfilled.filter((ful: any) =>
        ["string"].includes(typeof ful)
      );
      toast.current.show({
        severity: "success",
        summary: "Successfully added the accounts",
        detail: accountNames.length ? accountNames.toString() : undefined,
        life: 10000,
      });
      setRerender(true);
    }
  };

  const handleFileRead = async () => {
    const content = fileReader.result;

    const doc: any = yaml.load(content);

    if (doc?.accounts?.length) {
      console.log(doc);
      await createAccounts(doc);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error in uploading file",
        detail: "Check the file type or content in the file",
        life: 10000,
      });
    }
  };

  const handleFileChosen = (file: any) => {
    if (!file || file.name.split(".")[1] !== "yaml") {
      toast.current.show({
        severity: "error",
        summary: "Invalid file format. Only yaml files are allowed",
        life: 10000,
      });
      return;
    }
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  const renderHeader = () => {
    return (
      <div>
        <Row className="justify-content-between align-self-center">
          <Col xl={11} lg={10} md={10}>
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange2}
              placeholder="Filter by attributes"
              className="form-control input-filter"
            />
          </Col>
          <Col xl={1} lg={2} md={2} className="drop-right">
            <Dropdown
              className="action-dropdown"
              value={actionItem}
              options={actionItems}
              onChange={(e) => actionChange(e)}
              placeholder="Action"
              appendTo="self"
            />
          </Col>
        </Row>
      </div>
    );
  };

  const settingsiconTemplate = () => {
    return (
      <button className="table-button-style">
        <SettingsSVG />
      </button>
    );
  };

  const deleteAccountRecord = async (providername: string, id: string) => {
    let uri = `specProviderName/${providername}/specAccountId/${id}`;
    try {
      await request(
        urls.DELETE_RECORD + uri,
        {
          method: "DELETE",
        },
        false,
        true
      );
      toast.current.show({
        severity: "success",
        detail: "You have deleted the record successfully.",
        life: 10000,
      });
      setRerender(true);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Some thing went wrong. Please try again.",
        detail: err?.message,
        life: 10000,
      });
    }
  };

  const settingsmenuiconTemplate = (rowData: {
    cloudprovider: any;
    id: any;
  }) => {
    const { cloudprovider, id } = rowData;
    return (
      <CellOptions
        {...{ cloudprovider, id }}
        deleteAction={confirmDeleteAction}
      />
    );
  };

  const goToDetail = (event: any, data: any) => {
    event.stopPropagation();
    setShowDetail(true);
    setSelectedRecord(data);
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

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column rowSpan={2} />
      </Row>
      <Row>
        <Column colSpan={2} />
        <Column colSpan={1} />
        <Column
          header="Cloud Resources"
          colSpan={2}
          className="tab-category text-center border-bottom"
        />
        <Column colSpan={1} />
      </Row>
      <Row>
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3em" }}
          hidden
        />
        <Column
          field="name"
          header="Name"
          style={{ width: "23rem" }}
          sortable
        />
        <Column header="Status" body={Alertscore} />
        <Column
          field="idStatus"
          header="ID"
          style={{ width: "29rem" }}
          sortable
        />
        <Column
          field="cloudprovider"
          header="Cloud Provider"
          body={CloudProviderImages}
          sortable
        />
        <Column field="regions" header="Regions" />
        <Column field="vpcs" header="VPCs" />
        <Column header={settingsiconTemplate} body={settingsmenuiconTemplate} />
      </Row>
    </ColumnGroup>
  );

  return showDetail ? (
    <ShowDetailPopup data={selectedRecord} {...{ setShowDetail }} />
  ) : (
    <>
      <DetailHeader
        title="Accounts"
        loading={loading}
        showSync={true}
        fetchData={reRenderAfterPopup}
      />
      <input
        type="file"
        id="file"
        ref={uploadButton}
        className="input-file invisible"
        hidden
        onClick={(event: any) => {
          event.target.value = null;
        }}
        accept=".yaml"
        onChange={(e) => handleFileChosen(e.target.files[0])}
      />
      {
        <CustomDialog open={showDetail}>
          <ShowDetailPopup
            data={selectedRecord}
            {...{ showDetail, setShowDetail }}
          />
        </CustomDialog>
      }

      <div className="datatable-account">
        <Toast ref={toast} baseZIndex={20000} />
        <ConfirmDialog />
        <div className="card shadow-none">
          <CustomDialog open={displayBasic}>
            <Dialog
              header="Add Account"
              onMaskClick={() => setActionItem("")}
              visible={true}
              style={{ width: "95%" }}
              maximized
              draggable={false}
              modal
              onHide={onHide}
            >
              <AddAccount reRenderAfterPopup={reRenderAfterPopup} />
            </Dialog>
          </CustomDialog>
          <ReactDataTable
            value={constructData(data)}
            loading={loading}
            headerColumnGroup={headerGroup}
            header={renderHeader()}
            emptyMessage="No Accounts found."
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
              "cost",
            ]}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3em" }}
              hidden
            />
            <Column field="name" header="Name" body={nameTemplate} />
            <Column body={Alertscore} />
            <Column field="idStatus" header="ID" />
            <Column
              field="cloudprovider"
              header="Cloud Provider"
              body={CloudProviderImages}
            />
            <Column field="regions" header="Regions" />
            <Column field="vpcs" header="VPCs" />
            <Column
              header={settingsiconTemplate}
              body={settingsmenuiconTemplate}
            />
          </ReactDataTable>
        </div>
      </div>
    </>
  );
};

export default Accounts;
