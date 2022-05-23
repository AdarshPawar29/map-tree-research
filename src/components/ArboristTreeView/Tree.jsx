import { Tree as ReactArborist } from "react-arborist";
import { useMemo, useRef, useState, useReducer } from "react";
import classNames from "classnames";
import "./tree.css";
import React from "react";
import Xarrow, { Xwrapper } from "react-xarrows";

function TreeNode({ innerRef, data, styles, state, handlers }) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  function handleClick() {
    setTimeout(() => {
      forceUpdate();
    }, 1000);
  }
  const hasChildren = data.children?.length > 0;

  return (
    <div
      ref={innerRef}
      style={styles.row}
      className={classNames("treeRow", state)}
      onClick={(e) => {
        handlers.select({});
        handleClick();
      }}
    >
      <div
        className="treeRowContent"
        style={styles.indent}
        id={data.id}
        onClick={handleClick()}
      >
        <i
          className={classNames(
            "treeIcon",
            hasChildren && "treeIcon--children"
          )}
          onClick={hasChildren ? handlers.toggle : undefined}
        >
          {hasChildren ? (state.isOpen ? "-" : "+") : ""}
        </i>
        <span className="treeLabel">{data.javaName}</span>
      </div>
    </div>
  );
}

export function Tree({
  data,
  childrenKey = "children",
  isOpenKey = "isOpen",
  lines,
}) {
  const [root, setRoot] = useState({ id: 0, isRoot: true, javaName: "root" });
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  function handleClick() {
    setTimeout(() => {
      forceUpdate();
    }, 1000);
  }
  const treeData = useMemo(
    () => ({ ...root, [childrenKey]: data }),
    [root, data, childrenKey]
  );

  const [openDict, setOpenDict] = useState({
    documentRead: true,
    documentWrite: true,
  });

  const treeRef = useRef();

  return (
    <>
      {" "}
      <Xwrapper>
        <ReactArborist
          ref={treeRef}
          className="my-tree"
          data={treeData}
          getChildren={childrenKey}
          isOpen={(item) => (item.isRoot ? true : openDict[item.id] === true)}
          openByDefault={false}
          disableDrag
          disableDrop
          hideRoot
          indent={24}
          onToggle={(id, isOpen) => {
            console.log("onToggle", { id, isOpen });
            setOpenDict((state) => ({ ...state, [id]: isOpen }));
            setRoot((r) => ({ ...r }));
            handleClick();
          }}
          rowHeight={24}
          onClick={() =>
            console.log("clicked the tree", treeRef.current.getSelectedIds())
          }
        >
          {TreeNode}
        </ReactArborist>
        {lines.map((line, i) => (
          <Xarrow
            key={i}
            start={line.source}
            end={line.target}
            zIndex={1}
            strokeWidth={2}
            color={
              line.type === "prefEdge"
                ? "orange"
                : line.type === "group"
                ? "blue"
                : "DimGray"
            }
            headSize={0}
            startAnchor="right"
            endAnchor={"left"}
          />
        ))}
      </Xwrapper>
    </>
  );
}
