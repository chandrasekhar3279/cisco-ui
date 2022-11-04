import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Row, Col } from "react-bootstrap";
import "./DialogBox.scss";
import { addAccount, constructData } from "pages/AccountsTable/utils";

interface DailogBoxProps {
  show: boolean;
  setShowDailogBox: (value: boolean) => void;
  nextHandler?: () => void;
  data: any;
}

const DailogBox: React.FC<DailogBoxProps> = ({
  show,
  nextHandler,
  data,
  setShowDailogBox,
}) => {
  const [credLoader, setCredLoader] = useState("load");
  const [configLoader, setConfigLoader] = useState("load");

  const onHide = () => {
    setShowDailogBox(false);
  };

  const saveAccount = async () => {
    try {
      await addAccount(constructData(data));
      setConfigLoader("done");
      setCredLoader("done");
    } catch (err) {
      setConfigLoader("error");
      setCredLoader("error");
    }
  };

  useEffect(() => {
    show && saveAccount();
  }, [show]);

  useEffect(() => {
    if (configLoader === "done") {
      setTimeout(() => {
        onHide();
        nextHandler && nextHandler();
      }, 2000);
    } else if (configLoader === "error") {
      setTimeout(() => {
        onHide();
      }, 2000);
    }
  }, [configLoader]);

  const loader = () => (
    <i className="pi pi-spin p" style={{ fontSize: "2em" }}></i>
  );

  const showIcons = (iconStatus: string, count: number) => {
    if (iconStatus === "load") {
      return loader();
    } else if (iconStatus === "done") {
      return <i className="pi pi-check-circle" style={{ fontSize: "2em" }}></i>;
    } else if (iconStatus === "error") {
      return (
        <i className="pi pi-ban" style={{ fontSize: "2em", color: "red" }}></i>
      );
    } else {
      return (
        <i
          className="pi pi-circle pi-content"
          data-count={count}
          style={{ fontSize: "2em" }}
        ></i>
      );
    }
  };

  return (
    <Dialog
      className="dialog-box"
      closable={false}
      showHeader={false}
      draggable={false}
      visible={show}
      style={{ width: "40vw" }}
      onHide={onHide}
    >
      <div className="container pop-up-styles">
        <Row>
          <Col xs={6}>
            <div className="pi-element">
              {showIcons(credLoader, 1)} <div>Checking Credentilas</div>
            </div>
          </Col>
          <Col xs={6}>
            <div className="pi-element">
              {showIcons(configLoader, 2)} <div>Configuring access</div>
            </div>
          </Col>
          <Col
            xs={12}
            className="popup-content"
            style={{
              marginTop: "20px",
              paddingBottom: "0px",
              textAlign: "center",
            }}
          >
            {credLoader === "load" && configLoader === "load" && (
              <p className="text-center" style={{ fontSize: "1em" }}>
                Logging into account with the provided details...
              </p>
            )}
            {credLoader === "done" && configLoader === "load" && (
              <p className="text-center" style={{ fontSize: "1em" }}>
                Running a stack on your account to setup access for Cloud
                Fabric...
              </p>
            )}
            {credLoader === "done" && configLoader === "done" && (
              <p className="text-center" style={{ fontSize: "1em" }}>
                Account connection is complete!
              </p>
            )}
          </Col>
        </Row>
      </div>
    </Dialog>
  );
};
export default DailogBox;
