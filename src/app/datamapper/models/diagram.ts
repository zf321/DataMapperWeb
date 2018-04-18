import { Operator } from './operator';
import { Connector } from './connector';
import { TreeContainer } from './tree-container';
export class Diagram {
  Id: string;
  Name: string;
  TreeContainers: TreeContainer[] = [];
  /*  Input/Output container  the model contains the loaded schema as a JSON object and a collection of nodes */
  Connectors: Connector[] = [];//all the 'lines' drawn in the application
  Operators: Operator[] = [];

  init(){

    let inputStartX = 40;
    let inputStartY = 40;
    let outputStartX = 1000;
    let outputStartY = 40;
    var inputModel = new TreeContainer(
      "input-dmcontainer0",
      "input",
      "Input",
      inputStartX,
      inputStartY
    );
    var outputModel = new TreeContainer(
      "output-dmcontainer0",
      "output",
      "Output",
      outputStartX,
      outputStartY
    );
    this.TreeContainers = [inputModel, outputModel];
  }
  constructor() {
  }
}
