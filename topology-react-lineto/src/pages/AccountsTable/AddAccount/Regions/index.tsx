import { useState } from "react";
import { Row, Col, Container, Card, Button } from "react-bootstrap";
import { useFormik } from "formik";
import awsaccountconnect from "../../../../assets/images/awsaccountconnect.jpeg";
import accountconnectimage from "../../../../assets/images/accountconnectimage.png";
import FooterActions from "../FooterActions";

interface RegionProps {
  reOpen: () => void;
  handleClose: () => void;
}

const Regions = (props: RegionProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      accountType: "",
      AccountId: "",
      iamUsername: "",
      iamPassword: "",
      email: "",
      emailpassword: "",
    },
    onSubmit: (data) => {
      // setFormData(data);
      // setShowMessage(true);
      formik.resetForm();
    },
  });

  const createNewAccount = () => {
    props.reOpen();
  };

  const goToDetails = () => {
    props.handleClose();
  };

  return (
    <>
      <div className="finish-screen">
        <Container>
          <div className="mb-1 text-center region-top-div">
            <img src={awsaccountconnect} className="center-image" alt="Logo" />
            <p className="m-1">
              All done! Account awsAccount1 was successfully connected.
            </p>
          </div>
          <div className="mb-1">
            <p>What's Next?</p>
            <Card>
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
              <Col>
                <Card>
                  <div className="d-flex card-main-div">
                    <div className="card-bottom-first">
                      <img
                        className="card-bottom-image"
                        src="https://www.businessmodelsinc.com/wp-content/uploads/2020/07/Client-Cisco-logo-grey-1.png"
                        alt="Cisco1"
                      />
                    </div>
                    <div>
                      <h4 className="card-bottom-second">Title</h4>
                      <p className="card-bottom-second">Description Text</p>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col>
                <Card>
                  <div className="d-flex card-main-div">
                    <div className="card-bottom-first">
                      <img
                        className="card-bottom-image"
                        src="https://www.businessmodelsinc.com/wp-content/uploads/2020/07/Client-Cisco-logo-grey-1.png"
                        alt="Cisco1"
                      />
                    </div>
                    <div>
                      <h4 className="card-bottom-second">Title</h4>
                      <p className="card-bottom-second">Description Text</p>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col>
                <Card>
                  <div className="d-flex card-main-div">
                    <div className="card-bottom-first">
                      <img
                        className="card-bottom-image"
                        src="https://www.businessmodelsinc.com/wp-content/uploads/2020/07/Client-Cisco-logo-grey-1.png"
                        alt="Cisco1"
                      />
                    </div>
                    <div>
                      <h4 className="card-bottom-second">Title</h4>
                      <p className="card-bottom-second">Description Text</p>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Card>
                  <div className="d-flex card-main-div">
                    <div className="card-bottom-first">
                      <img
                        className="card-bottom-image"
                        src="https://www.businessmodelsinc.com/wp-content/uploads/2020/07/Client-Cisco-logo-grey-1.png"
                        alt="Cisco1"
                      />
                    </div>
                    <div>
                      <h4 className="card-bottom-second">Title</h4>
                      <p className="card-bottom-second">Description Text</p>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <div className="d-flex card-main-div">
                    <div className="card-bottom-first">
                      <img
                        className="card-bottom-image"
                        src="https://www.businessmodelsinc.com/wp-content/uploads/2020/07/Client-Cisco-logo-grey-1.png"
                        alt="Cisco1"
                      />
                    </div>
                    <div>
                      <h4 className="card-bottom-second">Title</h4>
                      <p className="card-bottom-second">Description Text</p>
                    </div>
                  </div>
                </Card>
              </Col>
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
    </>
  );
};

export default Regions;
