import React, { useEffect, useState } from "react";
import TreeView from "@mui/lab/TreeView";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";

import TreeItem from "@mui/lab/TreeItem";
import { updateNodes } from "../utilsf";
import result from "./sampleTree.json";

// interface RenderTree {
//   id: string;
//   name: string;
//   start?: string;
//   isExpanded?: boolean;
//   children?: readonly RenderTree[];
// }

// const dataLeft: RenderTree = {
//   id: "root",
//   name: "Left Tree",
//   isExpanded: true,
//   children: [
//     {
//       id: "1",
//       name: "Child - 1",
//       isExpanded: true,
//       children: [
//         {
//           id: "5",
//           name: "Child - 5",
//         },
//       ],
//     },
//     {
//       id: "3",
//       name: "Child - 3",
//       isExpanded: true,

//       children: [
//         {
//           id: "4",
//           name: "Child - 4",
//           isExpanded: true,
//           children: [
//             {
//               id: "8",
//               name: "Child - 8",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "6",
//       name: "Child - 6",
//       isExpanded: true,
//       children: [
//         {
//           id: "7",
//           name: "Child - 7",
//         },
//       ],
//     },
//   ],
// };

// const dataRight: RenderTree = {
//   id: "root",
//   name: "Left Tree",
//   isExpanded: true,
//   children: [
//     {
//       id: "10",
//       name: "Child - 10",
//     },
//     {
//       id: "30",
//       name: "Child - 30",
//       isExpanded: true,
//       children: [
//         {
//           id: "40",
//           name: "Child - 40",
//           isExpanded: true,
//           children: [
//             {
//               id: "80",
//               name: "Child - 80",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "60",
//       name: "Child - 60",
//       isExpanded: true,
//       children: [
//         {
//           id: "70",
//           name: "Child - 70",
//         },
//       ],
//     },
//   ],
// };
// const [lines, setLines] = useState([
//   { from: "5", to: "80" },
//   { from: "8", to: "70" },
//   { from: "7", to: "10" },
//   { from: "1", to: "30" },
//   { from: "4", to: "30" },
// ]);

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
  const updateXarrow = setTimeout(useXarrow(), 1000);
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
              start={`${line.source}`}
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
