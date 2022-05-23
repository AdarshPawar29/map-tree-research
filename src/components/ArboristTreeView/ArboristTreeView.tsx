import React from "react";
import { Tree } from "./Tree";

import sampleJSON from "../sampleTree.json";
import { updateNodes } from "../../utilsf";

type Props = {};

export default function ArboristTreeView({}: Props) {
  const [data, setData] = React.useState<any>({});
  const [lines, setLines] = React.useState<any>([]);

  React.useEffect(() => {
    const parsedData = updateNodes(sampleJSON);
    setData(parsedData);
    setLines(parsedData.edges);
  }, []);
  return (
    <>
      <div>ArboristTreeView</div>
      <div
      // style={{
      //   //   display: "inline-block",
      //   //   width: "400px",
      //   //   height: "200px",
      //   border: "1px solid black",
      //   borderRadius: "3px",
      //   textAlign: "left",
      //   padding: "0.5em",
      //   boxSizing: "border-box",
      // }}
      >
        <div className="tree-arborist">
          <Tree data={data.input} lines={lines} />
          <Tree data={data.output} lines={lines} />
        </div>
      </div>
    </>
  );
}
