import { Formik } from "formik";
import * as yup from "yup";
import { Col, Form, Row } from "react-bootstrap";
import * as actionTypes from "store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { StepProps } from "interfaces/StepProps";
import FooterActions from "../FooterActions";
import FormFields from "components/FormFields";

const schema = yup.object({
  accountName: yup.string().required("Account Name is required"),
  description: yup.string(),
  accountType: yup.string().required(),
  email: yup.string().when("accountType", {
    is: (accountType: string | undefined) => {
      return accountType === "root-user";
    },
    then: yup.string().email("Enter a valid email").required(),
  }),
  password: yup.string().when("accountType", {
    is: (accountType: string | undefined) => {
      return accountType === "root-user";
    },
    then: yup.string().required(),
  }),
  awsAccountId: yup.string().when("accountType", {
    is: (accountType: string | undefined) => {
      return accountType === "iam-user";
    },
    then: yup.string().required("This is a required field"),
  }),
  awsIAMUser: yup.string().when("accountType", {
    is: (accountType: string | undefined) => {
      return accountType === "iam-user";
    },
    then: yup.string().required("This is a required field"),
  }),
  awsIAMPassword: yup.string().when("accountType", {
    is: (accountType: string | undefined) => {
      return accountType === "iam-user";
    },
    then: yup.string().required("This is a required field"),
  }),
});

function AccountDetails(props: StepProps) {
  const dispatch = useDispatch();
  const accountData = useSelector((state: any) => state.account);

  return (
    <div className="select-account-details">
      <Row>
        <Col xl={12} md={12} className="decreased-div">
          <h1>Next, lets get your account details</h1>
          <p className="steps-text">
            Let's get your account credentials now. You can either add a root or
            lAM user for this acccount.
          </p>
        </Col>
        <Col lg={12}>
          <Formik
            enableReinitialize
            validationSchema={schema}
            onSubmit={(values) => {
              dispatch({
                type: actionTypes.SET_DATA_FOR_ADD_ACCOUNT,
                data: values,
                key: "accountDetails",
              });
              props.nextHandler && props.nextHandler();
            }}
            initialValues={accountData}
            validateOnMount
          >
            {({
              handleSubmit,
              values,
              errors,
              isValid,
              isSubmitting,
              setFieldValue,
            }) => (
              <div className="account-details-gray-background">
                <Form noValidate onSubmit={handleSubmit} className="form-size">
                  <div className="general-style">
                    <div className="account-details-white-background">
                      <Col lg={6} className="">
                        <FormFields
                          values={values}
                          setFieldValue={setFieldValue}
                        />
                      </Col>
                      <Col></Col>
                    </div>
                  </div>
                  <Col lg={12}>
                    <FooterActions
                      submitLabel="Next"
                      {...props}
                      disabled={!isValid || isSubmitting}
                      nextHandler={undefined}
                    />
                  </Col>

                  {/* <Col xs={12}>
                                <Button
                                    style={{ marginTop: '20px' }}
                                    disabled={!isValid || isSubmitting}
                                    variant="success"
                                    as="input"
                                    size="lg"
                                    type="submit"
                                    value="Submit"
                                />
                            </Col>
                            
*/}
                  {/* <Col>
                                    <pre style={{ margin: "0 auto" }}>
                                        {JSON.stringify(
                                            { ...values, ...errors, isValid, isSubmitting, touched },
                                            null,
                                            2
                                        )}
                                    </pre>
                                </Col> */}
                </Form>
              </div>
            )}
          </Formik>
        </Col>
      </Row>
    </div>
  );
}

export default AccountDetails;
