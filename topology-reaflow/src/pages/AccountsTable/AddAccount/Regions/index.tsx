import { Row, Col, Container, Card, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import awsaccountconnect from "assets/images/add-account/awsaccountconnect.jpeg";
import accountconnectimage from "assets/images/add-account/accountconnectimage.png";
import ciscograylogo from "assets/images/add-account/ciscograylogo.png";
import FooterActions from "../FooterActions";
import * as actionTypes from "store/actions";
interface RegionProps {
  reOpen: () => void;
  handleClose: () => void;
}

const Regions = (props: RegionProps) => {
  const accountData = useSelector((state: any) => state.account);
  const dispatch = useDispatch();

  const resetData = () => {
    dispatch({ type: actionTypes.RESET_ACCOUNT_DATA });
  };

  const createNewAccount = () => {
    resetData();
    props.reOpen();
  };

  const goToDetails = () => {
    resetData();
    props.handleClose();
  };

  const count = 5;

  return (
    <div className="finish-screen">
      <Container>
        <div className="mb-1 text-center region-top-div">
          <img src={awsaccountconnect} className="center-image" alt="Logo" />
          <p className="m-1">
            <span>All done! Account</span>
            <b> {accountData?.access?.accountName}</b>
            <span> was successfully connected.</span>
          </p>
        </div>
        <div className="mb-1">
          <p>What's Next?</p>
          <Card className="shadow-none">
            <div className="d-flex justify-content-between region-middle-div">
              <div>
                <h2 className="header-style">Create Something Else</h2>
                <p className="para-font">
                  Since you did x already why not do Y next? Sounds Good?Let's
                  Go!
                </p>
                <Button className="button-style">Let's Get Started</Button>
              </div>
              <div>
                <img
                  src={accountconnectimage}
                  alt="AccountConnectImage"
                  className="middle-div-image"
                />
              </div>
            </div>
          </Card>
        </div>
        <div className="last-screen-bottomdiv">
          <h5 className="bottom-div-header">You might also want to...</h5>
          <Row className="mb-1">
            {[...Array(count)].map((i: any, index: number) => (
              <Col key={index} lg={4} md={4}>
                <Card className="shadow-none">
                  <div className="d-flex card-main-div">
                    <div className="card-bottom-first">
                      <img
                        className="card-bottom-image"
                        src={ciscograylogo}
                        alt="Cisco"
                      />
                    </div>
                    <div>
                      <h4 className="card-bottom-second">Title</h4>
                      <p className="card-bottom-second">Description Text</p>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        <FooterActions
          previousLabel="Add Another Account"
          submitLabel="Close"
          nextHandler={goToDetails}
          backHandler={createNewAccount}
        />
      </Container>
    </div>
  );
};

export default Regions;
