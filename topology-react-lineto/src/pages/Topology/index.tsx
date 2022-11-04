import React, { Fragment, useState } from "react";
import "./index.scss";
import LineTo from "react-lineto";
import { Col, Container, Row } from "react-bootstrap";
import { InputSwitch } from "primereact/inputswitch";
import DetailHeader from "components/DetailHeader";
import { InputText } from "primereact/inputtext";
import { MenuItemCommandParams } from "primereact/menuitem";
import { Image } from "react-bootstrap";
import gcpicon from "../../assets/images/add-account/gcp-icon.svg";
import azureicon from "../../assets/images/add-account/azure-icon.svg";
import awsicon from "../../assets/images/add-account/aws-icon.svg";
import RouteTables from "./RouteTables";
import SubnetsTable from "./SubnetsTable";

const types: any = {
  R: "region",
  S: "subnet",
  RT: "r-table",
};

function Topology() {
  //subnets, Route Tables
  const [displayRouteSideBar, setDisplayRouteSideBar] = useState(false);
  const [displaySubnetsSideBar, setDisplaySubnetsSideBar] = useState(false);

  const [regionData, setRegionData] = useState([
    "us-west-1",
    "us-east-1",
    "us-west-2",
    "us-east-2",
    "us-west-3",
  ]);

  const [onHovering, setHighlight] = useState(false);

  const highlightNodes = () => {
    setHighlight(true);
  };

  const unHighlightNodes = () => {
    setHighlight(false);
  };

  const [rerender, setRerender] = useState(true);

  const [provider, setProvider] = useState("Display");
  const items = [
    {
      label: "Display",
      command: (e: MenuItemCommandParams) => {
        setProvider(e.item.label);
        setRerender(true);
      },
    },
    {
      label: "AWS",
      command: (e: MenuItemCommandParams) => {
        setProvider(e.item.label);
        setRerender(true);
      },
    },
    {
      label: "Azure",
      command: (e: MenuItemCommandParams) => {
        setProvider(e.item.label);
        setRerender(true);
      },
    },
    {
      label: "GCP",
      command: (e: MenuItemCommandParams) => {
        setProvider(e.item.label);
        setRerender(true);
      },
    },
  ];

  const [checked1, setChecked1] = useState(false);
  const [vpcMaps, setVpcMaps] = useState<any>({
    "vpc-1-aws": {
      subnets: ["subnet-1", "subnet-2"],
      routeTable: ["r-table-1", "r-table-2"],
    },
  });
  const [regionMaps, setRegionMaps] = useState<any>({
    "us-west-1-aws": {
      vpc: ["vpc-1", "vpc-2", "vpc-3", "vpc-4", "vpc-5"],
      tgw: ["tgw-1", "tgw-2"],
      title: "Cloud APIC Deployed",
    },
    "us-east-1-aws": { vpc: ["vpc-6"], tgw: ["tgw-3"] },
    "us-west-2-aws": { vpc: [], tgw: [] },
    "us-east-2-aws": { vpc: [], tgw: [] },
    "us-west-3-aws": { vpc: [], tgw: [] },
  });
  const [currentVpc, setCurrentVpc] = useState<any>();
  const [currentData, setCurrentData] = useState({
    value: "",
    title: "",
    cloudTitle: "",
  });
  const [relations, setRelations] = useState([
    {
      to: "us-west-1-R-aws",
      from: "us-east-1-R-aws",
    },
    {
      to: "us-west-1-R-aws",
      from: "us-west-1-R-gcp",
    },
    {
      to: "us-west-1-R-aws",
      from: "centralus-R-azure",
    },
    {
      to: "tgw-1-tgw-aws",
      from: "us-west-1-R-gcp",
    },
    {
      to: "tgw-2-tgw-aws",
      from: "centralus-R-azure",
    },
    {
      to: "tgw-2-tgw-aws",
      from: "us-east-1-R-aws",
    },
    {
      to: "tgw-1-tgw-aws",
      from: "us-east-1-R-aws",
    },
    {
      to: "us-west-1-R-aws",
      from: "us-west-3-R-aws",
    },
    {
      to: "tgw-2-tgw-aws",
      from: "us-west-3-R-aws",
    },
    {
      to: "tgw-1-tgw-aws",
      from: "us-west-3-R-aws",
    },
    {
      to: "us-west-1-R-aws",
      from: "us-east-2-R-aws",
    },
    {
      to: "tgw-2-tgw-aws",
      from: "us-east-2-R-aws",
    },
    {
      to: "tgw-1-tgw-aws",
      from: "us-east-2-R-aws",
    },
    {
      to: "us-west-1-R-aws",
      from: "us-west-2-R-aws",
    },
    {
      to: "tgw-2-tgw-aws",
      from: "us-west-2-R-aws",
    },
    {
      to: "tgw-1-tgw-aws",
      from: "us-west-2-R-aws",
    },
    {
      to: "us-west-1-vpc-section-aws",
      from: "us-east-1-R-aws",
    },
    {
      to: "vpc-1-vpc-aws",
      from: "tgw-1-tgw-aws",
    },
    {
      to: "vpc-2-vpc-aws",
      from: "tgw-1-tgw-aws",
    },
    {
      to: "vpc-3-vpc-aws",
      from: "tgw-1-tgw-aws",
    },
    {
      to: "vpc-4-vpc-aws",
      from: "tgw-1-tgw-aws",
    },
    {
      to: "vpc-5-vpc-aws",
      from: "tgw-1-tgw-aws",
    },
    {
      to: "vpc-1-subnet-section-aws",
      from: "tgw-1-tgw-aws",
    },
    {
      to: "vpc-2-vpc-aws",
      from: "tgw-2-tgw-aws",
    },
    {
      to: "vpc-3-vpc-aws",
      from: "tgw-2-tgw-aws",
    },
    {
      to: "vpc-4-vpc-aws",
      from: "tgw-2-tgw-aws",
    },
    {
      to: "vpc-5-vpc-aws",
      from: "tgw-2-tgw-aws",
    },
    {
      to: "us-west-1-R-gcp",
      from: "us-east-1-R-gcp",
    },
    {
      to: "us-west-1-R-gcp",
      from: "us-west-2-R-gcp",
    },
    {
      to: "us-west-1-R-gcp",
      from: "us-east-2-R-gcp",
    },
    {
      to: "centralus-R-azure",
      from: "us-east-1-R-azure",
    },
  ]);

  const style = {
    delay: true,
    borderColor: "#6CC04A",
    borderStyle: "solid",
    borderWidth: 1,
    padding: "2px",
    fromAnchor: "top",
    toAnchor: "bottom",
  };

  const concatContent = (str: string) => {
    return str?.length ? str.split(" ").join("-") : "";
  };

  const contentData = (
    iData: string,
    type: string,
    onClick: any,
    cloudTitle: string
  ) => (
    <Col
      className={type === "tgw" ? "tgwRow" : ""}
      key={`${concatContent(iData)}-${type}`}
    >
      <div
        className={`${
          onHovering ? "connected-nodes" : ""
        } circle ${concatContent(iData)}-${type}-${cloudTitle} ${
          types[type] ? types[type] : type
        } `}
        onClick={onClick}
        onMouseOver={highlightNodes}
        onMouseOut={unHighlightNodes}
      >
        {type.toUpperCase()}
      </div>
      <div className="node-label-name">{iData}</div>
    </Col>
  );

  // ${onHovering ? "connected-nodes" : ""}

  const showSubnet = (data: any, title: string, cloudTitle: string) => {
    return (
      <Row
        className="flex-column mt-2 "
        key={`${concatContent(title)}-${cloudTitle}`}
      >
        {title && (
          <label
            onClick={() => setCurrentVpc("")}
            className="pl-4 mb-0 d-flex alert-link text-underline"
          >
            <div className="vpc-logo">{title}</div>
          </label>
        )}
        <Col>
          <Row
            className={`cloud m-2 mt-0 mb-5 topology-subnet-node  ${title}-subnet-section-${cloudTitle}`}
          >
            {data.subnets?.length &&
              contentData(
                `${data.subnets.length} Subnets`,
                "S",
                showSubnetsTable,
                cloudTitle
              )}
            {data.routeTable?.length &&
              contentData(
                `${data.routeTable.length} Route Table`,
                "RT",
                showRouteTables,
                cloudTitle
              )}
          </Row>
        </Col>
      </Row>
    );
  };

  const constructInnerNode = (
    content: any[],
    mapField: string,
    cloudTitle: string
  ) => {
    return (
      content?.length && (
        <Row className={mapField === "tgw" ? "tgw-section" : ""}>
          {content.map((iData: string) => {
            const isInner = currentVpc === iData;
            const data: any = vpcMaps?.[currentVpc + "-" + cloudTitle] || {};
            return isInner &&
              (data?.subnets?.length || data?.routeTable?.length)
              ? showSubnet(data, currentVpc, cloudTitle)
              : contentData(
                  iData,
                  mapField,
                  () => setCurrentVpc(iData),
                  cloudTitle
                );
          })}
        </Row>
      )
    );
  };

  const goBack = () => {
    setCurrentData({
      value: "",
      title: "",
      cloudTitle: "",
    });
  };

  const showInnerContent = (
    data: any,
    map1: any = "",
    map2: any = "",
    title: string,
    cloudTitle: string
  ) => {
    const vpcs: any = data?.[map1] || [];
    const tgws: any = data?.[map2] || [];
    const name: any = data?.title;

    return (
      <Row className="flex-column" key={`${title}-${cloudTitle}-inner-content`}>
        {(title || name) && (
          <label
            onClick={goBack}
            className="pl-4 mb-0 mt-2 d-flex alert-link text-underline"
          >
            <div className="region-logo">{title}</div>
            {name && <div className="px-1 ml-2 vpc-labelname">{name}</div>}
          </label>
        )}
        <Col>
          <Row
            className={`cloud m-2 mt-0 mb-5 ${title}-vpc-section-${cloudTitle}`}
          >
            <Col className="topology-vpc-card">
              {constructInnerNode(vpcs, map1, cloudTitle)}
              {constructInnerNode(tgws, map2, cloudTitle)}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  const constructNode = (value: any, title: any, cloudTitle: any) => {
    const isInner =
      currentData?.value === value && currentData.title === title.toLowerCase();
    const data: any = regionMaps?.[currentData.value + "-" + cloudTitle] || {};

    return (
      <Fragment key={`${title}-${cloudTitle}-constructNode-${value}`}>
        {isInner && (data?.vpc?.length || data?.tgw?.length)
          ? showInnerContent(data, "vpc", "tgw", value, cloudTitle)
          : contentData(
              value,
              "R",
              () =>
                setCurrentData({
                  value: concatContent(value),
                  title: title.toLowerCase(),
                  cloudTitle,
                }),
              cloudTitle
            )}
      </Fragment>
    );
  };

  const constructLabels = (
    content: any[],
    title: string,
    cloudTitle: string
  ) => {
    return (
      <Row className="flex-column">
        <Col>
          <Row>
            <Image
              src={
                cloudTitle === "GCP"
                  ? gcpicon
                  : cloudTitle === "AWS"
                  ? awsicon
                  : azureicon
              }
              className={`${cloudTitle.toLowerCase()}-logo-title`}
            />
            <h6>{cloudTitle}</h6>
          </Row>
        </Col>
        <Col>
          <Row className="cloud cloud-card">
            {content.map((value: any) =>
              constructNode(value, title, cloudTitle.toLowerCase())
            )}
          </Row>
        </Col>
      </Row>
    );
  };

  const constructLines = () => {
    return relations.map((rel) => {
      return (
        <Fragment key={rel.to + rel.from}>
          <LineTo
            zIndex={0}
            within="topology-main"
            from={rel.from}
            to={rel.to}
            {...style}
          />
        </Fragment>
      );
    });
  };

  // Subnets Route Tables

  const showRouteTables = () => {
    setDisplayRouteSideBar(true);
  };

  const showSubnetsTable = () => {
    setDisplaySubnetsSideBar(true);
  };

  return (
    <div className="topology-main">
      <RouteTables {...{ displayRouteSideBar, setDisplayRouteSideBar }} />
      <SubnetsTable {...{ displaySubnetsSideBar, setDisplaySubnetsSideBar }} />
      <DetailHeader title="Topology" />
      <div className="topology">
        <Container>
          <Row className="">
            <Col lg={2} className="mt-3">
              <DetailHeader
                type="dropdown"
                fetchData={() => setRerender(true)}
                defaultValue={provider}
                items={items}
                title={""}
              />
            </Col>
            <Col lg={9} className="mt-3">
              <InputText
                placeholder="Search by attributes"
                className="form-control "
              />
            </Col>
            <Col lg={1} className="mt-4">
              <InputSwitch
                checked={checked1}
                onChange={(e) => setChecked1(e.value)}
              />
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className="p-4">
            <Col xs={4}></Col>

            <Col xs={4}> {constructLabels(regionData, "R", "AWS")}</Col>

            <Col xs={4}></Col>
          </Row>
          <Row className="p-4">
            <Col xs={4}>
              {" "}
              {constructLabels(regionData.slice(0, 4), "R", "GCP")}
            </Col>
            <Col xs={4}></Col>

            <Col xs={4}>
              {constructLabels(["centralus", "us-east-1"], "R", "Azure")}{" "}
            </Col>
          </Row>
        </Container>
      </div>
      {constructLines()}
    </div>
  );
}

export default Topology;
