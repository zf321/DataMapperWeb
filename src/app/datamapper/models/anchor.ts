import { Connector } from './connector';
import { Operator } from './operator';

export class Anchor {
  id: string;
  cx: number = 0;
  cy: number = 0;
  width: number = 10;
  height: number = 10;
  type: string = "input";

  constructor(cx = 0, cy = 0, type = "input") {
    this.cx = cx;
    this.cy = cy;
    this.type = type;
    this.id = "anchor-" + Math.round(Math.random() * 10000);
  }
}
