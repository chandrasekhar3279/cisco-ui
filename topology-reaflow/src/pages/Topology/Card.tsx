import * as React from "react";

export default function Card({
  title,
  isExpanded,
  onClick,
  children,
}: {
  title: string;
  isExpanded: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div className="card-topology" onClick={onClick}>
      <div className="header-topology">{title}</div>
      {isExpanded && children}
    </div>
  );
}
