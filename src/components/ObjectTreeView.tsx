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
  const updateXarrow = setTimeout(useXarrow(), 500);

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

  const testExpand: string[] = [];
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

  const childToParentLeft = (nodes: any, childs: any) => {
    //Check if the node is open
    const parentEdge = lines.find((line) => line.source === nodes.entity_path);
    console.log(parentEdge, childs);
    console.log(lines);
    //If parent edge is present we need to push it's child to current lines
    if (parentEdge && childs && childs.length > 0) {
      const newChild = childs.map((child: any) => ({
        source: child.source,
        target: parentEdge.target,
        expandedL: nodes.entity_path,
        expandedR: "",
        type: child.type === "prefEdge" ? "prefEdge" : "file",
      }));

      //Current node child edges
      let remainingEdges = lines.filter(
        (ele: any) => ele.source !== parentEdge.source
      );

      setLines([...remainingEdges, ...newChild]);
    } else {
      //Find existing child for current parent
      const existingChild = lines.map((line: any) => {
        if (line.expandedL === nodes.entity_path) {
          line.source = line.expandedL;
          line.expandedL = "";
        }
        return line;
      });
      //Current node child edges
      // const remainingEdges = lines.filter(
      //   (ele: any) => ele.source !== parentEdge.source
      // );

      //Find repeating child edge
      setLines(existingChild);
    }
  };

  const updateHeadLeft = async (nodes: any) => {
    console.log(nodes);
    if (nodes && nodes.name === "GROUPDEF") {
      const child = findLeftChild(nodes);
      const childToParent = childToParentLeft(nodes, child);
    }
  };

  const findRightChild = (nodes: any) => {
    const child = nodes.children.map((node: any) => node.entity_path);
    let newChild: any[] = [];
    edges.forEach(
      (edge: any) => child.includes(edge.target) && newChild.push(edge)
    );
    return newChild;
  };

  const childToParentRight = (nodes: any, childs: any) => {
    const parentEdge = lines.find((line) => line.target === nodes.entity_path);
    // console.log(parentEdge, childs);
    //If parent edge is present we need to push it's child to current lines
    if (parentEdge && childs && childs.length > 0) {
      const newChild = childs.map((child: any) => ({
        source: parentEdge.source,
        target: child.target,
        expandedL: "",
        expandedR: nodes.entity_path,
        type: child.type === "prefEdge" ? "prefEdge" : "file",
      }));

      //Current node child edges
      let remainingEdges = lines.filter(
        (ele: any) => ele.target !== parentEdge.target
      );
      console.log(newChild);
      setLines([...remainingEdges, ...newChild]);
    } else {
      console.log("parentEdge", parentEdge, childs);
      //Find existing child for current parent
      const existingChild = lines.map((line: any) => {
        if (line.expandedR === nodes.entity_path) {
          line.target = line.expandedR;
          line.expandedR = "";
        }
        return line;
      });

      //Find repeating child edge
      setLines(existingChild);
    }
  };

  const updateHeadRight = (nodes: any) => {
    if (nodes && nodes.name === "GROUPDEF") {
      const child = findRightChild(nodes);
      const childToParent = childToParentRight(nodes, child);
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
                start={line.source ? line.source : line.expandedL}
                end={line.target ? line.target : line.expandedR}
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
