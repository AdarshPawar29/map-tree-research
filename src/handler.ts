export const splitValue = (sourcing: string) => {
  const regex = /,(?![^\(\[]*[\]\)])/;
  if (regex.test(sourcing)) {
    return sourcing.split(regex);
  } else {
    return [sourcing];
  }
};

export const getPrefEdge = (data: any, preferencesEdges: any) => {
  if (data.atts.preferences) {
    data.atts.preferences.forEach((pref: any) => {
      if (pref.property === "source") {
        splitValue(pref.value).forEach((sourcing) => {
          preferencesEdges.push({
            target: data.entity_path,
            source: removeQualifiers(sourcing),
            type: "prefEdge",
          });
        });
      } else if (pref.property === "target") {
        splitValue(pref.value).forEach((sourcing) => {
          preferencesEdges.push({
            target: removeQualifiers(sourcing),
            source: data.entity_path,
            type: "prefEdge",
          });
        });
      }
    });
  }
};

export const removeQualifiers = (path: string) => {
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
};

export const addNode = (data: any, source: string, node: any) => {
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
    node.push(nodePath);
  }
};

export const addPath = (parent: any, node: any) => {
  let pathHashMap: any[] = [];
  if (pathHashMap[parent]) {
    pathHashMap[parent].push(node);
  } else {
    pathHashMap[parent] = [node];
  }
};

export const removeExtraNode = (data: any) => {
  const updatedChild = data.children.filter(
    (child: any) =>
      child.name === "GROUPDEF" ||
      child.name === "FIELDDEF" ||
      child.name === "DOCUMENTDEF"
  );
  return { ...data, children: updatedChild };
};
