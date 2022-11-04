import * as React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Row, Col, Card } from "react-bootstrap";

import * as actionTypes from "../../store/actions";
import CommonContent from "./CommonContent";

const LightLayout = () => {
  const dispatch = useDispatch();
  const onChangeLayoutType = (layoutType: string) =>
    dispatch({ type: actionTypes.LAYOUT_TYPE, layoutType: layoutType });
  useEffect(() => {
    onChangeLayoutType("menu-light");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Row>
        <Col>
          <Card></Card>
        </Col>
      </Row>
      <CommonContent />
    </>
  );
};

export default LightLayout;
