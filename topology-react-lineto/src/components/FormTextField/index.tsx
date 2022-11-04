import { FieldProps, Field } from "formik";

import React from "react";
import { Form, InputGroup } from "react-bootstrap";

interface FormTextFieldPorps {
  as?: React.ElementType | undefined;
  xs?: string | undefined;
  controlId?: string | undefined;
  label?: string | undefined;
  name?: string | undefined;
  type?: string | undefined;
  inputGroupPrepend?: React.ReactNode;
  required?: boolean;
  hideError?: boolean;
  className?: string;
}

const FormTextField = ({
  as,
  xs,
  controlId,
  label,
  name,
  type,
  required,
  inputGroupPrepend,
  hideError,
  className,
}: FormTextFieldPorps) => {
  let obj: any = {};
  if (type === "textarea") {
    obj.rows = "1";
    obj.as = "textarea";
  }
  return (
    <Field
      name={name}
      render={({ field, form }: FieldProps) => {
        const isValid = !form.errors[field.name];
        const isInvalid = form.touched[field.name] && !isValid;

        return (
          <Form.Group
            className={className}
            as={as}
            xs={xs}
            controlId={controlId}
          >
            <Form.Label>
              {label}&nbsp;{required && <span style={{ color: "red" }}>*</span>}
            </Form.Label>
            <InputGroup>
              {inputGroupPrepend}
              <Form.Control
                {...field}
                {...obj}
                type={type}
                isValid={
                  hideError ? false : form.touched[field.name] && isValid
                }
                isInvalid={hideError ? false : isInvalid}
                feedback={form.errors[field.name]}
              />
              <Form.Control.Feedback type="invalid">
                {form.errors[field.name]}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        );
      }}
    />
  );
};

FormTextField.defaultProps = {
  type: "text",
  inputGroupPrepend: null,
  required: false,
};

export default FormTextField;
