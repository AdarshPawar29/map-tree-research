import React, { useEffect, useState, useReducer } from "react";
import TreeView from "@mui/lab/TreeView";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import Xarrow, { Xwrapper } from "react-xarrows";

import TreeItem from "@mui/lab/TreeItem";
import { updateNodes } from "../utilsf";
import result from "./sampleTree.json";
import lodash from "lodash";
import { type } from "os";

const { allEdges } = updateNodes(result);

export default function ObjectTreeView() {
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
  useEffect(() => {
    console.log("render...");
  });

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
        target: child.expandedR === "" ? parentEdge.target : child.target,
        expandedL: nodes.entity_path,
        expandedR: child.expandedR ? child.expandedR : "",
        type: child.type,
      }));

      //Current node child edges
      let remainingEdges = lines.filter(
        (ele: any) => ele.source !== parentEdge.source
      );
      console.log(newChild, remainingEdges);

      //Update edge array to keep expanded att in sync
      newChild.map((child: any) => {
        edges.find((edge: any) => {
          if (edge.source === child.source) edge.expandedL = child.expandedL;
        });
      });

      setLines([...remainingEdges, ...newChild]);
    } else {
      //Find existing child for current parent
      const existingChild = lines.map((line: any) => {
        if (line.expandedL === nodes.entity_path) {
          line.source = line.expandedL;
        }
        return line;
      });
      // console.log(existingChild)
      
      childs.map((child: any) => {
        edges.find((edge: any) => {
          if (edge.source === child.source) edge.expandedL = "";
        });
      });

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
    console.log(child);
    console.log(lines);
    let newChild: any[] = [],
      target: string[] = [];
    edges.forEach(
      (edge: any) =>
        child.includes(edge.target) &&
        newChild.push(edge) &&
        target.push(edge.source)
    );
    return { newChild, target };
  };

  const childToParentRight = (nodes: any, childs: any, target: string[]) => {
    const parentEdge = lines.find((line) => line.target === nodes.entity_path);
    console.log(parentEdge, childs);
    //If parent edge is present we need to push it's child to current lines
    if (parentEdge && childs && target && childs.length > 0) {
      const newChild = childs.map((child: any) => ({
        source: child.expandedL === "" ? parentEdge.source : child.source,
        target: child.target,
        expandedL: child.expandedL ? child.expandedL : "",
        expandedR: nodes.entity_path,
        type: child.type,
      }));

      //Current node child edges
      const remainingEdges = lines.filter(
        (ele: any) => ele.target !== parentEdge.target
      );
      console.log(newChild, remainingEdges);

      newChild.map((child: any) => {
        edges.find((edge: any) => {
          if (edge.target === child.target) edge.expandedR = child.expandedR;
        });
      });

      setLines([...remainingEdges, ...newChild]);
    } else {
      console.log("parentEdge", lines, childs);
      //Find existing child for current parent
      const existingChild = lines.map((line: any) => {
        console.log(line.expandedR , nodes.entity_path)
        if (line.expandedR === nodes.entity_path) {
          line.target = line.expandedR;
        }
        return line;
      });

      childs.map((child: any) => {
        edges.find((edge: any) => {
          if (edge.target === child.target) edge.expandedR = "";
        });
      });

      //Find repeating child edge
      setLines(existingChild);
    }
  };

  const updateHeadRight = (nodes: any) => {
    if (nodes && nodes.name === "GROUPDEF") {
      const { newChild, target } = findRightChild(nodes);
      const childToParent = childToParentRight(nodes, newChild, target);
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
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  function handleClick() {
    setTimeout(() => {
      forceUpdate();
    }, 500/2);
  }
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
