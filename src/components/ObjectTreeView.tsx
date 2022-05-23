import React, { useEffect, useState } from "react";
import TreeView from "@mui/lab/TreeView";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";

import TreeItem from "@mui/lab/TreeItem";
import { updateNodes } from "../utilsf";
import result from "./sampleTree.json";
import lodash from "lodash";
import { type } from "os";

const { allEdges } = updateNodes(result);

export default function ObjectTreeView() {
  const updateXarrow = setTimeout(useXarrow(), 1000);

  const [input, setInput] = useState([]);
  const [output, setOutput] = useState([]);
  const [lines, setLines] = useState<any[]>([]);
  const [edges, setEgdes] = useState([]);
  // const [expandedInput, setExpandedInput] = useState<string[]>([
  //   ...defaultExpandedInput,
  // ]);
  // const [expandedOutput, setExpandedOutput] = useState<string[]>([
  //   ...defaultExpandedOutput,
  // ]);

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
    setLines(allEdges);
    setEgdes(filtered.edges);
    console.log(filtered);
  }, []);

  const findLeftChild = (nodes: any) => {
    const child = nodes.children.map((node: any) => node.entity_path);
    let newChild: any[] = [];
    edges.forEach(
      (edge: any) => child.includes(edge.source) && newChild.push(edge)
    );
    return newChild;
  };

  const findRightChild = (nodes: any) => {
    const child = nodes.children.map((node: any) => node.entity_path);
    let newChild: any[] = [];
    edges.forEach(
      (edge: any) => child.includes(edge.target) && newChild.push(edge)
    );
    return newChild;
  };

  const updateHeadLeft = async (nodes: any) => {
    if (nodes && nodes.name === "GROUPDEF") {
      const child = findLeftChild(nodes);
      const parent = allEdges.find(
        (ele: any) => ele.source === nodes.entity_path
      );
      //Find parent inside current array
      const io = lines.find((ele: any) => ele.source === nodes.entity_path);
      if (io) {
        const newChild = child.map((child) => ({
          source: child.source,
          target: parent.target,
          type: child.type && child.type,
          expandedL: parent.source,
          expandedR: "",
        }));
        //Current node child edges
        const remainingEdges = lines.filter(
          (ele: any) => ele.source !== parent.source
        );

        //Find repeating child edge
        setLines([...remainingEdges, ...newChild]);
      } else {
        // Find the parent edge mapping
        const parentEdge: any = edges.find(
          (ele: any) => ele.source === nodes.entity_path
        );

        if (parentEdge) {
          lines.push(parentEdge);
        }
        // Remove the child lines
        const filteredLines = lines.filter((ele: any) => {
          const childFound = child.find(
            (childElem: any) => childElem.source === ele.source
          );
          return !childFound;
        });

        setLines(filteredLines);
      }
    }
  };

  const updateHeadRight = (nodes: any) => {
    if (nodes && nodes.name === "GROUPDEF") {
      const child = findRightChild(nodes);
      const parent = allEdges.find(
        (ele: any) => ele.target === nodes.entity_path
      );
      //Find parent inside current array
      const io = lines.find((ele: any) => ele.target === nodes.entity_path);
      if (io) {
        const newChild = child.map((child) => ({
          source: parent.source,
          target: child.target,
          type: child.type,
        }));
        //Current node child edges
        const remainingEdges = allEdges.filter(
          (ele: any) => ele.target !== parent.target
        );

        //Find repeating child edge
        setLines([...remainingEdges, ...newChild]);
      } else {
        // Find the parent edge mapping
        const parentEdge: any = edges.find(
          (ele: any) => ele.target === nodes.entity_path
        );
        // console.log(parentEdge)
        if (parentEdge) {
          lines.push(parentEdge);
        }
        // Remove the child lines
        const filteredLines = lines.filter((ele: any) => {
          const childFound = child.find(
            (childElem: any) => childElem.target === ele.target
          );
          return !childFound;
        });

        setLines(filteredLines);
      }
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
                defaultExpanded={["documentRead"]}
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
                defaultExpanded={["documentWrite"]}
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
                start={line.source}
                end={line.target}
                zIndex={1}
                strokeWidth={2}
                color={line.type === "prefEdge" ? "orange" : "DimGray"}
                headSize={0}
                // startAnchor="left"
                // endAnchor={"right"}
              />
            ))}
          </Xwrapper>
        )}
      </div>
    </>
  );
}
