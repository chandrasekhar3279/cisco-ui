import { FillCircleSVG } from "components/SVGs";

const Alertscore = (rowData: any) => {
  const alertscore = rowData.alertscore || "-";
  return (
    <div className="alertscoreTemplate">
      <span className="icon-style">
        <FillCircleSVG color="green" />
      </span>
      <span>{alertscore}</span>
    </div>
  );
};

export default Alertscore;
