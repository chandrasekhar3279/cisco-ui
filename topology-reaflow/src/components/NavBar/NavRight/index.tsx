import { Dropdown } from "react-bootstrap";
import DEMO from "../../../store/constant";
import userProfile from "../../../assets/images/user/profile.jpg";

const NavRight = (props: { rtlLayout: any }) => {
  return (
    <>
      <ul className="navbar-nav ms-auto top-right-nav">
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
                <img
                  src={userProfile}
                  className="img-radius"
                  alt="User Profile"
                />
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
