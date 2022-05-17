import React, { useEffect, useRef, useState } from "react";
import TreeView from "@mui/lab/TreeView";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";

import TreeItem from "@mui/lab/TreeItem";
import { updateNodes } from "../utilsf";
import result from "./sampleTree.json";

// const lines = [
//   { from: "documentRead.header", to: "documentWrite.header" },
//   { from: "3", to: "60" },
// ];

export default function ObjectTreeView() {
  const [input, setInput] = useState([]);
  const [output, setOutput] = useState([]);
  const [lines, setLines] = useState<any[]>([]);

  useEffect(() => {
    const filtered = updateNodes(result);
    setInput(filtered.input[0]);
    setOutput(filtered.output[0]);
    setLines(filtered.edges);
    console.log(filtered);
  }, []);
  const updateXarrow = useXarrow();

  const renderDocumentReadTree = (nodes: any) => (
    <>
      <TreeItem
        id={`${nodes.source}`}
        key={nodes.javaName}
        nodeId={nodes.javaName ? nodes.javaName : nodes.root}
        label={nodes.javaName}
        // onClick={() => updateXarrow}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node: any) => renderDocumentReadTree(node))
          : null}
      </TreeItem>
    </>
  );
  const renderDocumentWriteTree = (nodes: any) => (
    <>
      <TreeItem
        id={nodes.target}
        key={nodes.javaName}
        nodeId={nodes.javaName ? nodes.javaName : nodes.root}
        label={nodes.javaName}
        // onClick={() => updateXarrow}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node: any) => renderDocumentWriteTree(node))
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
              defaultExpanded={["documentRead"]}
              defaultCollapseIcon={<FolderOpenIcon />}
              defaultExpandIcon={<CreateNewFolderIcon />}
              defaultEndIcon={<InsertDriveFileOutlinedIcon />}
              // sx={{ height: "100%", flexGrow: 1 }}
              onClick={updateXarrow}
            >
              {renderDocumentReadTree(input)}
            </TreeView>
          </div>
          <div className="output">
            <TreeView
              aria-label="rich object"
              defaultExpanded={["documentWrite"]}
              defaultCollapseIcon={<FolderOpenIcon />}
              defaultExpandIcon={<CreateNewFolderIcon />}
              defaultEndIcon={<InsertDriveFileOutlinedIcon />}
              // sx={{ height: "100%", flexGrow: 1 }}
              onClick={updateXarrow}
            >
              {renderDocumentWriteTree(output)}
            </TreeView>
          </div>
          {lines.map((line, i) => (
            <Xarrow
              key={i}
              start={`documentRead.${line.source}`}
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
