import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Dialog } from "primereact/dialog";
import { Form, Row, Col, Button } from "react-bootstrap";
import "./DialogBox.scss";
import {
  addAccount,
  constructData,
  constuctAWSData,
  constructDataFromStackURL,
} from "pages/AccountsTable/utils";
import urls from "constants/urls";
import * as actionTypes from "store/actions";
import { FormTextField } from "components";
import { Formik } from "formik";
import * as yup from "yup";
import { Toast } from "primereact/toast";

interface DailogBoxProps {
  show: boolean;
  setShowDailogBox: (value: boolean) => void;
  nextHandler?: () => void;
  data: any;
  dispatch: (values: any) => void;
}

const schema = yup.object({
  awsAccountId: yup.string().required().min(1),
  arn: yup.string().required().min(1),
});

const DailogBox: React.FC<DailogBoxProps> = ({
  show,
  nextHandler,
  data,
  setShowDailogBox,
  dispatch,
}) => {
  const [credLoader, setCredLoader] = useState("load");
  const [configLoader, setConfigLoader] = useState("load");

  const [finishedScreen, setFinishedScreen] = useState(false);
  const accountData = useSelector((state: any) => state.account);
  const toast = useRef(null);

  const onHide = () => {
    setShowDailogBox(false);
  };

  const saveAccount = async () => {
    let resp;
    try {
      let error = false;
      if (
        data.cloudProvider === "AWS" &&
        data.access.connectName === "cloudFabric"
      ) {
        resp = await addAccount(constuctAWSData(data), urls.ADD_AWS_ACCOUNTS);
        error = !resp?.status?.createStackURL;
        dispatch({
          type: actionTypes.SET_DATA_FOR_ADD_ACCOUNT,
          data: resp?.status?.createStackURL,
          key: "stackURL",
        });
      } else {
        resp = await addAccount(constructData(data));
      }
      if (resp?.error || error) {
        throw Error();
      } else {
        setFinishedScreen(!finishedScreen);
        setConfigLoader("done");
        setCredLoader("done");
      }
    } catch (err) {
      setConfigLoader("error");
      setCredLoader("error");
    }
  };

  useEffect(() => {
    show && saveAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  useEffect(() => {
    if (
      accountData.access.connectName !== "cloudFabric" &&
      configLoader === "done"
    ) {
      setTimeout(() => {
        onHide();
        nextHandler && nextHandler();
      }, 2000);
    } else if (
      accountData.access.connectName !== "cloudFabric" &&
      configLoader === "error"
    ) {
      setTimeout(() => {
        onHide();
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configLoader]);

  const loader = () => (
    <i className="pi pi-spin pi-spinner" style={{ fontSize: "2em" }}></i>
  );

  const showIcons = (iconStatus: string, count: number) => {
    if (iconStatus === "load") {
      return loader();
    } else if (iconStatus === "done") {
      return <i className="pi pi-check-circle" style={{ fontSize: "2em" }}></i>;
    } else if (iconStatus === "error") {
      return (
        <i className="pi pi-ban" style={{ fontSize: "2em", color: "red" }}></i>
      );
    } else {
      return (
        <i
          className="pi pi-circle pi-content"
          data-count={count}
          style={{ fontSize: "2em" }}
        ></i>
      );
    }
  };

  const submitData = async (values: any) => {
    const data = await addAccount(
      constructDataFromStackURL({
        ...accountData,
        arn: values.arn,
        awsAccountId: values.awsAccountId,
      })
    );
    if (data.error) {
      toast.current.show({
        severity: "error",
        summary: `Something went wrong. Please try again`,
        life: 10000,
      });
    } else {
      setFinishedScreen(true);
      nextHandler && nextHandler();
    }
  };

  return (
    <Dialog
      className="dialog-box"
      showHeader={false}
      draggable={false}
      visible={show}
      style={{ width: "40vw" }}
      onHide={onHide}
      resizable={false}
    >
      {accountData.access.connectName === "cloudFabric" && finishedScreen ? (
        <div className="m-4">
          <Toast ref={toast} baseZIndex={20000} />
          <Formik
            onSubmit={(values, { setSubmitting }) => {
              submitData(values);
              setSubmitting(false);
            }}
            initialValues={{
              arn: "",
              awsAccountId: "",
            }}
            validateOnMount
            validationSchema={schema}
          >
            {({ handleSubmit, isValid, isSubmitting }) => (
              <Form noValidate onSubmit={handleSubmit} className="mt-2">
                <Row>
                  <Col xs={12} className="mb-1">
                    Click on the following link to navigate to the AWS console
                    to create resources.
                  </Col>
                  <Col xs={12}>
                    <a
                      target="_blank"
                      href={accountData.stackURL}
                      className="alert-link"
                      rel="noreferrer"
                    >
                      <Button className="p-button-info mb-2 mt-1">
                        Launch CloudFormation Template
                      </Button>
                    </a>
                  </Col>
                  <Col xs={12} className="mb-3">
                    On completion of stack creation, note down AWS account ID
                    and role ARN, and then provide the same in the following
                    fields then submit the form.
                  </Col>
                </Row>
                <Row>
                  <FormTextField
                    required
                    as={Col}
                    xs="6"
                    hideError
                    controlId="validationFormikAwsAccountId"
                    label="Account ID"
                    type="text"
                    name="awsAccountId"
                  />
                </Row>
                <Row>
                  <FormTextField
                    required
                    hideError
                    as={Col}
                    xs="6"
                    controlId="validationFormikarn"
                    label="Role ARN"
                    type="text"
                    name="arn"
                  />
                </Row>
                <Row>
                  <Col className="d-flex justify-content-end mt-3 ">
                    <Button disabled={!isValid || isSubmitting} type="submit">
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <div className="container pop-up-styles">
          <Row>
            <Col xs={6}>
              <div className="pi-element">
                {showIcons(credLoader, 1)} <div>Checking Credentials</div>
              </div>
            </Col>
            <Col xs={6}>
              <div className="pi-element">
                {showIcons(configLoader, 2)} <div>Configuring Access</div>
              </div>
            </Col>
            <Col
              xs={12}
              className="popup-content"
              style={{
                marginTop: "20px",
                paddingBottom: "0px",
                textAlign: "center",
              }}
            >
              {credLoader === "load" && configLoader === "load" && (
                <p className="text-center" style={{ fontSize: "1em" }}>
                  Logging into account with the provided details...
                </p>
              )}
              {credLoader === "done" && configLoader === "load" && (
                <p className="text-center" style={{ fontSize: "1em" }}>
                  Running a stack on your account to setup access for Cloud
                  Fabric...
                </p>
              )}
              {credLoader === "done" && configLoader === "done" && (
                <p className="text-center" style={{ fontSize: "1em" }}>
                  Account connection is complete!
                </p>
              )}
            </Col>
          </Row>
        </div>
      )}
    </Dialog>
  );
};

export default DailogBox;
