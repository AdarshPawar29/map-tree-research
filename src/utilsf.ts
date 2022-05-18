import { addNode, getPrefEdge, addPath } from "./handler";

const edges: any[] = [];
const preferencesEdges: any[] = [];
const proxyMap: any[] = [];
const node: any[] = [];
const defaultExpandedInput: string[] = ["documentRead"];
const defaultExpandedOutput: string[] = ["documentWrite"];

export const updateNodes = (map: any) => {
  map = {
    output: [filterData(map.output.children[0], "output")],
    input: [filterData(map.input.children[0], "input")],
    edges: [...edges, ...preferencesEdges],
    preferencesEdges: preferencesEdges,
    mapName: map.repo,
    proxyMap: proxyMap,
    defaultExpandedInput: defaultExpandedInput,
    defaultExpandedOutput: defaultExpandedOutput,
  };
  return map;
};

export const filterData = (
  data: any,
  io: string,
  path?: string,
  root?: string,
  doc?: string
) => {
  const parentPath = path ? path : data.atts.javaName;
  const pathRoot = path
    ? parentPath + "." + data.atts.javaName
    : data.atts.javaName;

  let docDef: any = null;
  let parentEntity: any = null;

  data.entity_path = pathRoot;
  data.has_prefs = false;

  if (data.name === "DOCUMENTDEF") {
    docDef = data.atts.javaName;
    parentEntity = data.atts.javaName;
    addNode(data, io, node);
  } else if (path && root && doc && root === path) {
    parentEntity = pathRoot;
  } else {
    addPath(parentPath, data);
    parentEntity = root;
  }

  if (root) {
    data.root = root;
  }

  if (data.atts.name && data.atts.name.length > 0) {
    data.title = data.atts.javaName;
  } else {
    data.title = "(" + data.atts.javaName + ")";
  }

  // We need to promote javaName to the top level to provide a consistent interface for consumers
  data.javaName = data.atts.javaName;
  proxyMap[pathRoot] = parentEntity ? parentEntity : root;
  if (data.children) {
    if (data.name === "DOCUMENTDEF") {
      data.expanded = true;
    }
    getPrefEdge(data, preferencesEdges);
    data.children.forEach((child: any) => {
      if (parentEntity) {
        child.root = parentEntity;
      }
      if (
        child.name === "GROUPDEF" ||
        child.name === "FIELDDEF" ||
        child.name === "DOCUMENTDEF"
      ) {
        child.entity_path = pathRoot + "." + child.atts.javaName;

        child.javaName = child.atts.javaName;
        addPath(pathRoot, child);
        // FIELDDEF that is a direct child of root should be its own "proxy"
        if (child.name === "FIELDDEF" && child.root === parentPath) {
          proxyMap[child.entity_path] = child.entity_path;
        } else {
          proxyMap[child.entity_path] = parentEntity ? parentEntity : root;
        }
        if (child.atts.name && child.atts.name.length > 0) {
          child.title = child.atts.name;
        } else {
          child.title = "(" + child.atts.javaName + ")";
        }
        if (child.name === "FIELDDEF") {
          if (child.atts.source) {
            edges.push({
              target: child.entity_path,
              source: child.atts.source,
            });
          } else if (child.atts.target) {
            edges.push({
              source: child.entity_path,
              target: child.atts.target,
            });
          }
        } else {
          if (io === "input") {
            defaultExpandedInput.push(child.atts.name);
          }
          if (io === "output") {
            defaultExpandedOutput.push(child.atts.name);
          }
        }
        getPrefEdge(child, preferencesEdges);
        filterData(child, io, pathRoot, parentEntity, docDef);
      }
      addNode(child, io, node);
    });
  }
  return data;
};
