import React from "react";

import TreeTest from "./components/TreeTest"; //mui tree (we are using it right now)
import ArboristTreeView from "./components/ArboristTreeView/ArboristTreeView"; //different tree component

import "./App.css";

function App() {
  return (
    <div className="App">
      <TreeTest />
      {/* <ArboristTreeView /> */}
    </div>
  );
}

export default App;
