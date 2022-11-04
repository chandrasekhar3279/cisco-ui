import { Link } from "react-router-dom";
import ciscologo from "../../../assets/cisco-logo.png";

const NavLeft = () => {
  return (
    <div style={{ alignItems: "center" }} className="d-flex">
      <span className="ms-3">
        <Link to="/">
          <img src={ciscologo} className="ciscologo" alt="" />
        </Link>
      </span>
      <h4 className="app-title ms-3">Cloud Fabric</h4>
    </div>
  );
};
export default NavLeft;
