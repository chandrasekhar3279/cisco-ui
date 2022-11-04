import * as React from "react";
import ciscologo from "../../../assets/cisco-logo.png";

const NavLeft = () => {
  return (
    <div style={{ alignItems: "center" }} className="d-flex">
      <span className="ml-3">
        <img src={ciscologo} className="ciscologo" alt="" />
      </span>
      <h4 className="app-title ml-3">Cloud Fabric</h4>
    </div>
  );
};
export default NavLeft;
