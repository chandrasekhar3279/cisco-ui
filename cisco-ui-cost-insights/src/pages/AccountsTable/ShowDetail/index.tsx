import React, { useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import "./styles.scss";
import { useHistory } from "react-router-dom";

interface ShowDetailPopupProps {
  showDetail?: boolean;
  setShowDetail?: (value: boolean) => void;
  data?: any;
}

const ShowDetailPopup = ({ setShowDetail, data }: ShowDetailPopupProps) => {
  const history = useHistory();

  const inventoryStatus: string = "OK";

  const cloudResources = () => [
    {
      title: "Regions",
      value: data?.status?.enabledRegions?.length || 0,
      url: "/regions",
    },
    {
      title: "VPCs",
      value: 0,
      url: "/vpcs",
    },
    { title: "Security Group", value: 0, url: "/securitygroups" },
    { title: "Instances", value: 0, url: "/instancesvms" },
    { title: "Endpoints", value: 0, url: "/endpoints" },
  ];

  const routeToPage = (
    resource:
      | { title: string; value: number; url: string }
      | { title: string; value: number; url?: undefined }
  ) => {
    if (resource.value !== 0) {
      history.push({
        pathname: resource.url,
        state: { accountId: data?.spec?.accountId },
      });
    }
  };

  return (
    <div className="detail-view">
      <Col xs={4}>
        <div
          className="alert-link  d-flex align-items-center"
          onClick={() => setShowDetail(false)}
        >
          <span className="pi-angle-left pi exit-button"></span>
          <span className="text-underline exit-button">Back to Accounts</span>
        </div>
      </Col>
      <Card className="network-details shadow-none">
        <h3 className="network-title m-3">{data.spec.name}</h3>
        <Row className="justify-content-around m-3">
          <Col lg={3}>
            <Card className="general-card-topmargin">
              <h6 className="show-popup-screen">General</h6>
              <Col>
                <p className="ns-title">Namespace</p>
                <span className="ns-content">{data.meta.namespace}</span>
              </Col>
              <Col className="mb-3">
                <p className="is-title">Inventory Status</p>
                <span className="status-content">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="green"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="feather m-1 feather-check-circle"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </span>
                  <span className="m-1">{inventoryStatus}</span>
                </span>
              </Col>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="mt-2">
              <h6 className="show-popup-screen">Settings</h6>
              <Row>
                <Col lg={6}>
                  <p className="settings-content">Access Type</p>
                  <p className="settings-content">-</p>
                </Col>
                <Col lg={6}>
                  <p>AWS Access ID</p>
                  <p>-</p>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col lg={3}>
            <Card className="m-2 alertcard-style">
              <h6 className="show-popup-screen">Alert Score</h6>
              <p className="text-center bg-highlight">
                <span>
                  <svg height="40" width="40">
                    <circle
                      cx="20"
                      cy="20"
                      r="10"
                      stroke="#6dbe4c"
                      stroke-width="3"
                      fill="#6dbe4c"
                    />
                  </svg>
                </span>
                <span className="alert-score">Healthy</span>
              </p>
            </Card>
          </Col>
        </Row>
        <div className="justify-content-between ml-4 ">
          <Row>
            <Col lg={3}>
              <Card>
                <h6 className="show-popup-screen">Cloud Resources</h6>
                <Row className="text-center">
                  {cloudResources().map((resource) => (
                    <Col lg={4} className="mb-3">
                      <div className="resource-title pb-2">
                        {resource.title}
                      </div>
                      <div
                        className={`resource-value ${
                          resource.url ? "alert-link text-underline" : ""
                        }`}
                        onClick={() => routeToPage(resource)}
                      >
                        {resource.value}
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default ShowDetailPopup;
