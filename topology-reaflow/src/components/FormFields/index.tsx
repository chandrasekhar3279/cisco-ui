import { Col, Form } from "react-bootstrap";
import { FormTextField } from "components";

interface FormFieldProps {
  values?: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

const FormFields = ({ values, setFieldValue }: FormFieldProps) => {
  return (
    <Form.Row>
      {/* <FormTextField
        required
        as={Col}
        xs="12"
        controlId="validationFormik01"
        label="Account Name"
        type="text"
        name="accountName"
      />

      <FormTextField
        as={Col}
        xs="12"
        controlId="validationFormik02"
        label="Description"
        type="textarea"
        name="description"
      /> */}
      {/* -- Will be used for future use
            
            <Col xs="12">
                <Row>
                    <Col xs="12">
                        <FormLabel>Account Type</FormLabel>
                    </Col>
                    <Col xs="12">
                        <ToggleButtonGroup type="radio" name="options">
                            <ToggleButton
                                onChange={() => setFieldValue("accountType", "root-user")}
                                id="tbg-radio-1"
                                value={1}
                            >
                                Root User
                            </ToggleButton>
                            <ToggleButton
                                onChange={() => setFieldValue("accountType", "iam-user")}
                                id="tbg-radio-2"
                                value={2}
                            >
                                IAM User
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>
            </Col> */}

      {/* {values.accountType === "root-user" && (
        <>
          <FormTextField
            required
            as={Col}
            xs="12"
            controlId="validationFormik05"
            label="Email"
            type="email"
            name="email"
          />

          <FormTextField
            required
            as={Col}
            xs="12"
            controlId="validationFormik05"
            label="Password"
            type="password"
            name="password"
          />
        </>
      )} */}
      {/* {values.accountType === "iam-user" && (
        <>
          <FormTextField
            required
            as={Col}
            xs="12"
            controlId="validationFormikAccount"
            label="AWS Account ID"
            type="text"
            name="awsAccountId"
          />

          <FormTextField
            required
            as={Col}
            xs="12"
            controlId="validationFormikUsername"
            label="IAM Username"
            type="text"
            name="awsIAMUser"
          />
          <FormTextField
            required
            as={Col}
            xs="12"
            controlId="validationFormikIAMPassword"
            label="Password"
            type="password"
            name="awsIAMPassword"
          />
        </>
      )} */}

      {values.connectName === "cloudFabric" && (
        <>
          <FormTextField
            required
            as={Col}
            xs="12"
            hideError
            controlId="validationFormikAccount"
            label="Stack Name"
            type="text"
            name="stackName"
          />
          <FormTextField
            required
            as={Col}
            xs="12"
            hideError
            controlId="validationFormikUsername"
            label="CFaaS Account ID"
            type="text"
            name="cfaasAccountID"
          />
          <FormTextField
            required
            as={Col}
            hideError
            xs="12"
            controlId="validationFormikUsername"
            label="IAM Role Name"
            type="text"
            name="iamRoleName"
          />
        </>
      )}
    </Form.Row>
  );
};

export default FormFields;
