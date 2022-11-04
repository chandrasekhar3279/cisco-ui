import PropTypes from "prop-types";

interface StepProps {
  currentStep: any;
  stepsDone: any[];
  totalSteps: any;
  step: any;
  isStepComplete: any;
  goTo: (value: any) => void;
}

const Step = ({
  currentStep,
  // stepsDone,
  // totalSteps,
  step,
  isStepComplete,
  goTo,
}: StepProps) => {
  const isActive = currentStep === step.index;
  const isComplete = currentStep > step.index;
  const isDisabled: boolean = !isActive && !isComplete ? true : false;

  return (
    <li
      className={`StepperStep ${isActive && "StepperStep-Active"} ${
        (isComplete || isStepComplete) && "StepperStep-Complete"
      }`}
    >
      <div
        onClick={(event) => {
          event.preventDefault();

          if (isDisabled) {
            return;
          }

          goTo(step.index);
        }}
        className={`StepperStep-Link ${isDisabled && "disabled"}`}
      >
        <div className="StepperStep-Icon">{step.icon || step.index}</div>
      </div>
    </li>
  );
};

Step.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
  step: PropTypes.object.isRequired,
  isStepComplete: PropTypes.bool.isRequired,
};

export default Step;
