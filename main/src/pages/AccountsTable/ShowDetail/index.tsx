import { Card, Row, Col } from "react-bootstrap";
import "./styles.scss";
import { useHistory } from "react-router-dom";
import { FillCircleSVG } from "components/SVGs";

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
      <Row className="d-flex">
        <Col xs={12}>
          <div
            className="alert-link d-flex align-items-center"
            onClick={() => setShowDetail(false)}
          >
            <span className="pi-arrow-left pi exit-button">&nbsp;</span>
            <span className="text-underline exit-button">Back to Accounts</span>
          </div>
        </Col>
      </Row>

      <Card className="network-details shadow-none border-white mt-1">
        <h3 className="network-title m-3">{data.spec.name}</h3>
        <Row className="justify-content-around m-3 ">
          <Col lg={3}>
            <Card className="general-card-topmargin shadow-none border">
              <h6 className="show-popup-screen">General</h6>
              <Col className="ps-3">
                <p className="ns-title">Namespace</p>
                <span className="ns-content">{data?.metadata?.namespace}</span>
              </Col>
              <Col className="mb-3 ps-3">
                <p className="is-title">Inventory Status</p>
                <span className="status-content p-1">
                  <span className="">
                    <FillCircleSVG color="green" />
                  </span>
                  <span className="m-1">{inventoryStatus}</span>
                </span>
              </Col>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="mt-2 shadow-none border">
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
            <Card className="m-2 alertcard-style shadow-none border">
              <h6 className="show-popup-screen">Alert Score</h6>
              <p className="text-center bg-highlight py-2">
                <span className="p-2">
                  <FillCircleSVG color="#6dbe4c" size={25} />
                </span>
                <span className="alert-score">Healthy</span>
              </p>
            </Card>
          </Col>
        </Row>
        <div className="justify-content-between ms-4 ">
          <Row>
            <Col lg={3}>
              <Card className="shadow-none border">
                <h6 className="show-popup-screen">Cloud Resources</h6>
                <Row className="text-center">
                  {cloudResources().map((resource, index) => (
                    <Col key={index} lg={4} className="mb-3">
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
