import { useState, useRef, useCallback } from "react";
import { Canvas, CanvasPosition, CanvasRef } from "reaflow";
import CustomNode from "./CustomNode";
import "./style.scss";

const Topology = () => {
  const [zoom, setZoom] = useState<number>(0.7);
  const ref = useRef<CanvasRef | null>(null);

  const nodes: any[] = [
    // clouds
    {
      id: "1",
      data: { title: "AWS" },
      width: 380,
      height: 106,
      nodePadding: [88, 20, 28, 20],
    },
    {
      id: "2",
      data: { title: "AZURE" },
      width: 380,
      height: 106,
      nodePadding: [88, 20, 28, 20],
    },
    {
      id: "3",
      data: { title: "GCP" },
      width: 380,
      height: 106,
      nodePadding: [88, 20, 28, 20],
    },

    // aws-regions
    {
      id: "1.1",
      parent: "1",
      data: { title: "us-west-1" },
      width: 150,
      height: 52,
      nodePadding: [88, 20, 28, 20],
    },
    {
      id: "1.2",
      parent: "1",
      data: { title: "us-east-2" },
      width: 150,
      height: 52,
      nodePadding: [88, 20, 28, 20],
    },
    {
      id: "1.3",
      parent: "1",
      data: { title: "us-east-3" },
      width: 150,
      height: 52,
      nodePadding: [88, 20, 28, 20],
    },
    {
      id: "1.4",
      parent: "1",
      data: { title: "us-east-4" },
      width: 150,
      height: 52,
      nodePadding: [88, 20, 28, 20],
    },
    {
      id: "1.5",
      parent: "1",
      data: { title: "us-east-5" },
      width: 150,
      height: 52,
      nodePadding: [88, 20, 28, 20],
    },

    // azure-regions
    {
      id: "2.1",
      parent: "2",
      data: { title: "us-east-1" },
      width: 150,
      height: 52,
    },
    {
      id: "2.2",
      parent: "2",
      data: { title: "eu-west-2" },
      width: 150,
      height: 52,
    },
    {
      id: "2.3",
      parent: "2",
      data: { title: "us-east-3" },
      width: 150,
      height: 52,
    },

    // gcp-regions
    {
      id: "3.1",
      parent: "3",
      data: { title: "us-west-1" },
      width: 150,
      height: 52,
    },
    {
      id: "3.2",
      parent: "3",
      data: { title: "eu-west-2" },
      width: 150,
      height: 52,
    },

    // aws-r1-vpcs
    {
      id: "1.1.1",
      parent: "1.1",
      data: { title: "VPC-1" },
      width: 75,
      height: 50,
      nodePadding: [88, 20, 28, 20],
    },
    {
      id: "1.1.2",
      parent: "1.1",
      data: { title: "VPC-2" },
      width: 75,
      height: 50,
    },
    {
      id: "1.1.3",
      parent: "1.1",
      data: { title: "VPC-3" },
      width: 75,
      height: 50,
    },
    {
      id: "1.1.4",
      parent: "1.1",
      data: { title: "VPC-4" },
      width: 75,
      height: 50,
    },

    // aws-r2-vpcs
    {
      id: "1.2.1",
      parent: "1.2",
      data: { title: "VPC-1" },
      width: 75,
      height: 50,
    },
    {
      id: "1.2.2",
      parent: "1.2",
      data: { title: "VPC-2" },
      width: 75,
      height: 50,
    },
    {
      id: "1.2.3",
      parent: "1.2",
      data: { title: "VPC-3" },
      width: 75,
      height: 50,
    },
    {
      id: "1.2.4",
      parent: "1.2",
      data: { title: "VPC-4" },
      width: 75,
      height: 50,
    },
    {
      id: "1.2.5",
      parent: "1.2",
      data: { title: "VPC-5" },
      width: 75,
      height: 50,
    },
    {
      id: "1.2.6",
      parent: "1.2",
      data: { title: "VPC-6" },
      width: 75,
      height: 50,
    },

    // aws-r3-vpcs
    {
      id: "1.3.1",
      parent: "1.3",
      data: { title: "VPC-1" },
      width: 75,
      height: 50,
    },
    {
      id: "1.3.2",
      parent: "1.3",
      data: { title: "VPC-2" },
      width: 75,
      height: 50,
    },
    {
      id: "1.3.3",
      parent: "1.3",
      data: { title: "VPC-3" },
      width: 75,
      height: 50,
    },

    // aws-r4-vpcs
    {
      id: "1.4.1",
      parent: "1.4",
      data: { title: "VPC-1" },
      width: 75,
      height: 50,
    },
    {
      id: "1.4.2",
      parent: "1.4",
      data: { title: "VPC-2" },
      width: 75,
      height: 50,
    },
    {
      id: "1.4.3",
      parent: "1.4",
      data: { title: "VPC-3" },
      width: 75,
      height: 50,
    },
    {
      id: "1.5.1",
      parent: "1.5",
      data: { title: "VPC-1" },
      width: 75,
      height: 50,
    },
    {
      id: "1.5.2",
      parent: "1.5",
      data: { title: "VPC-2" },
      width: 75,
      height: 50,
    },

    // aws-vpc1-subnodes
    {
      id: "1.1.1.1",
      parent: "1.1.1",
      data: { title: "Subnets-12" },
      width: 100,
      height: 50,
    },
    {
      id: "1.1.1.2",
      parent: "1.1.1",
      data: { title: "RT-12" },
      width: 100,
      height: 50,
    },
    {
      id: "1.1.2.1",
      parent: "1.1.2",
      data: { title: "Subnets-1" },
      width: 100,
      height: 50,
    },
    {
      id: "1.1.2.2",
      parent: "1.1.2",
      data: { title: "RT-1" },
      width: 100,
      height: 50,
    },
    {
      id: "1.1.3.1",
      parent: "1.1.3",
      data: { title: "Subnets-1" },
      width: 100,
      height: 50,
    },
    {
      id: "1.1.3.2",
      parent: "1.1.3",
      data: { title: "RT-1" },
      width: 100,
      height: 50,
    },
    {
      id: "1.1.4.1",
      parent: "1.1.4",
      data: { title: "Subnets-1" },
      width: 100,
      height: 50,
    },
    {
      id: "1.1.4.2",
      parent: "1.1.4",
      data: { title: "RT-1" },
      width: 100,
      height: 50,
    },
    // azure-r1-vpcs
    {
      id: "2.1.1",
      parent: "2.1",
      data: { title: "VPC-1" },
      width: 75,
      height: 50,
    },
    {
      id: "2.1.2",
      parent: "2.1",
      data: { title: "VPC-2" },
      width: 75,
      height: 50,
    },

    // azure-r2-vpcs
    {
      id: "2.2.1",
      parent: "2.2",
      data: { title: "VPC-1" },
      width: 75,
      height: 50,
    },
    {
      id: "2.2.2",
      parent: "2.2",
      data: { title: "VPC-2" },
      width: 75,
      height: 50,
    },
    {
      id: "2.2.3",
      parent: "2.3",
      data: { title: "VPC-1" },
      width: 75,
      height: 50,
    },

    {
      id: "2.2.3",
      parent: "2.3",
      data: { title: "VPC-2" },
      width: 75,
      height: 50,
    },
    //azure-r1-vpc-subnodes
    {
      id: "2.1.1.1",
      parent: "2.1.1",
      data: { title: "node-a" },
      width: 75,
      height: 50,
    },
    {
      id: "2.1.1.1",
      parent: "2.1.1",
      data: { title: "node-b" },
      width: 75,
      height: 50,
    },
    {
      id: "2.1.1.2",
      parent: "2.1.2",
      data: { title: "node-a" },
    },

    // gcp-r1-vpcs
    {
      id: "3.1.1",
      parent: "3.1",
      data: { title: "VPC-1" },
      width: 75,
      height: 50,
      nodePadding: [88, 20, 28, 20],
    },
    {
      id: "3.1.2",
      parent: "3.1",
      data: { title: "VPC-2" },
      width: 75,
      height: 50,
    },
    {
      id: "3.1.3",
      parent: "3.1",
      data: { title: "VPC-3" },
      width: 75,
      height: 50,
    },
    {
      id: "3.1.4",
      parent: "3.1",
      data: { title: "VPC-4" },
      width: 75,
      height: 50,
    },

    //gcp-r1-vpc1-subnodes
    {
      id: "3.1.1.1",
      parent: "3.1.1",
      data: { title: "node-1" },
      width: 75,
      height: 50,
    },
    {
      id: "3.1.2.1",
      parent: "3.1.2",
      data: { title: "node-1" },
      width: 75,
      height: 50,
    },
    {
      id: "3.2.1.2",
      parent: "3.2.2",
      data: { title: "node-a" },
      width: 75,
      height: 50,
    },
    {
      id: "3.2.1.2",
      parent: "3.2.2",
      data: { title: "node-b" },
      width: 75,
      height: 50,
    },

    // gcp-r2-vpcs
    {
      id: "3.2.1",
      parent: "3.2",
      data: { title: "VPC-1" },
      width: 75,
      height: 50,
    },
    {
      id: "3.2.2",
      parent: "3.2",
      data: { title: "VPC-2" },
      width: 75,
      height: 50,
    },
    {
      id: "3.2.1.1",
      parent: "3.2.1",
      data: { title: "Subnet-32" },
      width: 75,
      height: 50,
    },
    {
      id: "3.2.1.2",
      parent: "3.2.1",
      data: { title: "RT-32" },
      width: 75,
      height: 50,
    },
  ];
  const [panelHeight, setPaneHeight] = useState(window.innerHeight - 300);
  const [panelWidth, setPaneWidth] = useState(window.innerWidth);

  const edges: any[] = [
    { id: "1.1-2.1", from: "1.1", to: "2.1" },
    { id: "1.1-2.2", from: "1.1", to: "2.2" },
    { id: "1.1-2.3", from: "1.1", to: "2.3" },
    { id: "1.1-3.1", from: "1.1", to: "3.1" },
    { id: "1.1-3.2", from: "1.1", to: "3.2" },

    { id: "1.2-2.1", from: "1.2", to: "2.1" },
    { id: "1.2-3.1", from: "1.2", to: "3.1" },
    { id: "1.3-3.1", from: "1.3", to: "3.1" },
    { id: "1.4-3.1", from: "1.4", to: "3.1" },
    { id: "1.5-3.1", from: "1.5", to: "3.1" },

    { id: "1.3-2.1", from: "1.3", to: "2.1" },
    { id: "1.4-2.1", from: "1.4", to: "2.1" },
    { id: "1.5-2.1", from: "1.5", to: "2.1" },

    { id: "2.1-3.1", from: "2.1", to: "3.1" },
    { id: "2.1-3.2", from: "2.1", to: "3.2" },
    { id: "2.2-3.1", from: "2.2", to: "3.1" },
    { id: "2.1-3.2", from: "2.1", to: "3.2" },
    { id: "2.3-3.1", from: "2.3", to: "3.1" },
    // { id: "1.1.1-3.1.1", from: "1.1.1", to: "3.1.1" },
    // { id: "1.2.1-3.2.1", from: "1.2.1", to: "3.2.1" },
    // { id: "2.2.1-3.2.1", from: "2.2.1", to: "3.2.1" },
    // { id: "2.1.1-2.2.1", from: "2.1.1", to: "3.2.1" },
    // { id: "3.2.2.1-2.2.1", from: "3.2.2", to: "2.2.1" },
    // { id: "2.1.2-3.2.2", from: "2.1.2", to: "3.2.2" },
    // { id: "1.1.1.2-3.2.1.2", from: "1.1.1.2", to: "3.2.1.1" },
  ];

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleExpandedNode = (id: string) => () => {
    const newExpandedNodes = new Set(expandedNodes);

    if (expandedNodes.has(id)) {
      newExpandedNodes.delete(id);
    } else {
      newExpandedNodes.add(id);
    }

    setExpandedNodes(newExpandedNodes);
  };

  const filteredNodes = nodes.filter((node) => {
    //aws
    if (["1.1.1", "1.1.2", "1.1.3", "1.1.4", "1.1.5"].includes(node.id)) {
      return expandedNodes.has("1.1");
    }
    if (["1.1.1.1", "1.1.1.2"].includes(node.id)) {
      return expandedNodes.has("1.1.1");
    }
    if (
      ["1.2.1", "1.2.2", "1.2.4", "1.2.5", "1.2.6", "1.2.3"].includes(node.id)
    ) {
      return expandedNodes.has("1.2");
    }
    if (["1.3.1", "1.3.2", "1.3.3"].includes(node.id)) {
      return expandedNodes.has("1.3");
    }
    if (["1.4.1", "1.4.2", "1.4.3"].includes(node.id)) {
      return expandedNodes.has("1.4");
    }
    if (["1.5.1", "1.5.2"].includes(node.id)) {
      return expandedNodes.has("1.5");
    }
    //aws-subnets
    if ([""].includes(node.id)) {
      return expandedNodes.has("");
    }

    //azure
    if (["2.1.1", "2.1.2"].includes(node.id)) {
      return expandedNodes.has("2.1");
    }
    if (["2.2.1", "2.2.2", "2.2.3"].includes(node.id)) {
      return expandedNodes.has("2.2");
    }

    if (["1.1.1.1", "1.1.1.2"].includes(node.id)) {
      return expandedNodes.has("1.1.1");
    }

    //gcp
    if (["3.1.1", "3.1.2", "3.1.3", "3.1.4"].includes(node.id)) {
      return expandedNodes.has("3.1");
    }
    if (["3.2.1", "3.2.2"].includes(node.id)) {
      return expandedNodes.has("3.2");
    }
    if (["3.2.1.1", "3.2.1.2"].includes(node.id)) {
      return expandedNodes.has("3.2.1");
    }

    return true;
  });

  const splitEdge = (str: string) => {
    const res = str.split(".");
    return res.slice(0, res.length - 1).join(".");
  };

  const checkAndEdgeForParent = (node: any, parent: any) => {
    if (!expandedNodes.has(parent)) {
      const isEdge = splitEdge(parent);
      const temp: any =
        isEdge?.length > 1 ? checkAndEdgeForParent(parent, isEdge) : parent;
      return temp;
    } else {
      return node;
    }
  };

  const adjustedEdges = edges.map((edge) => {
    const parentFrom = splitEdge(edge.from);
    const parentTo = splitEdge(edge.to);

    const from: any = checkAndEdgeForParent(edge.from, parentFrom);
    const to: any = checkAndEdgeForParent(edge.to, parentTo);

    return {
      ...edge,
      from,
      to,
    };
  });

  const calculatePaneWidthAndHeight = useCallback(() => {
    let newHeight = 0;
    let newWidth = 0;
    ref?.current?.layout?.children?.forEach(
      (node: { y: any; height: any; x: any; width: any }) => {
        if (node.y + node.height > newHeight) newHeight = node.y + node.height;
        if (node.x + node.width > newWidth) newWidth = node.x + node.width;
      }
    );
    setPaneHeight(newHeight);
    setPaneWidth(newWidth);
    // setTimeout(()=>{
    //   ref.current.fitCanvas()
    // },1000)
  }, []);

  return (
    <div className="canvas">
      <pre
        className="canvas-widget"
        style={{
          zIndex: 9,
          position: "absolute",
          top: 50,
          right: 20,
          background: "rgba(0, 0, 0, .5)",
          padding: 20,
          color: "white",
        }}
      >
        Zoom: {zoom}
        <br />
        <button onClick={() => ref.current.zoomIn()}>Zoom In</button>
        <button onClick={() => ref.current.zoomOut()}>Zoom Out</button>
        <button onClick={() => ref.current.fitCanvas()}>Fit</button>
      </pre>
      <Canvas
        nodes={filteredNodes}
        arrow={null}
        node={(props) => (
          <CustomNode {...props} toggleNode={toggleExpandedNode} />
        )}
        edges={adjustedEdges}
        zoom={zoom}
        ref={ref}
        onZoomChange={(z) => {
          setZoom(z);
        }}
        onLayoutChange={calculatePaneWidthAndHeight}
        maxHeight={panelHeight}
        maxWidth={panelWidth}
        defaultPosition={CanvasPosition.TOP}
        layoutOptions={{ "elk.hierarchyHandling": "INCLUDE_CHILDREN" }}
      />
    </div>
  );
};

export default Topology;
