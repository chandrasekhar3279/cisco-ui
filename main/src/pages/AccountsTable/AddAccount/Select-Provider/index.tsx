import { useEffect, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import awsicon from "../../../../assets/images/add-account/aws-icon.svg";
import azureicon from "../../../../assets/images/add-account/azure-icon.svg";
import gcpicon from "../../../../assets/images/add-account/gcp-icon.svg";
import { StepProps } from "../../../../interfaces/StepProps";
import * as actionTypes from "../../../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import FooterActions from "../FooterActions";

const schema = Yup.object().shape({
  cloudProvider: Yup.string()
    .required()
    .oneOf(
      ["AWS", "Azure", "GCP"],
      "Selecting the cloudProvider field is required"
    ),
});

const SelectProvider = (props: StepProps) => {
  const [data, setData] = useState({
    cloudProvider: "",
  });

  const dispatch = useDispatch();
  const accountData = useSelector((state: any) => state.account);

  useEffect(() => {
    accountData.cloudProvider &&
      setData({ cloudProvider: accountData.cloudProvider });
  }, [accountData.cloudProvider]);

  return (
    <div className="select-providers">
      <Row>
        <Col xl={12} md={12} className="expanded-div">
          <h1>Let's get started</h1>
          <div className="visual-placeholder">
            <h3>Visual Placeholder</h3>
          </div>
          <p className="steps-text">
            Cisco Cloud Fabric helps you gain a complete picture of your
            multi-cloud infrastructure. The hrst step to using Cloud Fabric is
            adding an account from your cloud provider
          </p>
          <p className="steps-text mb-5">
            Let's kick by telling us which cloud provider do you want to add an
            account from?
          </p>
        </Col>
        <Col xl={12} md={12}>
          <div>
            <Formik
              enableReinitialize
              validationSchema={schema}
              onSubmit={(values) => {
                dispatch({
                  type: actionTypes.SET_DATA_FOR_ADD_ACCOUNT,
                  data: values.cloudProvider,
                  key: "cloudProvider",
                });
                props.nextHandler && props.nextHandler();
              }}
              initialValues={data}
            >
              {({
                handleSubmit,
                values,
                errors,
                handleChange,
                isValid,
                isSubmitting,
                setFieldValue,
                touched,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group>
                    <div className="provider-cards">
                      <div
                        className={
                          "aws-box" +
                          (values.cloudProvider === "AWS"
                            ? " current-selection"
                            : "")
                        }
                        onClick={() => setFieldValue("cloudProvider", "AWS")}
                        data-testid="select-cloud-aws"
                      >
                        <Form.Check
                          // inline
                          custom
                          checked={values.cloudProvider === "AWS"}
                          type="radio"
                          onChange={handleChange}
                          value="AWS"
                          name="cloudProvider"
                          id="cloudProvider21"
                        />
                        <img
                          className="mt-5 provider-image"
                          src={awsicon}
                          alt="aws"
                        />
                        <h4 className="provider-card-title">Amazon AWS</h4>
                      </div>
                      <div
                        className={
                          "azure-box" +
                          (values.cloudProvider === "Azure"
                            ? " current-selection"
                            : "")
                        }
                        onClick={() => setFieldValue("cloudProvider", "Azure")}
                        data-testid="select-cloud-azure"
                      >
                        <Form.Check
                          // inline
                          custom
                          checked={values.cloudProvider === "Azure"}
                          value="Azure"
                          type="radio"
                          onChange={handleChange}
                          label=""
                          name="cloudProvider"
                          id="cloudProvider22"
                        />
                        <img
                          className="mt-5 provider-image"
                          src={azureicon}
                          alt="azure"
                        />
                        <h4 className="provider-card-title">Microsoft Azure</h4>
                      </div>
                      <div
                        className={
                          "gcloud-box" +
                          (values.cloudProvider === "GCP"
                            ? " current-selection"
                            : "")
                        }
                        onClick={() => setFieldValue("cloudProvider", "GCP")}
                        data-testid="select-cloud-gcp"
                      >
                        <Form.Check
                          // inline
                          custom
                          checked={values.cloudProvider === "GCP"}
                          type="radio"
                          onChange={handleChange}
                          value="GCP"
                          label=""
                          isInvalid={!!errors.cloudProvider}
                          name="cloudProvider"
                          id="cloudProvider23"
                        />
                        <img
                          className="mt-5 provider-image"
                          src={gcpicon}
                          alt="gcp"
                        />
                        <h4 className="provider-card-title">
                          Google Cloud Platform
                        </h4>
                      </div>
                    </div>
                  </Form.Group>
                  {/* <Col>
                                    <pre style={{ margin: "0 auto" }}>
                                        {JSON.stringify(
                                            { ...values, ...errors, isValid, isSubmitting, touched },
                                            null,
                                            2
                                        )}
                                    </pre>
                                </Col> */}
                  <FooterActions
                    {...props}
                    nextHandler={undefined}
                    noPrevious={true}
                    disabled={!values.cloudProvider}
                  />
                </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SelectProvider;
