import { ViewNode } from './node';
import { TreeContainer } from './tree-container';
export class Operator extends TreeContainer {
  category:string;
  viewType:string = "Operator";
  inputCount: number = 0;
  outputCount: number = 0;
  inputs = [];
  outputs = [];
  height = 20;
  width = 120;
  color = "#f3f5f6"; inputTypes = []; outputTypes = [];
  inputLabels = []; outputLabels = [];
  max: number;

  constructor(category,title = "",
    x = 400, y = 40, inputTypes = [], outputTypes = [],
    inputLabels = [],
    outputLabels = []) {
    super("operator" + Math.round(Math.random() * 10000), "input", title, x, y);
    this.category = category;
    this.inputTypes = inputTypes;
    this.outputTypes = outputTypes;
    this.inputLabels = inputLabels;
    this.outputLabels = outputLabels;

    this.inputCount = this.inputLabels.length;
    this.outputCount = this.outputLabels.length;
    this.max = this.inputCount > this.outputCount ? this.inputCount : this.outputCount;

    let xx = 0;
    let yy = 20;
    var tempHeight = this.height;
    var tempWidth = this.width;
    if (this.inputCount > 0) {
      if (this.max !== this.inputCount) {
        tempHeight = (this.max * this.height / this.inputCount);
      }
      for (var i = 0; i < this.inputCount; i++) {
        var tempY = yy + i * tempHeight;
        var node: ViewNode = new ViewNode(this.id, null, this.id, this.inputLabels[i],
          this.inputTypes[i], xx, tempY, "output", "operator", true, tempHeight, this.width, i, false);
        this.inputs.push(node);
        this.nodeCollection.push(node);
      }
      xx += tempWidth;
    }
    else{
      tempWidth = this.width*2;
    }
    tempHeight = this.height;
    if (this.outputCount > 0) {
      if (this.max !== this.outputCount) {
        tempHeight = (this.max * this.height / this.outputCount);
      }
      for (var i = 0; i < this.outputCount; i++) {
        var tempY = yy + i * tempHeight;
        var node: ViewNode = new ViewNode(this.id, null, this.id, this.outputLabels[i],
          this.outputTypes[i], xx, tempY, "input", "operator", true, tempHeight, tempWidth, i, false);
        this.outputs.push(node);
        this.nodeCollection.push(node);
      }
    }

  }
}
