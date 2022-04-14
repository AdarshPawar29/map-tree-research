import * as React from "react";
import LeaderLineTree from "./LineTree";
import ObjectTreeView from "./ObjectTreeView";
import ObjectTreeViewLeft from "./ObjectTreeViewLeft"; //ObjectTreeView's are the one way to represent tree with object data
import BasicTreeView from "./BasicTreeView";

export interface ITreeTestProps {}

export default function TreeTest(props: ITreeTestProps) {
  return (
    <>
      {/* <div className="tree-box"> 
        <ObjectTreeView />

        <ObjectTreeViewLeft />
      </div> */}
      {/* <LeaderLineTree /> */}
      <div className="mt-5">
        <BasicTreeView />
      </div>
    </>
  );
}
