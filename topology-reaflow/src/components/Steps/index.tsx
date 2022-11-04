import React, { useState } from "react";
import PropTypes from "prop-types";
import Step from "./Step";
import "./styles/index.scss";
import StepContainer from "./StepContainer";

interface StepperProps {
  backLabel?: any;
  nextLabel?: any;
  finishLabel?: any;
  renderComponents: (data: any) => (false | JSX.Element)[];
  renderActions?: (data: any) => (false | JSX.Element)[];
  onBack?: (data: any) => void;
  onFinish?: (data: any) => void;
  onNext?: (data: any) => void;
  steps: any[];
  renderSteps?: any;
  noActions?: any;
}

const Stepper = ({
  backLabel = "Back",
  nextLabel = "Next",
  finishLabel = "Finish",
  renderComponents,
  ...others
}: StepperProps) => {
  const [currentStep, setCurrenStep] = useState(1);
  const [stepsDone, setStepsDone] = useState([]);
  const [complete, setComplete] = useState(false);

  const _back = (data: any) => {
    others.onBack && others.onBack(data);
    setCurrenStep(currentStep - 1);
  };

  function _next(data: any) {
    if (currentStep === others.steps.length) {
      others.onFinish(data);
      return setComplete(true);
    }

    others.onNext && others.onNext(data);
    setCurrenStep(currentStep + 1);
    setComplete(true);
    setStepsDone((prevState) => prevState.concat([currentStep]));
  }

  function _stepperData() {
    return {
      currentStep: currentStep,
      stepIndex: currentStep - 1,
      cantBack: currentStep === 1,
      isInFinalStep: currentStep === others.steps.length,
      backHandler: _back,
      nextHandler: _next,
    };
  }

  function _renderSteps() {
    if (!others.steps) {
      return;
    }

    if (others.renderSteps) {
      return others.renderSteps(_stepperData());
    }

    const steps = others.steps.map((step: any, index: number) => (
      <Step
        key={index}
        stepsDone={stepsDone}
        currentStep={currentStep}
        totalSteps={others.steps.length}
        step={{ ...step, index: index + 1 }}
        goTo={(newStep: any) => setCurrenStep(newStep)}
        isStepComplete={complete}
      />
    ));

    return <StepContainer>{steps}</StepContainer>;
  }

  function _renderComponents() {
    if (!others.steps) {
      return;
    }

    if (renderComponents) {
      return renderComponents(_stepperData());
    }

    const { stepIndex, cantBack, isInFinalStep, backHandler, nextHandler } =
      _stepperData();

    const component = others.steps[stepIndex].component;

    if (others.noActions) {
      return React.cloneElement(component, {
        isComplete: complete,
        backLabel,
        nextLabel: isInFinalStep ? finishLabel : nextLabel,
        cantBack,
        isInFinalStep,
        onBack: backHandler,
        onNext: nextHandler,
      });
    }

    return component;
  }

  function _renderActions() {
    // If we don't want the buttons we do not render them
    if (!others.steps || others.noActions) {
      return;
    }

    const cantBack = currentStep === 1;
    const isInFinalStep = currentStep === others.steps.length;

    // If we want custom actions we render them
    if (others.renderActions) {
      return others.renderActions(_stepperData());
    }

    return (
      <div className="Stepper-Actions">
        <button type="button" onClick={_back} disabled={cantBack || complete}>
          {backLabel}
        </button>
        <button type="button" onClick={_next} disabled={complete}>
          {isInFinalStep ? finishLabel : nextLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="Stepper">
      {_renderSteps()}
      {_renderComponents()}
      {_renderActions()}
    </div>
  );
};

Stepper.propTypes = {
  steps: PropTypes.array.isRequired,
  onFinish: PropTypes.func.isRequired,
};

export { Stepper as default, StepContainer, Step };
