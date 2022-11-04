import React from "react";

const Alertscore = (rowData: any) => {
  const alertscore = rowData.alertscore || "-";
  return (
    <div className="alertscoreTemplate">
      <span className="icon-style">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          className="active-circle"
        >
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      </span>
      <span>{alertscore}</span>
    </div>
  );
};
export default Alertscore;
