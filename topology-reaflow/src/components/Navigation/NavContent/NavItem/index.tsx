import * as React from "react";
import { useDispatch } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import NavIcon from "../NavIcon";
import * as actionTypes from "../../../../store/actions";
import { useSelector } from "react-redux";
import useWindowSize from "../../../../hooks/useWindowSize";

const NavItem = (props: any) => {
  const { windowWidth } = useWindowSize();
  const dispatch = useDispatch();
  const location = useLocation();
  const layout = useSelector((state: any) => state.able.layout);
  const isOpen = useSelector((state: any) => state.able.isOpen);
  const onItemClick = () => dispatch({ type: actionTypes.COLLAPSE_MENU });
  const onItemLeave = () => dispatch({ type: actionTypes.NAV_CONTENT_LEAVE });

  React.useEffect(() => {
    if (props.collapseId && !isOpen.includes(props.collapseId)) {
      if (props.item.url === location.pathname) {
        dispatch({
          type: actionTypes.COLLAPSE_TOGGLE,
          menu: { id: props.collapseId, type: props.type },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  let itemTitle = props.item.title;

  if (props.item.icon) {
    itemTitle = <span className="pcoded-mtext">{props.item.title}</span>;
  }

  let itemTarget = "";

  if (props.item.target) {
    itemTarget = "_blank";
  }

  let subContent;

  if (props.item.external) {
    subContent = (
      <a href={props.item.url} target="_blank" rel="noopener noreferrer">
        <NavIcon items={props.item} />
        {itemTitle}
      </a>
    );
  } else {
    subContent = (
      <NavLink
        to={props.item.url}
        className="nav-link"
        exact={true}
        target={itemTarget}
      >
        <NavIcon items={props.item} />
        {itemTitle}
      </NavLink>
    );
  }

  let mainContent;

  if (layout === "horizontal") {
    mainContent = <li onClick={onItemLeave}>{subContent}</li>;
  } else {
    if (windowWidth < 992) {
      mainContent = (
        <li className={props.item.classes} onClick={onItemClick}>
          {subContent}
        </li>
      );
    } else {
      mainContent = <li className={props.item.classes}>{subContent}</li>;
    }
  }

  return <>{mainContent}</>;
};

export default NavItem;
