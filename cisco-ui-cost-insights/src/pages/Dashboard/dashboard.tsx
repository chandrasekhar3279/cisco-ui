import * as React from "react";
import { Row, Col, Card } from "react-bootstrap";

import DEMO from "../../store/constant";
const Default = () => {
  return (
    <>
      <Row>
        <Col xl={7} md={12}></Col>
        <Col xl={4} md={12}>
          <Card className="user-card2">
            <Card.Body className="text-center">
              <h6 className="m-b-15">CISCO</h6>
              <div className="risk-rate">
                <span>
                  <b>5</b>
                </span>
              </div>
              <h6 className="m-b-10 m-t-10">Balanced</h6>
              <a href={DEMO.BLANK_LINK} className="text-c-green b-b-success">
                Change Your Risk
              </a>
              <div className="row justify-content-center m-t-10 b-t-default m-l-0 m-r-0">
                <div className="col m-t-15 b-r-default">
                  <h6 className="text-muted">Nr</h6>
                  <h6>AWS 2455</h6>
                </div>
                <div className="col m-t-15">
                  <h6 className="text-muted">Created</h6>
                  <h6>30th Sep</h6>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default Default;
