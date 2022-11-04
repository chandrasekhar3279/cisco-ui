import React from "react";

interface StepContainerProps {
  children?: any;
}

const StepContainer = ({ children }: StepContainerProps) => (
  <ol className="StepperSteps">{children}</ol>
);

export default StepContainer;
