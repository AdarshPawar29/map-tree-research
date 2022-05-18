import * as React from "react";
import ObjectTreeView from "./ObjectTreeView";

export interface ITreeTestProps {}

export default function TreeTest(props: ITreeTestProps) {
  return (
    <>
      <div className="mt-5">
        <ObjectTreeView />
      </div>
      {/* <div className="mt-5">
        
      </div> */}
    </>
  );
}