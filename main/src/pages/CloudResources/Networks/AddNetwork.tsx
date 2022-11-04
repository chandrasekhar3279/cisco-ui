import * as React from "react";
import { useState, FC, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { MultiSelect } from "primereact/multiselect";
import request from "utils/request";
import urls from "constants/urls";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import FooterActions from "pages/AccountsTable/AddAccount/FooterActions";

interface AddNetworkProps {
  reRenderAfterPopup: () => void;
  toast?: any;
}

const AddNetwork: FC<AddNetworkProps> = (props) => {
  const [regions, setRegions] = useState([]);
  const [vpcs, setVpcs] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedVpcs, setSelectedVpcs] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [vpcData, setVpcData] = useState([]);
  const [networkName, setNetworkName] = useState("");
  const toast = React.useRef(null);

  const handleClose = () => {
    props.reRenderAfterPopup();
  };

  const onChangeInput = (e: any) => {
    setNetworkName(e.target.value);
  };

  const fecthVpcData = async () => {
    try {
      const response = await request(urls.CLOUD_RESOURCES, {
        method: "GET",
      });

      response?.items?.length && setVpcData(response?.items);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error in loading the data",
        life: 10000,
      });
    }
  };

  useEffect(() => {
    if (vpcData?.length) {
      let tempRegions: any = [],
        tempLabels: any[] = [],
        tempVpcs: any[] = [];

      vpcData.forEach((rec) => {
        rec.spec.region &&
          tempRegions.push({ label: rec.spec.region, value: rec.spec.vpcId });
        let temp = [...Object.values(rec?.metadata?.labels)];
        temp = temp.filter((x) => x);
        temp?.length &&
          tempLabels.push(
            temp.map((t: any) => ({ label: t, value: t, vpc: rec.spec.vpcId }))
          );
        tempVpcs.push({ label: rec.spec.name, value: rec.spec.vpcId });
      });
      tempLabels = tempLabels.flat();
      setLabels(tempLabels);
      setRegions(tempRegions);
      setVpcs(tempVpcs);
    }
  }, [vpcData]);

  useEffect(() => {
    fecthVpcData();
  }, []);

  const onSubmit = async () => {
    try {
      let matchExpression = [];
      if (selectedLabels?.length) {
        matchExpression.push({
          field: "meta.labels",
          key: "app",
          operator: "In",
          values: selectedLabels,
        });
      }
      if (selectedRegions?.length) {
        matchExpression.push({
          field: "spec.region",
          key: "app",
          operator: "In",
          values: selectedRegions,
        });
      }
      if (selectedLabels?.length) {
        matchExpression.push({
          field: "spec.name",
          key: "app",
          operator: "In",
          values: selectedVpcs,
        });
      }

      await request(urls.ADD_NETWORKS, {
        method: "POST",
        body: JSON.stringify({
          spec: {
            name: networkName,
            vpcSelectorSpec: matchExpression,
          },
        }),
      });

      props.toast.current.show({
        severity: "success",
        summary: "Successfully created network",
        life: 10000,
      });

      handleClose();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error in creating a network",
        life: 10000,
      });
    }
  };

  return (
    <Container>
      <Toast ref={toast} baseZIndex={2000} />
      <Row className="my-3">
        <Col xs={6}>
          <div className="d-flex flex-column form-group">
            <label htmlFor="networkName" className="block">
              Network Name
            </label>
            <InputText
              id="networkName"
              onChange={onChangeInput}
              aria-describedby="networkName-help"
              className="  block"
            />
          </div>
        </Col>
      </Row>
      <Row className="form-group my-3">
        <Col xs={6}>
          <label htmlFor="labels" className="block">
            Labels
          </label>
          <MultiSelect
            showClear
            value={selectedLabels}
            options={labels}
            onChange={(e) => setSelectedLabels(e.value)}
            placeholder="Select Labels"
            filter
            optionValue="value"
            className="multiselect-custom d-flex"
            display="comma"
          />
        </Col>
      </Row>

      <Row className="form-group my-3">
        <Col xs={6}>
          <label htmlFor="regions" className="block">
            Regions
          </label>
          <MultiSelect
            showClear
            value={selectedRegions}
            options={regions}
            onChange={(e) => setSelectedRegions(e.value)}
            placeholder="Select Regions"
            filter
            className="multiselect-custom d-flex"
            optionValue="value"
            display="comma"
          />
        </Col>
      </Row>

      <Row className="form-group my-3">
        <Col xs={6}>
          <label htmlFor="vpcs" className="block">
            Vpcs
          </label>
          <MultiSelect
            showClear
            value={selectedVpcs}
            options={vpcs}
            onChange={(e) => setSelectedVpcs(e.value)}
            placeholder="Select Vpcs"
            filter
            className="multiselect-custom d-flex"
            optionValue="value"
            display="comma"
          />
        </Col>
      </Row>
      <Row className="form-group">
        <FooterActions
          previousLabel="Cancel"
          submitLabel="Create A Network"
          backHandler={handleClose}
          nextHandler={onSubmit}
          disabled={!networkName}
        />
      </Row>
    </Container>
  );
};

export default AddNetwork;
