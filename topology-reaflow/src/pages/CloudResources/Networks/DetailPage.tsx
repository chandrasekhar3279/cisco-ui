import { FillCircleSVG } from "components/SVGs";
import { Row, Col, Card } from "react-bootstrap";
import "./styles.scss";
import { getVpcNames } from "./utils";

interface ShowDetailComponentProps {
  showDetail?: boolean;
  setShowDetail?: (value: boolean) => void;
  data?: any;
  vpcData?: any;
}

const ShowDetailComponent = ({
  setShowDetail,
  data,
  vpcData,
}: ShowDetailComponentProps) => {
  const vpcIds = getVpcNames(data?.status?.vpcIds, vpcData);
  const resolvedVpcs = getVpcNames(
    data?.status?.vpcSelectorStatus?.resolvedIDs,
    vpcData
  );
  return (
    <div className="detail-view">
      <Row className="d-flex">
        <Col xs={12}>
          <div
            className="alert-link d-flex align-items-center"
            onClick={() => setShowDetail(false)}
          >
            <span className="pi-arrow-left pi exit-button">&nbsp;</span>
            <span className="text-underline exit-button">Networks</span>
          </div>
        </Col>
      </Row>

      <Card className="network-details shadow-none border-white mt-1 px-3">
        <h3 className="network-title py-4 px-3">{data?.spec?.name}</h3>
        <div className="general-card-topmargin border mx-3">
          <h6 className="network-title network-background p-2">General</h6>

          <Row className="ps-2 pt-2 align-items-center">
            <Col xs={2}>
              <h6 className="ns-title m-0">Namespace</h6>
            </Col>
            <Col xs={10}>
              <div className="ns-content">{data?.metadata?.namespace}</div>
            </Col>
          </Row>

          {data.spec.desc && (
            <Row className="ps-2 py-2 align-items-center">
              <Col xs={2}>
                <h6 className="ns-title m-0">Description</h6>
              </Col>
              <Col xs={10}>
                <span>{data?.spec?.desc}</span>
              </Col>
            </Row>
          )}
        </div>
        <Row className="pb-4 ps-3 pe-4 pt-3 mt-2">
          <Col>
            <div className="network-table-col">
              <div className="td-col">
                <h5>VPC Ids</h5>
              </div>
              <div className="td-col">
                {vpcIds.length ? vpcIds : "No Records"}
              </div>
            </div>
          </Col>
          <Col>
            <div className="network-table-col">
              <div className="td-col">
                <h5>Resolved VPCs</h5>
              </div>
              <div className="td-col">
                {resolvedVpcs.length ? resolvedVpcs : "No Records"}
              </div>
            </div>
          </Col>
          <Col>
            <div className="network-table-col">
              <div className="td-col">
                <h5>Issues</h5>
              </div>
              {data?.status?.issues?.vpcProcessingErrors.length ? (
                data?.status?.issues?.vpcProcessingErrors.map(
                  (issue: any) =>
                    issue && (
                      <div className="td-col" key={issue}>
                        {issue}
                      </div>
                    )
                )
              ) : (
                <div className=" td-col text-center p-2 bg-highlight">
                  <FillCircleSVG color="#6dbe4c" size={25} />
                  <span className="ps-2 alert-score">
                    Network created without issues
                  </span>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ShowDetailComponent;
