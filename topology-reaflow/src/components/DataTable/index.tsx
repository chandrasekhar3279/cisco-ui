import { useState } from "react";
import { DataTable, InputText, Dropdown } from "components/primereact";
import "./styles.scss";

const ReactDataTable = (props: any) => {
  const { children, ...others } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [pageInputTooltip, setPageInputTooltip] = useState(
    "Press 'Enter' key to go to this page."
  );
  const getPageNumbers = (val: any) => {
    if (rows !== undefined) {
      return Math.ceil(val / rows);
    }
  };

  const onPageInputChange = (event: any) => {
    setCurrentPage(event.target.value);
  };

  const onPageInputKeyDown = (event: any, options: any) => {
    if (event.key === "Enter") {
      const page = currentPage;
      if (page < 0 || page > options.totalPages) {
        setPageInputTooltip(
          `Value must be between 1 and ${options.totalPages}.`
        );
      } else {
        const first = currentPage ? options.rows * (page - 1) : 0;
        setFirst(first);
        setPageInputTooltip("Press 'Enter' key to go to this page.");
      }
    }
  };

  const onCustomPage = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
    setCurrentPage(event.page + 1);
  };

  const template2: any = {
    layout:
      "RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink",
    RowsPerPageDropdown: (options: any) => {
      const dropdownOptions: any = [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
        { label: "All", value: options.totalRecords },
      ];

      return (
        <div style={{ marginLeft: "0px", marginRight: "auto" }}>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
            appendTo="self"
          />
          Rows
          {options.value}
        </div>
      );
    },
    CurrentPageReport: (options: any) => {
      return (
        <span
          className="mx-3"
          style={{ color: "var(--text-color)", userSelect: "none" }}
        >
          Page
          <InputText
            size={2}
            className="mx-2 pagination-input"
            value={currentPage}
            tooltip={pageInputTooltip}
            onKeyDown={(e) => onPageInputKeyDown(e, options)}
            onChange={onPageInputChange}
          />
          of {getPageNumbers(options.totalRecords)}
        </span>
      );
    },
  };

  return (
    <DataTable
      first={first}
      stripedRows
      paginator
      paginatorTemplate={template2}
      className="p-datatable-customers"
      rows={rows}
      dataKey="id"
      responsiveLayout="scroll"
      globalFilterFields={props.globalFilterFields}
      filters={props.filters}
      onPage={onCustomPage}
      {...others}
    >
      {children}
    </DataTable>
  );
};

export default ReactDataTable;
