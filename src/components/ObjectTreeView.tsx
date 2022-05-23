import React, { useEffect, useState, useReducer } from "react";
import TreeView from "@mui/lab/TreeView";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import Xarrow, { Xwrapper } from "react-xarrows";

import TreeItem from "@mui/lab/TreeItem";
import { updateNodes } from "../utilsf";
import result from "./sampleTree.json";

export default function ObjectTreeView() {
  const [input, setInput] = useState([]);
  const [output, setOutput] = useState([]);
  const [lines, setLines] = useState<any[]>([]);

  const testExpand: string[] = [
    "header",
    "test",
    "sourcingTest",
    "badSource",
    "fieldLength",
    "constantValue",
    "repeating",
    "repeatingRep",
    "item",
  ];
  useEffect(() => {
    const filtered = updateNodes(result);
    setInput(filtered.input[0]);
    setOutput(filtered.output[0]);
    setLines(filtered.edges);
    console.log(filtered);
  }, []);
  useEffect(() => {
    console.log("render...");
  });

  const renderDocumentReadTree = (nodes: any) => (
    <>
      <TreeItem
        id={nodes.entity_path}
        key={nodes.javaName}
        nodeId={nodes.javaName ? nodes.javaName : nodes.root}
        label={nodes.javaName}
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
        id={nodes.entity_path}
        key={nodes.javaName}
        nodeId={nodes.javaName ? nodes.javaName : nodes.root}
        label={nodes.javaName}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node: any) => renderDocumentWriteTree(node))
          : null}
      </TreeItem>
    </>
  );
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  function handleClick() {
    setTimeout(() => {
      forceUpdate();
    }, 1000);
  }
  return (
    <>
      <div className="tree-box" style={{ display: "flex" }}>
        {true && (
          <Xwrapper>
            <div className="input">
              <TreeView
                aria-label="rich object"
                defaultExpanded={["documentRead", ...testExpand]}
                defaultCollapseIcon={<FolderOpenIcon />}
                defaultExpandIcon={<CreateNewFolderIcon />}
                defaultEndIcon={<InsertDriveFileOutlinedIcon />}
                // sx={{ height: "100%", flexGrow: 1 }}
                onClick={handleClick}
              >
                {renderDocumentReadTree(input)}
              </TreeView>
            </div>
            <div className="output">
              <TreeView
                aria-label="rich object"
                defaultExpanded={["documentWrite", ...testExpand]}
                defaultCollapseIcon={<FolderOpenIcon />}
                defaultExpandIcon={<CreateNewFolderIcon />}
                defaultEndIcon={<InsertDriveFileOutlinedIcon />}
                // sx={{ height: "100%", flexGrow: 1 }}
                onClick={handleClick}
              >
                {renderDocumentWriteTree(output)}
              </TreeView>
            </div>
            {lines.map((line, i) => (
              <Xarrow
                key={i}
                start={line.source}
                end={line.target}
                zIndex={1}
                strokeWidth={2}
                color={
                  line.type === "prefEdge"
                    ? "orange"
                    : line.type === "group"
                    ? "blue"
                    : "DimGray"
                }
                headSize={0}
                startAnchor="right"
                endAnchor={"left"}
              />
            ))}
          </Xwrapper>
        )}
      </div>
    </>
  );
}
