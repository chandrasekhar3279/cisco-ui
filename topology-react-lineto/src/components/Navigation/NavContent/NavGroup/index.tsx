import * as React from "react";
import NavCollapse from "../NavCollapse";
import NavItem from "../NavItem";

const NavGroup = (props: { group: { children: any } }) => {
  let navItems: any = "";
  if (props.group.children) {
    const groups = props.group.children;
    navItems = Object.keys(groups).map((key) => {
      const item = groups[parseInt(key)];
      switch (item.type) {
        case "collapse":
          return <NavCollapse key={item.id} collapse={item} type="main" />;
        case "item":
          return <NavItem key={item.id} item={item} />;
        default:
          return false;
      }
    });
  }
  return <>{navItems}</>;
};

export default NavGroup;
