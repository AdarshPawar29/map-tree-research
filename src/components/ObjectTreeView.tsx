import React, { useEffect, useRef, useState } from "react";
import TreeView from "@mui/lab/TreeView";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";

import TreeItem from "@mui/lab/TreeItem";
import { updateNodes } from "../utilsf";
import result from "./sampleTree.json";

interface RenderTree {
  id: string;
  name: string;
  start?: string;
  children?: readonly RenderTree[];
  x: number;
  y: number;
}

const dataLeft: RenderTree = {
  id: "root",
  name: "Left Tree",
  x: 20,
  y: 20,
  children: [
    {
      id: "1",
      name: "Child - 1",
      x: 20,
      y: 20,
      children: [
        {
          id: "5",
          name: "Child - 5",
          x: 20,
          y: 20,
        },
      ],
    },
    {
      id: "3",
      name: "Child - 3",
      x: 20,
      y: 20,
      children: [
        {
          id: "4",
          name: "Child - 4",
          x: 20,
          y: 20,
          children: [
            {
              id: "8",
              name: "Child - 8",
              x: 20,
              y: 20,
            },
          ],
        },
      ],
    },
    {
      id: "6",
      name: "Child - 6",
      x: 20,
      y: 20,
      children: [
        {
          id: "7",
          name: "Child - 7",
          x: 20,
          y: 20,
        },
      ],
    },
  ],
};

const dataRight: RenderTree = {
  id: "root",
  name: "Left Tree",
  x: 20,
  y: 20,
  children: [
    {
      id: "10",
      name: "Child - 10",
      x: 20,
      y: 20,
    },
    {
      id: "30",
      name: "Child - 30",
      x: 20,
      y: 20,
      children: [
        {
          id: "40",
          name: "Child - 40",
          x: 20,
          y: 20,
          children: [
            {
              id: "80",
              name: "Child - 80",
              x: 20,
              y: 20,
            },
          ],
        },
      ],
    },
    {
      id: "60",
      name: "Child - 60",
      x: 20,
      y: 20,
      children: [
        {
          id: "70",
          name: "Child - 70",
          x: 20,
          y: 20,
        },
      ],
    },
  ],
};

// const lines = [
//   { from: "documentRead.header", to: "documentWrite.header" },
//   { from: "3", to: "60" },
// ];

export default function ObjectTreeView() {

  const [input, setInput] = useState([]);
  const [output, setOutput] = useState([]);
  const [lines, setLines] = useState<any[]>([])

  useEffect(() => {
    const filtered = updateNodes(result);
    setInput(filtered.input[0]);
    setOutput(filtered.output[0]);
    setLines(filtered.edges)
    console.log(filtered)
  }, []);
  const updateXarrow = useXarrow();

  const renderTree = (nodes: any) => (
    <>
      <TreeItem
        id={nodes.source ? nodes.source: nodes.target}
        key={nodes.javaName}
        nodeId={nodes.javaName}
        label={nodes.javaName}
        // onClick={() => updateXarrow}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node: any) => renderTree(node))
          : null}
      </TreeItem>
    </>
  );

  return (
    <>
      <div className="tree-box" style={{ display: "flex" }}>
        <Xwrapper>
          <div className="input">
            <TreeView
              aria-label="rich object"
              defaultExpanded={["root"]}
              defaultCollapseIcon={<FolderOpenIcon />}
              defaultExpandIcon={<CreateNewFolderIcon />}
              defaultEndIcon={<InsertDriveFileOutlinedIcon />}
              // sx={{ height: "100%", flexGrow: 1 }}
              onClick={updateXarrow}
            >
              {renderTree(input)}
            </TreeView>
          </div>
          <div className="output">
            <TreeView
              aria-label="rich object"
              defaultExpanded={["root"]}
              defaultCollapseIcon={<FolderOpenIcon />}
              defaultExpandIcon={<CreateNewFolderIcon />}
              defaultEndIcon={<InsertDriveFileOutlinedIcon />}
              // sx={{ height: "100%", flexGrow: 1 }}
              onClick={updateXarrow}
            >
              {renderTree(output)}
            </TreeView>
          </div>
          {lines.map((line, i) => (
            <Xarrow
              key={i}
              start={line.source}
              end={line.target}
              zIndex={1}
              strokeWidth={2}
              color={"DimGray"}
              headSize={0}
            />
          ))}
        </Xwrapper>
      </div>
    </>
  );
}
