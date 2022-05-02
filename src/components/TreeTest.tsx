import * as React from "react";
import ObjectTreeView from "./ObjectTreeView";
import ObjectTreeViewLeft from "./ObjectTreeViewLeft"; //ObjectTreeView's are the one way to represent tree with object data

export interface ITreeTestProps {}

export default function TreeTest(props: ITreeTestProps) {
  return (
    <>
      <div className="mt-5">
        <ObjectTreeView />
        {/* <ObjectTreeViewLeft /> */}
      </div>
      {/* <div className="mt-5">
        
      </div> */}
    </>
  );
}
