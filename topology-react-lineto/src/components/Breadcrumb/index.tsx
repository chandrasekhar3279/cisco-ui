import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import config from "../../config";
import navigation from "../../menu-items";
import DEMO from "../../store/constant";

const Breadcrumb = (props: any) => {
  const [main, setMain] = useState({ type: "", title: "" });
  const [item, setItem] = useState({
    type: "",
    title: "",
    breadcrumbs: "",
    heading: "",
  });
  const { pathname } = useLocation();

  const getCollapse = useCallback((item) => {
    if (item.children) {
      item.children.filter((collapse: any) => {
        if (collapse.type && collapse.type === "collapse") {
          getCollapse(collapse);
        } else if (collapse.type && collapse.type === "item") {
          if (
            document.location.pathname ===
            (process.env.REACT_APP_ROUTER_BASENAME
              ? `/${process.env.REACT_APP_ROUTER_BASENAME}`
              : "") +
              collapse.url
          ) {
            setItem(collapse);
            setMain(item);
          }
        }
        return false;
      });
    }
  }, []);

  useEffect(() => {
    navigation.items.map((item, index) => {
      if (item.type && item.type === "group") {
        getCollapse(item);
      }

      return false;
    });
  }, [pathname, getCollapse]);

  let main_: any, item_: any;
  let breadcrumb;
  let title = "Welcome";

  if (main && main.type === "collapse") {
    main_ = (
      <li className="breadcrumb-item">
        <a href={DEMO.BLANK_LINK}>{main.title}</a>
      </li>
    );
  }

  if (item && item.type === "item") {
    title = item.heading || item.title;
    item_ = (
      <li className="breadcrumb-item">
        <a href={DEMO.BLANK_LINK}>{title}</a>
      </li>
    );

    if (!!item["breadcrumbs"]) {
      breadcrumb = (
        <div className="page-header">
          <div className="page-block">
            <div className="row align-items-center">
              <div className="col-md-12">
                <div className="page-header-title">
                  <h5 className="m-b-10">{title}</h5>
                </div>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">
                      <i className="feather icon-home" />
                    </Link>
                  </li>
                  {main_}
                  {item_}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  document.title = title;

  return <>{breadcrumb}</>;
};

export default Breadcrumb;
