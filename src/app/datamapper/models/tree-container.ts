import { TreeStructure } from "./tree-structure";
import { ViewNode } from "./node";

export class TreeContainer {
  viewType:string = "TreeContainer";
  id: string;
  elementCount: number = 0;
  x: number = 0;
  y: number = 40;
  containerWidth: number = 300;
  nodeHeight: number = 20;
  rankMargin: number = 50;
  type: string = "input";
  title: string;
  tree: TreeStructure;
  nodeCollection: ViewNode[] = [];

  constructor(id = "container", type = "input",
    title = "",
    x = 0,
    y = 40) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.x = x;
    this.y = y;
  }
}
