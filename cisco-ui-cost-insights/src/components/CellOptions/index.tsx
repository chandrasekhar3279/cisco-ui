import React, { useMemo, useRef } from "react";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";

interface CellActionOptionProps {
  cloudprovider: string;
  id: string;
  deleteAction: (cloudprovider: any, id: any) => void;
  showDetail?: boolean;
  showDetailModal?: (cloudprovider: any, id: any) => void;
}

const CellActionOptions = (props: CellActionOptionProps) => {
  const menu = useRef(null);

  const items = useMemo(
    () => [
      ...(props.showDetail
        ? [
            {
              label: "View Detail",
              icon: "pi pi-eye",
              command: () => {
                props.showDetailModal(props.cloudprovider, props.id);
              },
            },
          ]
        : []),
      {
        label: "Update",
        icon: "pi pi-pencil",
        // command: () => {},
      },
      {
        label: "Delete",
        icon: "pi pi-times",
        command: () => {
          props.deleteAction(props.cloudprovider, props.id);
        },
      },
    ],
    [props.showDetail]
  );

  return (
    <>
      <Menu model={items} popup ref={menu} id="popup_menu" />
      <Button
        className="p-button-text shadow-none p-button-secondary"
        icon="pi pi-ellipsis-h"
        onClick={(event: any) => menu.current.toggle(event)}
        aria-controls="popup_menu"
        aria-haspopup
      />
    </>
  );
};

export default CellActionOptions;
