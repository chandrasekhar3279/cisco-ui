export interface StepProps {
    currentStep?: number,
    stepIndex?: number,
    cantBack?: boolean,
    isInFinalStep?: boolean,
    backHandler?: () => void,
    nextHandler?: () => void,
    isFinished?: boolean
}
 

