export class LinkService {
  preferencesEdges: any[] = [];
  node: any[] = [];
  edges: any[] = [];
  proxyMap: any = {};
  pathHashMap: any = {};

  updateConnections(map: any) {
    // clear an array on updating
    this.edges.length = 0;
    this.preferencesEdges.length = 0;
    // this.treeService.clearNodes();
    // this._clearPathMap();
    map = {
      output: [this.filterMapData(map.output.children[0], "output", map)],
      input: [this.filterMapData(map.input.children[0], "input", map)],
      edges: this.edges,
      preferencesEdges: this.preferencesEdges,
      mapName: map.repo,
      proxyMap: this.proxyMap,
      // node: this.node
    };
    return map;
    // this.treeService.pathHashMap = this.pathHashMap;
    // this.broadcaster.broadcast("onConnectionsMade", this.map);
  }

  filterMapData = (
    data: any,
    map: any,
    io: string,
    path?: string,
    root?: string,
    doc?: string
  ) => {
    const parentPath = data.atts.javaName;
    const pathRoot = data.atts.javaName;

    let docDef: any = null;
    let parentEntity: any = null;

    data.entity_path = pathRoot;
    data.has_prefs = false;

    if (data.name === "DOCUMENTDEF") {
      docDef = data.atts.javaName;
      parentEntity = data.atts.javaName;
      this.addNode(data, io);
    }

    if (data.atts.name && data.atts.name.length > 0) {
      data.title = data.atts.javaName;
    } else {
      data.title = "(" + data.atts.javaName + ")";
    }
    data.javaName = data.atts.javaName;
    this.proxyMap[pathRoot] = parentEntity ? parentEntity : root;
    if (data.children) {
      if (data.name === "DOCUMENTDEF") {
        data.expanded = true;
      }
      this.getPrefEdge(data);
      data.children.forEach((child: any, index: number) => {
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
          this.addPath(pathRoot, child);
          // FIELDDEF that is a direct child of root should be its own "proxy"
          if (child.name === "FIELDDEF" && child.root === parentPath) {
            this.proxyMap[child.entity_path] = child.entity_path;
          } else {
            this.proxyMap[child.entity_path] = parentEntity
              ? parentEntity
              : root;
          }
          if (child.atts.name && child.atts.name.length > 0) {
            child.title = child.atts.name;
          } else {
            child.title = "(" + child.atts.javaName + ")";
          }
          if (child.atts.source) {
            this.edges.push({
              target: child.entity_path,
              source: child.atts.source,
            });
            child.from = child.entity_path;
          } else if (child.atts.target) {
            this.edges.push({
              source: child.entity_path,
              target: child.atts.target,
            });
            child.to = child.atts.target;
          } else {
            child.to = child.entity_path;
          }
          this.getPrefEdge(child);
          this.filterMapData(child, io, pathRoot, parentEntity, docDef, map);
        }
        this.addNode(child, io);
      });
    }
    return data;
  };

  getPrefEdge = (data: any) => {
    if (data.atts.preferences) {
      data.atts.preferences.forEach((pref: any) => {
        if (pref.property === "source") {
          this.splitValue(pref.value).forEach((sourcing) => {
            this.preferencesEdges.push({
              target: data.entity_path,
              source: this.removeQualifiers(sourcing),
            });
          });
        } else if (pref.property === "target") {
          this.splitValue(pref.value).forEach((sourcing) => {
            this.preferencesEdges.push({
              target: this.removeQualifiers(sourcing),
              source: this.node,
            });
          });
        }
      });
    }
  };

  removeQualifiers(path: string) {
    const p = path.trim();
    if (p.indexOf("[") > -1) {
      if (p.indexOf("]") > -1) {
        return p.replace(/ *\[[^\]]*]/, "");
      } else {
        return p.replace(/ *\[[^\.]*./, ".");
      }
    } else {
      return p;
    }
  }

  splitValue = (sourcing: string) => {
    const regex = /,(?![^\(\[]*[\]\)])/;
    if (regex.test(sourcing)) {
      return sourcing.split(regex);
    } else {
      return [sourcing];
    }
  };

  addNode = (data: any, source: string) => {
    if (
      data.name === "GROUPDEF" ||
      data.name === "FIELDDEF" ||
      data.name === "DOCUMENTDEF"
    ) {
      let icon = "";
      switch (data.name) {
        case "GROUPDEF":
          icon = "folder";
          break;
        case "FIELDDEF":
          icon = "file";
          break;
        case "DOCUMENTDEF":
          icon = "database";
      }

      const nodePath = {
        javaName: data.atts.javaName,
        title: data.atts.name,
        entity_path: data.entity_path,
        hasPrefs: data.atts.preferences ? true : false,
        name: data.name,
        icon: icon,
        children: data.children ? data.children : null,
        source: source,
      };
      this.node.push(nodePath);
    }
  };

  addPath(parent: any, node: any) {
    if (this.pathHashMap[parent]) {
      this.pathHashMap[parent].push(node);
    } else {
      this.pathHashMap[parent] = [node];
    }
  }
}
