import { Menu } from "primereact/menu";
import React, { useRef } from "react";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";
import "./styles.scss";

interface DetailProps {
  type?: string;
  title: string;
  items?: MenuItem[];
  onSelect?: () => void;
  defaultValue?: string;
  loading?: boolean;
  showSync?: boolean;
  fetchData?: () => void;
}

const DetailHeader = (props: DetailProps) => {
  const menu = useRef(null);

  const showDropDown = () => {
    return (
      <>
        <Menu model={props.items} popup ref={menu} id="detail-header-menu" />
        <Button
          className="p-button p-component p-button-text shadow-none heading-button pb-0"
          onClick={(event: any) => menu.current.toggle(event)}
          aria-controls="popup_menu"
          aria-haspopup
        >
          {props.defaultValue}
          <i className="pi pi-angle-down pl-1"></i>
        </Button>
      </>
    );
  };

  const showRefreshIcon = () => {
    return (
      <div>
        <i
          onClick={props.loading ? () => {} : props.fetchData}
          className={`pi sync-icon ${
            props.loading ? "pi-spin pi-spinner" : "pi-sync"
          }`}
        ></i>
      </div>
    );
  };

  return (
    <div className="detail-header d-flex justify-content-between">
      {props.type !== "dropdown" && <h1>{props.title}</h1>}
      {props.type === "dropdown" && (
        <h1 className="d-flex align-items-center">
          <div>{props.title}</div> {showDropDown()}
        </h1>
      )}
      {props.showSync && showRefreshIcon()}
    </div>
  );
};

export default DetailHeader;
