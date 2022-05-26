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
  const [input, setInput] = useState<any>([]);
  const [output, setOutput] = useState<any>([]);
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
    handleClick();
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
    }, 500);
  }

  const getAllParents = (items: any, id: string) => {
    const allIds: string[] = [];

    items.forEach((item: { id: string; children: any }) => {
      if (item.id === id) {
        allIds.push(item.id);
      } else if (item.children) {
        const ids = getAllParents(item.children, id);

        if (ids.length) allIds.push(item.id);

        ids.forEach((id) => allIds.push(id));
      }
    });
    return allIds;
  };
  const getSourceNode = (nodeID: string) => {
    let sourceNode: string = "";
    const allIds = getAllParents(input.children, nodeID);
    for (let i = 0; i < allIds.length; i++) {
      if (document.getElementById(allIds[i]) && nodeID === allIds[i]) {
        sourceNode = nodeID;
        break;
      }
      if (document.getElementById(allIds[i]) === null) {
        sourceNode = allIds[i - 1];
        break;
      }
    }
    return sourceNode;
  };

  const getTargetNode = (nodeID: string) => {
    let targetNode: string = "";
    const allIds = getAllParents(output.children, nodeID);
    for (let i = 0; i < allIds.length; i++) {
      if (document.getElementById(allIds[i]) && nodeID === allIds[i]) {
        targetNode = nodeID;
        break;
      }
      if (document.getElementById(allIds[i]) === null) {
        targetNode = allIds[i - 1];
        break;
      }
    }
    return targetNode;
  };
  return (
    <>
      <div className="tree-box" style={{ display: "flex" }}>
        {true && (
          <Xwrapper>
            <div className="input">
              <TreeView
                aria-label="rich object"
                defaultExpanded={["documentRead"]}
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
                defaultExpanded={["documentWrite"]}
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
                start={getSourceNode(line.source)}
                end={getTargetNode(line.target)}
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
