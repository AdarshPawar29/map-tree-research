import React, { useEffect, useState } from "react";
import TreeView from "@mui/lab/TreeView";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";

import TreeItem from "@mui/lab/TreeItem";
import { updateNodes } from "../utilsf";
import result from "./sampleTree.json";

const { defaultExpandedInput, defaultExpandedOutput } = updateNodes(result);

export default function ObjectTreeView() {
  const updateXarrow = setTimeout(useXarrow(), 1000);

  const [input, setInput] = useState([]);
  const [output, setOutput] = useState([]);
  const [lines, setLines] = useState<any[]>([]);
  const [expandedInput, setExpandedInput] = useState<string[]>([
    ...defaultExpandedInput,
  ]);
  const [expandedOutput, setExpandedOutput] = useState<string[]>([
    ...defaultExpandedOutput,
  ]);

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

  const updateHeadLeft = (nodes: any) => {
    if (nodes && nodes.name === "GROUPDEF") {
      lines.filter((line) => {
        if (line.source.match(nodes.title)) {
          if (line.expandedL == "") line.expandedL = nodes.entity_path;
          else line.expandedL = "";
        }
        return line;
      });
    }
  };

  const updateHeadRight = (nodes: any) => {
    if (nodes && nodes.name === "GROUPDEF") {
      lines.filter((line) => {
        if (line.target.match(nodes.title)) {
          if (line.expandedR == "") line.expandedR = nodes.entity_path;
          else line.expandedR = "";
        }
      });
    }
  };

  const renderDocumentReadTree = (nodes: any) => (
    <>
      <TreeItem
        id={nodes.entity_path}
        key={nodes.javaName}
        nodeId={nodes.javaName ? nodes.javaName : nodes.root}
        label={nodes.javaName}
        onClick={() => updateHeadLeft(nodes)}
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
        onClick={() => updateHeadRight(nodes)}
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
        {true && (
          <Xwrapper>
            <div className="input">
              <TreeView
                aria-label="rich object"
                defaultExpanded={["documentRead", ...expandedInput]}
                defaultCollapseIcon={<FolderOpenIcon />}
                defaultExpandIcon={<CreateNewFolderIcon />}
                defaultEndIcon={<InsertDriveFileOutlinedIcon />}
                // sx={{ height: "100%", flexGrow: 1 }}
                onClick={() => updateXarrow}
              >
                {renderDocumentReadTree(input)}
              </TreeView>
            </div>
            <div className="output">
              <TreeView
                aria-label="rich object"
                defaultExpanded={["documentWrite", ...expandedOutput]}
                defaultCollapseIcon={<FolderOpenIcon />}
                defaultExpandIcon={<CreateNewFolderIcon />}
                defaultEndIcon={<InsertDriveFileOutlinedIcon />}
                // sx={{ height: "100%", flexGrow: 1 }}
                onClick={() => updateXarrow}
              >
                {renderDocumentWriteTree(output)}
              </TreeView>
            </div>
            {lines.map((line, i) => (
              <Xarrow
                key={i}
                start={line.expandedL ? line.expandedL : line.source}
                end={line.expandedR ? line.expandedR : line.target}
                zIndex={1}
                strokeWidth={2}
                color={line.type === "prefEdge" ? "orange" : "DimGray"}
                headSize={0}
                startAnchor={line.expandedL ? line.expandedL : line.source}
                endAnchor={line.expandedR ? line.expandedR : line.target}
              />
            ))}
          </Xwrapper>
        )}
      </div>
    </>
  );
}
