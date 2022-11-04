import { Button, Col } from "react-bootstrap";
import { StepProps } from "../../../../interfaces/StepProps";
import "./FooterActions.scss";

interface OtherProps extends StepProps {
  disabled?: boolean;
  noPrevious?: boolean;
  submitLabel?: string;
  previousLabel?: string;
}

const FooterActions = ({
  noPrevious,
  previousLabel,
  submitLabel,
  backHandler,
  nextHandler,
  disabled,
}: OtherProps) => {
  const onClick = nextHandler ? nextHandler : () => {};
  return (
    <Col xs={12} className="footer-actions">
      <div className="btn-toolbar sw-toolbar sw-toolbar-bottom justify-content-end">
        {!noPrevious && (
          <Button
            className=" footer-button footer-left-button"
            onClick={backHandler}
          >
            {previousLabel ? previousLabel : "Previous"}
          </Button>
        )}
        <Button
          className="footer-button footer-right-button"
          variant="primary"
          type="submit"
          disabled={disabled}
          {...{ onClick }}
        >
          {submitLabel ? submitLabel : "Next"}
        </Button>
      </div>
    </Col>
  );
};

export default FooterActions;
