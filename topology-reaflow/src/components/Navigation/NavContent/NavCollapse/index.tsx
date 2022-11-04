import * as React from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import * as actionTypes from "../../../../store/actions";
import { useSelector } from "react-redux";
import NavIcon from "../NavIcon";
import NavItem from "../NavItem";
import LoopNavCollapse from "./index";
import DEMO from "../../../../store/constant";

const NavCollapse = (props: {
  collapse: {
    id?: any;
    children?: any;
    title?: any;
    icon?: any;
    url?: any;
    badge?: {
      type: any;
      title:
        | boolean
        | React.ReactChild
        | React.ReactFragment
        | React.ReactPortal;
    };
  };
  type: any;
}) => {
  const dispatch = useDispatch();
  const layout = useSelector((state: any) => state.able.layout);
  const isOpen = useSelector((state: any) => state.able.isOpen);
  const isTrigger = useSelector((state: any) => state.able.isTrigger);

  const onCollapseToggle = (id: any, type: any) => {
    dispatch({
      type: actionTypes.COLLAPSE_TOGGLE,
      menu: { id: id, type: type },
    });
  };

  const onNavCollapseLeave = (id: any, type: any) =>
    dispatch({
      type: actionTypes.NAV_COLLAPSE_LEAVE,
      menu: { id: id, type: type },
    });

  // useEffect(() => {
  //   const currentIndex = document.location.pathname
  //     .toString()
  //     .split("/")
  //     .findIndex((id) => id === props.collapse.id);
  //   if (currentIndex > -1) {
  //     onCollapseToggle(props.collapse.id, props.type);
  //   }
  //   eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  let navItems: any = "";
  if (props.collapse.children) {
    const collapses = props.collapse.children;
    navItems = Object.keys(collapses).map((key) => {
      const item = collapses[parseInt(key)];
      switch (item.type) {
        case "collapse":
          return <LoopNavCollapse key={item.id} collapse={item} type="sub" />;
        case "item":
          return (
            <NavItem
              collapseId={props.collapse.id}
              type={props.type}
              layout={layout}
              key={item.id}
              item={item}
            />
          );
        default:
          return false;
      }
    });
  }

  let itemTitle = props.collapse.title;
  if (props.collapse.icon) {
    itemTitle = <span className="pcoded-mtext">{props.collapse.title}</span>;
  }

  // let navLinkClass = ["nav-link"];
  let navItemClass = ["nav-item", "pcoded-hasmenu"];
  const openIndex = isOpen.findIndex((id: any) => id === props.collapse.id);

  if (openIndex > -1) {
    navItemClass = [...navItemClass, "active"];
    // if (layout !== "horizontal") {
    //   navLinkClass = [...navLinkClass, "active"];
    // }
  }

  const triggerIndex = isTrigger.findIndex(
    (id: any) => id === props.collapse.id
  );

  if (triggerIndex > -1) {
    navItemClass = [...navItemClass, "pcoded-trigger"];
  }

  const currentIndex = document.location.pathname
    .toString()
    .split("/")
    .findIndex((id) => id === props.collapse.id);

  if (currentIndex > -1) {
    navItemClass = [...navItemClass, "active"];
    // if (layout !== "horizontal") {
    //   navLinkClass = [...navLinkClass, "active"];
    // }
  }

  const subContent = (
    <>
      <NavLink
        to={props.collapse.url || DEMO.BLANK_LINK}
        exact={true}
        href={DEMO.BLANK_LINK}
        onClick={() => onCollapseToggle(props.collapse.id, props.type)}
      >
        <NavIcon items={props.collapse} />
        {itemTitle}
      </NavLink>
      <ul className="pcoded-submenu">{navItems}</ul>
    </>
  );

  let mainContent: any = "";

  if (layout === "horizontal") {
    mainContent = (
      <li
        className={navItemClass.join(" ")}
        onMouseLeave={() => onNavCollapseLeave(props.collapse.id, props.type)}
        onMouseEnter={() => onCollapseToggle(props.collapse.id, props.type)}
      >
        {subContent}
      </li>
    );
  } else {
    mainContent = <li className={navItemClass.join(" ")}>{subContent}</li>;
  }
  return <>{mainContent}</>;
};
export default NavCollapse;
