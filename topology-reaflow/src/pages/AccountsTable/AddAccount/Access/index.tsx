import { useState, Fragment } from "react";
import {
  Formik,
  //validateYupSchema,
  FieldArray,
  //Field,
  // ErrorMessage,
} from "formik";
import * as yup from "yup";
// import FormFields from "components/FormFields";
//import { Button } from 'primereact/button';
import { Card, CardGroup, Image, Form, Row, Col } from "react-bootstrap";
import cloudimage from "assets/images/add-account/cloudimage.png";
import awsicon from "assets/images/add-account/aws-icon.svg";
import azureicon from "assets/images/add-account/azure-icon.svg";
import gcpicon from "assets/images/add-account/gcp-icon.svg";
import { StepProps } from "interfaces/StepProps";
import * as actionTypes from "store/actions";
import FormTextField from "components/FormTextField";
import { useDispatch } from "react-redux";
import DailogBox from "../DialogBox/DailogBox";
import FooterActions from "../FooterActions";
import { useSelector } from "react-redux";
import UploadFile from "./UploadFile";
// import { Dropdown } from "primereact/dropdown";

// interface Creds {
//   id?: string;
//   secret?: string;
//   edit?: boolean;
//   valid?: boolean;
// }

const credsSchema = yup.object({
  id: yup.string().required().min(1),
  secret: yup.string().required(),
  adId: yup.string().required(),
});

const schema = yup.object({
  connectName: yup
    .string()
    .required()
    .oneOf(
      ["cloudFabric", "accessKeys"],
      "Selecting the Connect name field is required"
    ),

  accountName: yup.string().when("connectName", {
    is: (connectName: string | undefined) => {
      return connectName === "accessKeys";
    },
    then: yup.string().optional(),
    // then: yup.string().required("Account Name is required"),
    otherwise: yup.string().optional(),
  }),
  description: yup.string().optional(),
  accountType: yup.string().when("connectName", {
    is: (connectName: string | undefined) => {
      return connectName === "cloudFabric";
    },
    then: yup.string().required("This is a required field"),
    otherwise: yup.string().optional(),
  }),
  awsAccountId: yup.string().when("connectName", {
    is: (connectName: string | undefined) => {
      return connectName === "accessKeys";
    },
    then: yup.string().required("This is a required field"),
    otherwise: yup.string().optional(),
  }),
  // email: yup.string().when(["connectName", "accountType"], {
  //   is: (connectName: string | undefined, accountType: string | undefined) => {
  //     return accountType === "root-user" && connectName === "cloudFabric";
  //   },
  //   then: yup
  //     .string()
  //     .email("Enter a valid email")
  //     .required("This is a required field"),
  //   otherwise: yup.string().optional(),
  // }),
  // password: yup.string().when(["connectName", "accountType"], {
  //   is: (connectName: string | undefined, accountType: string | undefined) => {
  //     return accountType === "root-user" && connectName === "cloudFabric";
  //   },
  //   then: yup.string().required("This is a required field"),
  //   otherwise: yup.string().optional(),
  // }),
  // awsAccountId: yup.string().when(["connectName", "accountType"], {
  //   is: (connectName: string | undefined, accountType: string | undefined) => {
  //     return accountType === "iam-user" && connectName === "cloudFabric";
  //   },
  //   then: yup.string().required("This is a required field"),
  //   otherwise: yup.string().optional(),
  // }),
  // awsIAMUser: yup.string().when(["connectName", "accountType"], {
  //   is: (connectName: string | undefined, accountType: string | undefined) => {
  //     return accountType === "iam-user" && connectName === "cloudFabric";
  //   },
  //   then: yup.string().required("This is a required field"),
  //   otherwise: yup.string().optional(),
  // }),
  // awsIAMPassword: yup.string().when(["connectName", "accountType"], {
  //   is: (connectName: string | undefined, accountType: string | undefined) => {
  //     return accountType === "iam-user" && connectName === "cloudFabric";
  //   },
  //   then: yup.string().required("This is a required field"),
  //   otherwise: yup.string().optional(),
  // }),
  credentials: yup.array().when("connectName", {
    is: (connectName: string | undefined) => {
      return connectName === "accessKeys";
    },
    then: yup.array().of(credsSchema).required(),
  }),
  // stackName: yup.string().when("connectName", {
  //   is: (connectName: string) => {
  //     return connectName === "cloudFabric";
  //   },
  //   then: yup.string().required("This is a required field"),
  // }),
  // cfaasAccountID: yup.string().when("connectName", {
  //   is: (connectName: string) => {
  //     return connectName === "cloudFabric";
  //   },
  //   then: yup.string().required("This is a required field"),
  // }),
  // iamRoleName: yup.string().when("connectName", {
  //   is: (connectName: string) => {
  //     return connectName === "cloudFabric";
  //   },
  //   then: yup.string().required("This is a required field"),
  // }),
  // region: yup.string().when("connectName", {
  //   is: (connectName: string) => {
  //     return connectName === "cloudFabric";
  //   },
  //   then: yup.string().required("This is a required field"),
  // })
});

const Access = ({ nextHandler, ...others }: StepProps) => {
  const [showDailogBox, setShowDailogBox] = useState(false);
  const dispatch = useDispatch();
  const accountData = useSelector((state: any) => state.account);
  const isDisabled = true;

  // const regions = [
  //   { value: "us-east-1", label: "US East (N. Virginia)" },
  //   { value: "us-east-2", label: "US East (Ohio)" },
  //   { value: "us-west-1", label: "US West (N. California)" },
  //   { value: "us-west-2", label: "US West (Oregon)" },
  //   { value: "ca-central-1", label: "Canada (Central)" },
  //   { value: "eu-west-1", label: "EU (Ireland)" },
  //   { value: "eu-central-1", label: "EU (Frankfurt)" },
  //   { value: "eu-west-2", label: "EU (London)" },
  //   { value: "eu-west-3", label: "EU (Paris)" },
  //   { value: "eu-north-1", label: "EU (Stockholm)" },
  //   { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)" },
  //   { value: "ap-northeast-2", label: "Asia Pacific (Seoul)" },
  //   { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
  //   { value: "ap-southeast-2", label: "Asia Pacific (Sydney)" },
  //   { value: "ap-south-1", label: "Asia Pacific (Mumbai)" },
  //   { value: "sa-east-1", label: "South America (São Paulo)" },
  //   { value: "us-gov-west-1", label: "US Gov West 1" },
  //   { value: "us-gov-east-1", label: "US Gov East 1" },
  // ];

  const submitHandler = () => {
    setShowDailogBox(true);
  };

  const finalAction = () => {
    nextHandler && nextHandler();
  };

  // const validateKeys = (values: Creds) => {
  //   // if (values.id === values.secret) {
  //   //   alert("valid")
  //   // } else {
  //   //   alert("invalid")
  //   // }
  // };

  return (
    <div className="select-access">
      {showDailogBox && (
        <DailogBox
          data={accountData}
          nextHandler={finalAction}
          show={showDailogBox}
          {...{ dispatch, setShowDailogBox }}
        />
      )}
      <Row>
        <Col xl={12} md={12}>
          <h1>Now lets setup access to your account</h1>
        </Col>
        <Col xl={12} md={12}>
          <ul className="selected-provider mb-4">
            <li>
              <div className="img-holder"></div>
              <div className="arrows">
                <div className="arrow">
                  <span>
                    <img
                      src={
                        accountData.cloudProvider === "AWS"
                          ? awsicon
                          : accountData.cloudProvider === "Azure"
                          ? azureicon
                          : gcpicon
                      }
                      alt="cloud"
                    />
                  </span>
                </div>
              </div>
            </li>
            <li>
              <div className="img-holder"></div>
              <div className="arrows">
                <div className="arrow">
                  <span>
                    <span>CF</span>
                  </span>
                </div>
              </div>
            </li>
          </ul>
          <p className="steps-text">
            You have two ways to connect your account to Cloud Fabric. You can
            enter you cloud account credentials and Cloud Fabric will connect to
            your accoun and run a stack on your account to handle all the
            permission configurations needed. Alternatively, you can provide
            access keys you already created on your cloud provider portal.
            Either option will get you connected in just a few clicks!
          </p>
        </Col>
      </Row>

      <Formik
        validationSchema={schema}
        validateOnMount
        onSubmit={(values, actions) => {
          dispatch({
            type: actionTypes.SET_DATA_FOR_ADD_ACCOUNT,
            data: values,
            key: "access",
          });
          actions.setSubmitting(false);
          submitHandler();
        }}
        initialValues={{
          connectName: "accessKeys",
          accountName: "",
          description: "",
          accountType: "iam-user",
          email: "",
          password: "",
          awsAccountId: "",
          awsIAMUser: "",
          awsIAMPassword: "",
          credentials: [
            {
              id: accountData.cloudProvider === "GCP" ? "a" : "",
              secret: "",
              valid: false,
              adId: accountData.cloudProvider === "Azure" ? "" : "a",
              edit: false,
            },
          ],
          stackName: "",
          cfaasAccountID: "",
          iamRoleName: "",
          region: "",
        }}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          errors,
          isValid,
          touched,
          isSubmitting,
          setFieldValue,
        }) => (
          <div className="access-details-background">
            <Form noValidate onSubmit={handleSubmit}>
              <Row className="access-keys-background">
                <Col xs={12} className="my-3">
                  <CardGroup>
                    <Card
                      className={
                        "custom-card shadow-none border" +
                        (values.connectName === "accessKeys"
                          ? " current-selection"
                          : "")
                      }
                      onClick={() => {
                        setFieldValue("connectName", "accessKeys");
                      }}
                    >
                      <Card.Body>
                        <div className="imgicon">
                          <Image src={cloudimage} className="cloudImageStyle" />
                        </div>
                        <div className="card-content">
                          <Card.Title className="card-title-style form-heading">
                            <h5>
                              Provide {accountData.cloudProvider} Access Keys
                            </h5>
                          </Card.Title>
                          <Card.Text className="card-text-style">
                            Add already created access keys to Cloud Fabric that
                            will grant access to your account to make
                            programmatic calls to {accountData.cloudProvider}
                          </Card.Text>
                        </div>
                        <div className="check-rdo">
                          <Form.Group>
                            <Form.Check
                              custom
                              type="radio"
                              onChange={handleChange}
                              checked={values.connectName === "accessKeys"}
                              name="connectName"
                              value="accessKeys"
                              id="connectName22"
                              className="access-rdo"
                            />
                          </Form.Group>
                        </div>
                      </Card.Body>
                    </Card>
                    <Card
                      className={
                        `custom-card ${
                          accountData.cloudProvider === "AWS" ? "" : "disabled"
                        } border shadow-none` +
                        (values.connectName === "cloudFabric"
                          ? " current-selection"
                          : "")
                      }
                      onClick={() => {
                        accountData.cloudProvider === "AWS" &&
                          setFieldValue("connectName", "cloudFabric");
                      }}
                      data-testid="connect-name"
                    >
                      <Card.Body>
                        <div className="imgicon">
                          <Image src={cloudimage} className="cloudImageStyle" />
                        </div>
                        <div className="card-content">
                          <Card.Title className="card-title-style form-heading">
                            <h5>Use Cloud Formation Template to connect</h5>
                          </Card.Title>
                          <Card.Text className="card-text-style">
                            Run a Stack on {accountData.cloudProvider} to handle
                            all the details to connect to Cloud Fabric
                          </Card.Text>
                        </div>
                        <div className="check-rdo ">
                          <Form.Group>
                            <Form.Check
                              // inline
                              custom
                              disabled={
                                accountData.cloudProvider === "AWS"
                                  ? !isDisabled
                                  : isDisabled
                              }
                              type="radio"
                              onChange={handleChange}
                              checked={values.connectName === "cloudFabric"}
                              name="connectName"
                              id="connectName21"
                              value="cloudFabric"
                              className="access-rdo"
                            />
                          </Form.Group>
                        </div>
                      </Card.Body>
                    </Card>
                  </CardGroup>
                </Col>
                {values.connectName === "accessKeys" && (
                  <Col xs="6">
                    <Row>
                      <FormTextField
                        hideError
                        required
                        as={Col}
                        xs="12"
                        controlId="validationFormikAccount"
                        label="Account ID"
                        type="text"
                        name="awsAccountId"
                      />
                      <FormTextField
                        hideError
                        as={Col}
                        xs="12"
                        controlId="validationFormik01"
                        label="Account Name"
                        type="text"
                        name="accountName"
                      />
                      <FormTextField
                        hideError
                        as={Col}
                        xs="12"
                        controlId="validationFormik02"
                        label="Description"
                        type="textarea"
                        name="description"
                      />
                    </Row>
                  </Col>
                )}
                {/* {
                  values.connectName === "cloudFabric" &&
                  accountData.cloudProvider === "AWS" &&
                  (
                    <>
                      <Row>
                        <Col
                          sm={6}
                          xs={12}
                          style={{ backgroundColor: "white" }}
                        >
                          <FormFields
                            values={values}
                            setFieldValue={setFieldValue}
                          />
                          <div className="select-region">
                            <div className="mb-2 d-block">
                              <label htmlFor="region">Region &nbsp;</label>
                              <span style={{ color: "red" }}>*</span>
                            </div>
                            <Dropdown
                              id="region"
                              options={regions}
                              value={values.region}
                              onChange={handleChange}
                              className="w-100"
                              optionLabel="label"
                              placeholder="Select a region"
                              appendTo="self"
                            />
                          </div>
                        </Col>
                      </Row>
                    </>
                  )
                } */}
                {values.connectName === "accessKeys" && (
                  <Col xs={12} className="mb-3">
                    <h5 className="form-heading mt-2 mb-2">Credentials</h5>
                    <div className="access-keys-background no-padding">
                      {/* <Form.Group className="mb-0">
                        <Form.Label>
                          AWS Access Keys
                          <i className="pi pi-info-circle ml-2"></i>
                        </Form.Label>
                      </Form.Group> */}
                      {accountData.cloudProvider !== "GCP" && (
                        <FieldArray
                          name="credentials"
                          render={(arrayHelpers) => {
                            const creds = values.credentials;
                            return (
                              <>
                                {creds.map((item, index) => (
                                  <Fragment key={index}>
                                    <Row style={{ alignItems: "center" }}>
                                      {/* <Field
                                    className="form-control"
                                    name={`credentials.${index}.id`}
                                    placeholder="ID"
                                    type="text"
                                    onKeyPress={() => item.edit = true}
                                  />
                                  <ErrorMessage name={`credentials.${index}.id`} /> */}
                                      <FormTextField
                                        as={Col}
                                        required
                                        xs={
                                          accountData.cloudProvider === "Azure"
                                            ? "4"
                                            : "6"
                                        }
                                        controlId={`credentials.${index}.id`}
                                        type="text"
                                        label="Access Key ID"
                                        name={`credentials.${index}.id`}
                                      />

                                      <FormTextField
                                        as={Col}
                                        required
                                        xs={
                                          accountData.cloudProvider === "Azure"
                                            ? "4"
                                            : "6"
                                        }
                                        controlId={`credentials.${index}.secret`}
                                        type="text"
                                        label="Secret Access Key"
                                        name={`credentials.${index}.secret`}
                                      />

                                      {
                                        <FormTextField
                                          as={Col}
                                          className={
                                            accountData.cloudProvider ===
                                            "Azure"
                                              ? ""
                                              : "d-none"
                                          }
                                          required
                                          xs={
                                            accountData.cloudProvider ===
                                            "Azure"
                                              ? "4"
                                              : "6"
                                          }
                                          controlId={`credentials.${index}.adId`}
                                          type="text"
                                          label="Directory ID"
                                          name={`credentials.${index}.adId`}
                                        />
                                      }

                                      {/* <Field
                                  className="form-control"
                                  name={`credentials.${index}.secret`}
                                  placeholder="Secret"
                                  type="text"
                                />
                                <ErrorMessage name={`credentials.${index}.secret`} />
                              </Col> */}

                                      {/* <Col
                                      xs="2"
                                      style={{
                                        marginTop: "10px",
                                        display: "flex",
                                        justifyContent: "space-evenly",
                                      }}
                                    >
                                      <Form.Label>
                                        <i
                                          className="pi pi-check ml-2"
                                          onClick={() => validateKeys(item)}
                                        ></i>
                                      </Form.Label>
                                      <Form.Label
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
                                      >
                                        <i className="pi pi-times ml-2"></i>
                                      </Form.Label>
                                    </Col> */}
                                    </Row>
                                  </Fragment>
                                ))}
                                {/* <Form.Label
                                onClick={() =>
                                  arrayHelpers.push({
                                    id: "",
                                    secret: "",
                                    valid: false,
                                    edit: false,
                                  })
                                }
                                className="access-pointer"
                              >
                                <i className="pi pi-plus-circle m-2"></i>
                                Add AWS Access Key
                              </Form.Label> */}
                              </>
                            );
                          }}
                        />
                      )}
                      {accountData.cloudProvider === "GCP" && (
                        <UploadFile setFieldValue={setFieldValue} />
                      )}
                    </div>
                  </Col>
                )}
                <Col xs={12}>
                  <FooterActions
                    {...others}
                    submitLabel="Connect Account"
                    disabled={
                      values.connectName === "cloudFabric"
                        ? false
                        : !isValid || isSubmitting
                    }
                  />
                </Col>
              </Row>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default Access;
