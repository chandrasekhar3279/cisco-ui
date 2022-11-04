import DetailHeader from "components/DetailHeader";
import { MenuItemCommandParams } from "primereact/menuitem";
import { Col, Form, Image, Row } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Card from "react-bootstrap/Card";
import awsicon from "../../assets/images/add-account/aws-icon.svg";
import azureicon from "../../assets/images/add-account/azure-icon.svg";
import gcpicon from "../../assets/images/add-account/gcp-icon.svg";
import trendingup from "../../assets/images/icons/trending-up.svg";
import trendingdown from "../../assets/images/icons/trending-down.svg";
import arrowright from "../../assets/images/icons/arrow-right.svg";
import * as Yup from "yup";
import Tinyarea from "./Tinyarea";
import Doghnut from "./Doghnut";
import Barlines from "./Barlines";
import Forecast from "./Forecast";
import "./index.css";

const CostInsights = () => {
  const [loading, setLoading] = useState(true);
  const [rerender, setRerender] = useState(true);
  const [regrouprender, setGroupRerender] = useState(true);
  const [provider, setProvider] = useState("Current Month");
  const [sender, setSender] = useState("None");

  const [cost, setCost] = useState(null);
  const [costaws, setCostAws] = useState(null);
  const [costazure, setCostAzure] = useState(null);
  const [costgcp, setCostGcp] = useState(null);
  const [selectedCloud, setCloud] = useState("All");

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    var balances: any = 0;
    var awsCost: any = 0;
    var gcpCost: any = 0;
    var azureCost: any = 0;
    fetch("../costinsightsdata/chartsdata.json")
      .then((res: any) => res.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          awsCost += data[i].valueaws;
          gcpCost += data[i].valuegcp;
          azureCost += data[i].valueazure;
          balances += data[i].valueaws + data[i].valuegcp + data[i].valueazure;
        }

        const gcpval = `${gcpCost.toString().slice(0, 2)}K`;
        const awsval = `${awsCost.toString().slice(0, 2)}K`;
        const azureval = `${azureCost.toString().slice(0, 2)}K`;
        const totalval = `${balances.toString().slice(0, 3)}K`;

        setCost(totalval);
        setCostAws(awsval);
        setCostAzure(azureval);
        setCostGcp(gcpval);
      })
      .catch((err) => {
        console.log(err, " error");
      });
  };

  const [data, setData] = useState({
    cloudProvider: "",
  });

  const items = [
    {
      label: "Current Month",
      command: (e: MenuItemCommandParams) => {
        setProvider(e.item.label);
        setRerender(true);
      },
    },
  ];

  const itemtwo = [
    {
      label: "None",
      command: (e: MenuItemCommandParams) => {
        setSender(e.item.label);
        setGroupRerender(true);
      },
    },
    {
      label: "Account",
      command: (e: MenuItemCommandParams) => {
        setSender(e.item.label);
        setGroupRerender(true);
      },
    },
    {
      label: "Region",
      command: (e: MenuItemCommandParams) => {
        setSender(e.item.label);
        setGroupRerender(true);
      },
    },
    {
      label: "Resource Type",
      command: (e: MenuItemCommandParams) => {
        setSender(e.item.label);
        setGroupRerender(true);
      },
    },
    {
      label: "Tag",
      command: (e: MenuItemCommandParams) => {
        setSender(e.item.label);
        setGroupRerender(true);
      },
    },
  ];

  return (
    <>
      <Row className="ml-2">
        <DetailHeader
          title="Cost Insights from"
          type="dropdown"
          fetchData={() => setRerender(true)}
          defaultValue={provider}
          items={items}
        />

        <DetailHeader
          title="Grouped by"
          type="dropdown"
          loading={loading}
          showSync={true}
          fetchData={() => setRerender(true)}
          defaultValue={sender}
          items={itemtwo}
        />
      </Row>

      <Tabs
        defaultActiveKey="overview"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="overview" title="Overview">
          <Form>
            <Form.Group>
              <Row>
                <Col>
                  <Form.Check>
                    <Card
                      className="shadow-none"
                      onClick={() => setCloud("All")}
                    >
                      <Card.Body>
                        <Card.Title style={{ height: "40px" }}>
                          <h4> Total Cost</h4>
                        </Card.Title>
                        <Row>
                          <Col>
                            <Card.Text>
                              <h4>${cost}</h4>
                            </Card.Text>
                            <Card.Text>
                              <h6>
                                <Image src={trendingup} alt="trendingup" />
                                5%
                              </h6>
                            </Card.Text>
                          </Col>
                          <Col>
                            <Card.Text>
                              <Tinyarea cloud="total" />
                            </Card.Text>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Form.Check>
                </Col>
                <Col>
                  <Form.Check>
                    <Card
                      className="shadow-none"
                      onClick={() => setCloud("AWS")}
                    >
                      <Card.Body>
                        <Card.Title>
                          <Card.Img
                            variant="top"
                            src={awsicon}
                            alt="awsicon"
                            style={{ height: "40px", width: "30px" }}
                          />
                        </Card.Title>

                        <Row>
                          <Col>
                            <Card.Text>
                              <h4>${costaws}</h4>
                            </Card.Text>
                            <Card.Text>
                              <h6>
                                <Image src={trendingup} alt="trendingup" />
                                15%
                              </h6>
                            </Card.Text>
                          </Col>
                          <Col>
                            <Card.Text>
                              <Tinyarea cloud="AWS" />
                            </Card.Text>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Form.Check>
                </Col>
                <Col>
                  <Form.Check>
                    <Card
                      className="shadow-none"
                      onClick={() => setCloud("Azure")}
                    >
                      <Card.Body>
                        <Card.Title>
                          <Card.Img
                            variant="top"
                            src={azureicon}
                            alt="azureicon"
                            style={{ height: "40px", width: "30px" }}
                          />
                        </Card.Title>

                        <Row>
                          <Col>
                            <Card.Text>
                              <h4>${costazure}</h4>
                            </Card.Text>

                            <Card.Text>
                              <h6>
                                <Image src={trendingdown} alt="trendingdown" />
                                7%
                              </h6>
                            </Card.Text>
                          </Col>
                          <Col>
                            <Card.Text>
                              <Tinyarea cloud="AZURE" />
                            </Card.Text>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Form.Check>
                </Col>
                <Col>
                  <Form.Check>
                    <Card
                      className="shadow-none"
                      onClick={() => setCloud("GCP")}
                    >
                      <Card.Body>
                        <Card.Title>
                          <Card.Img
                            variant="top"
                            src={gcpicon}
                            alt="awsicon"
                            style={{ height: "40px", width: "30px" }}
                          />
                        </Card.Title>

                        <Row>
                          <Col>
                            <Card.Text>
                              <h4>${costgcp}</h4>
                            </Card.Text>
                            <Card.Text>
                              <h6>
                                <Image src={arrowright} alt="arrowright" />
                                0%
                              </h6>
                            </Card.Text>
                          </Col>
                          <Col>
                            <Card.Text>
                              <Tinyarea cloud="GCP" />
                            </Card.Text>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Form.Check>
                </Col>
                <Col></Col>
              </Row>
              <Row className="mt-1">
                <Col>
                  <Card border="light" className="shadow-none">
                    <Card.Header>Forecast</Card.Header>

                    <Card.Body>
                      <Row>
                        <Col>
                          <Card.Title>Total Cost</Card.Title>
                          <Card.Text>
                            ${cost}
                            <Image src={trendingup} alt="trendingup" />
                            5%
                            <p>Up $43.32 over last month</p>
                          </Card.Text>
                        </Col>
                        <Col>
                          <Card.Title>Forecasted Total Cost</Card.Title>
                          <Card.Text>
                            $3279
                            <Image src={trendingup} alt="trendingup" />
                            27%
                            <p>Up $35.71 over last month</p>
                          </Card.Text>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={9}>
                          <h6>Cost Trend</h6>
                          <Card.Text className="mt-4">
                            <div className="forecast-chart">
                              <Forecast />
                            </div>
                          </Card.Text>
                        </Col>
                        <Col>
                          <Card.Text>
                            <h4>${cost}</h4>
                          </Card.Text>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card
                    border="light"
                    className="shadow-none"
                    style={{ height: "20.8rem" }}
                  >
                    <Card.Header>Top Trends</Card.Header>
                    <Card.Body>
                      <h6>
                        <span className="text-primary">
                          AWS Account awsAccount1
                        </span>
                        cost are up $505.01(%13){" "}
                        <Image src={trendingup} alt="trendingup" />
                      </h6>
                      <h6>
                        <span className="text-primary">AWS VPC </span>cost are
                        up $10.00(1%){" "}
                        <Image src={trendingup} alt="trendingup" />
                      </h6>
                      {/* <h6>
                      <span className="text-primary">AWS Router</span> cost are down $10.00(1%){" "}
                        <Image src={trendingdown} alt="trendingdown" /></h6>
                       */}
                      <h6>
                        <span className="text-primary">
                          Azure Virtual Network
                        </span>
                        cost are down $10.00(%1){" "}
                        <Image src={trendingdown} alt="trendingup" />
                      </h6>
                      <h6>
                        <span className="text-primary">
                          GCP account gcpAccount1{" "}
                        </span>
                        cost are down $10.00(%1){" "}
                        <Image src={trendingdown} alt="trendingup" />
                      </h6>

                      <h6>
                        <span className="text-primary">
                          GCP account gcpAccount1{" "}
                        </span>
                        cost are down $10.00(%1){" "}
                        <Image src={trendingdown} alt="trendingup" />
                      </h6>
                      <h6>
                        <span className="text-primary">
                          Azure region usecentral
                        </span>{" "}
                        cost are down $50.12(%4){" "}
                        <Image src={trendingdown} alt="trendingup" />
                      </h6>
                      <h6>
                        <span className="text-primary">AWS Router </span>cost
                        are down $10.00(%1){" "}
                        <Image src={trendingdown} alt="trendingup" />
                      </h6>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row className="mt-1">
                <Col>
                  <Card border="light" className="shadow-none">
                    <Card.Header>Daily Total Cost</Card.Header>
                    <Card.Body>
                      <Barlines selectedCloud={selectedCloud} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row className="mt-1">
                <Col>
                  <Card border="light" className="shadow-none">
                    <Card.Header>Regions</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <Doghnut />
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card border="light" className="shadow-none">
                    <Card.Header>Account</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <Doghnut />
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card border="light" className="shadow-none">
                    <Card.Header>Resource Type</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <Doghnut />
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card border="light" className="shadow-none">
                    <Card.Header>Domain</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <Doghnut />
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row className="mt-1">
                <Col>
                  <Card className="shadow-none" onClick={() => setCloud("All")}>
                    <Card.Header>Cost Optimization Recommendations</Card.Header>
                    <Card.Body>
                      <Row>
                        <Col>
                          <Card.Title className="pb-5">
                            Save <span className="text-success ">${cost}</span>a
                            month by following these recomendations
                          </Card.Title>

                          <h6 className="text-primary mt-5">
                            View all recommendations
                          </h6>
                        </Col>
                        <Col>
                          <Card className="shadow-none border border-grey p-3">
                            <Card.Title>
                              <span className="bg-highlight">SAVE</span>
                            </Card.Title>
                            <h4 className="text-secondary">$289.83/month</h4>
                            <Card.Text>by terminating idle VMs</Card.Text>
                            <h6 className="text-primary mt-3">
                              3 Power On-Off VMs
                            </h6>
                          </Card>
                        </Col>
                        <Col>
                          <Card className="shadow-none border border-grey p-3">
                            <Card.Title>
                              <span className="bg-highlight">SAVE</span>
                            </Card.Title>
                            <h4 className="text-secondary">$9.45/month</h4>
                            <Card.Text>by scheduling idle VMs</Card.Text>
                            <h6 className="text-primary mt-3">28 Idle VMs</h6>
                          </Card>
                        </Col>
                        <Col>
                          <Card className="shadow-none border border-grey p-3">
                            <Card.Title>
                              <span className="bg-highlight">SAVE</span>
                            </Card.Title>
                            <h4 className="text-secondary">$117.23/month</h4>

                            <Card.Text>by resizing your VMs</Card.Text>
                            <h6 className="text-primary mt-3">
                              3 Overdedicated VMs
                            </h6>
                          </Card>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Tab>
        <Tab eventKey="browse" title="Browse"></Tab>
      </Tabs>
    </>
  );
};

export default CostInsights;
