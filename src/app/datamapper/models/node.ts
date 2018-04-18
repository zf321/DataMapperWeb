import { TreeContainer } from './tree-container';
import { Anchor } from './anchor';
export class ViewNode {
  id: string;
  arrayId = 0;
  parent;
  text = "";
  x: number = 0;
  y: number = 0;
  width: number = 170;
  height: number = 20;
  textType: string = "String";
  type: string = ""; //input or output or null
  category: string = "leaf"; //object; array or endType or operator;
  dotPosition = [];
  objectIcon: string = "assets/images/datamapper/object-icon.png";
  arrayIcon: string = "assets/images/datamapper/array-icon.png";
  leafIcon: string = "assets/images/datamapper/leaf-icon.png";
  attributeIcon: string = "assets/images/datamapper/attribute-icon.png";
  parentNodeId: string;
  parentContainerId: string; isLeaf: boolean; isSchema: boolean; rank: number; supportGroup: string;
  anchor: Anchor;

  constructor(parent,
    parentNodeId:string,
    parentContainerId:string,
    text:string,
    textType:string,
    x:number,
    y:number,
    type:string,
    category:string,
    isLeaf:boolean,
    nodeHeight:number,
    containerWidth:number,
    rank:number, isSchema = true) {
    this.parent = parent;
    this.parentNodeId = parentNodeId;
    this.parentContainerId = parentContainerId;
    this.text = text;
    this.textType = textType;
    this.x = x;
    this.y = y;
    this.type = type;
    this.category = category;
    this.isLeaf = isLeaf;
    this.height = nodeHeight;
    this.width = containerWidth;
    this.isSchema = isSchema;
    this.rank = rank;
    this.id = "node-" + Math.round(Math.random() * 10000);
    this.updateLeaf();

  }

  updateLeaf = () => {
    if (this.textType !== "object" && this.textType !== "array") {
      // if (!this.isLeaf) {
      this.isLeaf = true;
      if (this.dotPosition.length !== 2) {
        this.calculateDotPosition();
      }

      this.anchor = new Anchor(
        this.dotPosition[0],
        this.dotPosition[1],
        this.type

      );
      // }
    }
  }

  calculateDotPosition = () => {
    if (this.isLeaf) {
      if (this.type === "input") {
        this.dotPosition = [Number(this.x) + Number(this.width), Number(this.y) + this.height / 2];
      } else if (this.type === "output") {
        this.dotPosition = [Number(this.x), Number(this.y) + this.height / 2];
      }
    }
  }
  updateText = () => {
    this.text = this.text + ":" + this.textType;
  }
}
