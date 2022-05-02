import React, { Children, useRef } from "react";
import TreeView from "@mui/lab/TreeView";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";

import TreeItem from "@mui/lab/TreeItem";

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

const lines = [
  { from: "1", to: "30" },
  { from: "3", to: "60" },
];

export default function ObjectTreeView() {
  const updateXarrow = useXarrow();

  const renderTree = (nodes: RenderTree) => (
    <>
      <TreeItem
        id={nodes.id}
        key={nodes.id}
        nodeId={nodes.id}
        label={nodes.name}
        // onClick={() => updateXarrow}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
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
              {renderTree(dataLeft)}
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
              {renderTree(dataRight)}
            </TreeView>
          </div>
          {lines.map((line, i) => (
            <Xarrow
              key={i}
              start={line.from}
              end={line.to}
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