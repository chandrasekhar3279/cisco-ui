import * as React from "react";
import { Dropdown } from "react-bootstrap";

import DEMO from "../../../store/constant";
import Avatar1 from "../../../assets/images/user/avatar-1.jpg";

import NavSearch from "./NavSearch";
const NavRight = (props: { rtlLayout: any }) => {
  return (
    <>
      <ul className="navbar-nav ml-auto top-right-nav">
        {/* <li>
          <a href="#." className="ico">
            <i className="far fa-dot-circle" />
          </a>
        </li> */}
        {/* <li className="nav-item">
          <NavSearch />
        </li> */}
        {/* <li>
          <a href="#." className="ico">
            <i className="fas fa-bullseye" />
          </a>
        </li>
        <li>
          <a href="#." className="ico">
            <i className="far fa-bookmark" />
          </a>
        </li>
        <li>
          <a href="#." className="ico">
            <i className="feather icon-settings icon" />
          </a>
        </li> */}
        <li>
          <Dropdown
            drop={!props.rtlLayout ? "left" : "right"}
            className="dropdown"
            alignRight={!props.rtlLayout}
          >
            <Dropdown.Toggle variant={"link"} id="dropdown-basic">
              <i className="icon feather icon-user" />
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight className="profile-notification">
              <div className="pro-head bg-dark">
                <img src={Avatar1} className="img-radius" alt="User Profile" />
                <span>John Doe</span>
                <a href={DEMO.BLANK_LINK} className="dud-logout" title="Logout">
                  <i className="feather icon-log-out" />
                </a>
              </div>
              <ul className="pro-body">
                <li>
                  <a href={DEMO.BLANK_LINK} className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                  </a>
                </li>
                <li>
                  <a href={DEMO.BLANK_LINK} className="dropdown-item">
                    <i className="feather icon-log-out" /> Logout
                  </a>
                </li>
              </ul>
            </Dropdown.Menu>
          </Dropdown>
        </li>
      </ul>
    </>
  );
};
export default NavRight;
