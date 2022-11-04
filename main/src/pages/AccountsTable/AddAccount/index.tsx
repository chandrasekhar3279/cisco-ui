import Stepper from "components/Steps";
import * as React from "react";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { StepProps } from "../../../interfaces/StepProps";
import DEMO from "../../../store/constant";
import Access from "./Access";
//import AccountDetails from "./AccountDetails/AccountDetails";
import Regions from "./Regions";
import SelectProvider from "./Select-Provider";

interface AddAccountProps {
  reRenderAfterPopup: () => void;
}

const Step1 = (props: StepProps) => {
  return (
    <div className="sw-container tab-content">
      <div className="step-content">
        <SelectProvider {...props} />
      </div>
    </div>
  );
};

// const Step2 = (props: StepProps) => {
//   return (
//     <div className="sw-container tab-content">
//       <div className="step-content">
//         <AccountDetails {...props} />
//       </div>
//     </div>
//   );
// };
const Step3 = (props: StepProps) => {
  return (
    <div className="sw-container tab-content">
      <div className="step-content">
        <Access {...props} />
      </div>
    </div>
  );
};

const Step4 = (props: StepProps) => {
  React.useEffect(() => {
    props.nextHandler && props.nextHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sw-container tab-content">
      <div className="step-content"></div>
    </div>
  );
};

// const Step5 = (props: StepProps) => {
//     return (
//         <div className="sw-container tab-content">
//             <div className="step-content">
//                 <Regions />
//             </div>
//         </div>
//     );
// };

const customSteps = [
  {
    label: "1",
    caption: "Provider",
    icon: <i className="fab fa-accusoft" />,
    component: Step1,
  },
  {
    label: "2",
    caption: "Account Details",
    icon: <i className="fa fa-lock" />,
    component: Step3,
  },
  // {
  //   label: "3",
  //   caption: "Access",
  //   icon: <i className="fa fa-envelope" />,
  //   component: Step3,
  // },
  {
    label: "3",
    caption: "Regions",
    icon: <i className="fa fa-lock" />,
    component: Step4,
  },
];

const AddAccount: React.FC<AddAccountProps> = (props) => {
  const [isFinished, setIsFinished] = useState(false);

  const customRenderer = ({
    currentStep,
  }: // stepIndex,
  // cantBack,
  // isInFinalStep,
  // backHandler,
  // nextHandler,
  StepProps) => {
    let i = 0;
    const steps = customSteps.map((step, index) => {
      const isActive = currentStep === index + 1;
      let itemLinkClass = ["nav-item mb-10"];
      if (isActive) {
        itemLinkClass = [...itemLinkClass, "active"];
        i = 1;
      } else if (i === 0 || isFinished) {
        itemLinkClass = [...itemLinkClass, "done"];
      }
      return (
        <li key={index} className={itemLinkClass.join(" ")}>
          <a href={DEMO.BLANK_LINK} className="nav-link disabled">
            <h6>
              <span>{step.label}</span>
            </h6>
            <p className="m-0">{step.caption}</p>
          </a>
        </li>
      );
    });
    return <ul className="nav nav-tabs step-anchor">{steps}</ul>;
  };

  const customComponents = (props: StepProps) => {
    return customSteps.map((step, index) => {
      if (props.currentStep === index + 1) {
        return (
          <div key={index}>
            <step.component {...props} />
          </div>
        );
      }
      return false;
    });
  };

  const handleClose = () => {
    props.reRenderAfterPopup();
  };

  const onFinish = () => {
    setIsFinished(true);
    //
  };

  const reOpen = () => {
    setIsFinished(false);
  };

  return (
    <>
      {!isFinished ? (
        <Row>
          <Col>
            <div className="sw-main sw-theme-default">
              <Stepper
                steps={customSteps}
                renderComponents={customComponents}
                renderSteps={customRenderer}
                onFinish={onFinish}
                noActions={true}
              />
            </div>
          </Col>
        </Row>
      ) : (
        <Regions reOpen={reOpen} handleClose={handleClose} />
      )}
    </>
  );
};

export default AddAccount;
