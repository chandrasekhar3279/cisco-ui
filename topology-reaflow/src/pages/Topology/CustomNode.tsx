import { Node } from "reaflow";
import Card from "./Card";
import "./CustomNode.scss";

interface CustomNodeProps {
  properties?: any;
  height?: any;
  width?: any;
  children?: any;
  toggleNode?: any;
  id?: any;
}

const CustomNode = ({
  properties,
  height,
  width,
  children,
  toggleNode,
  id,
  ...other
}: CustomNodeProps) => {
  return (
    <Node width={width} height={height} {...{ id, properties }} {...other}>
      <foreignObject
        height={height}
        width={width}
        // className="foreignObject"
        className={`nodeCardWrapper node-${
          properties.id.length === 3
            ? "regions"
            : properties.id.length === 5
            ? "vpcs"
            : properties.id.length === 7
            ? "subnodes"
            : "parent"
        }`}
      >
        <div>
          <Card
            title={properties.data.title}
            isExpanded
            onClick={toggleNode(properties.id)}
          >
            {children}
          </Card>
        </div>
      </foreignObject>
    </Node>
  );
};

export default CustomNode;
