import * as React from "react";
import { NavLink } from "react-router-dom";
import "../../assets/scss/style.scss";
import img404 from "../../assets/images/maintenance/404.png";
import Breadcrumb from "../../components/Breadcrumb";

const Error = () => {
  return (
    <>
      <Breadcrumb />
      <div className="auth-wrapper maintenance">
        <div className="container">
          <div className="row justify-content-center">
            <div className="text-center">
              <img src={img404} alt="" className="img-fluid" />
              <h5 className="text-muted mb-4">Oops! Page not found!</h5>
              <NavLink to="/" className="btn btn-danger mb-4">
                <i className="feather icon-home mr-2" />
                Home
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Error;
