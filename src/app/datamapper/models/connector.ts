import { ViewNode } from './node';
import { TreeContainer } from './tree-container';
import { Operator } from "./operator";

export class Connector {
  id: string;
  sourceContainerId: string;
  sourceContainerType: string;
  sourceNodeId: string ;
  targetContainerId: string;
  targetContainerType: string;
  targetNodeId: string;
  x1: number; x2: number; y1: number; y2: number;
  operatorId:string;

  constructor() {
    this.id = "line-" + Math.round(Math.random() * 10000);
  }
  isDirectConnector = () => {
    return this.sourceContainerType == "TreeContainer" && this.targetContainerType == "TreeContainer";
  }
}
