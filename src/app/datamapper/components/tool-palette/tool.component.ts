import { style } from '@angular/animations';
import { Component, OnInit, Input } from '@angular/core';
import * as d3 from "d3";
import D3Utils from 'd3';
@Component({
  selector: 'tool',
  template: `
  <div [id]="id" class="tool-container"  > <img [src]="icon" class="tool-image"  /><p class="tool-title">{{title}}</p></div>
  `,
  styles: [`

  .tool-container {
    cursor: pointer;
    border-style: solid;
    border-color: #8d8d8d;
    border-width: 1px;
    text-align: center;
  }
    .tool-image {
      max-width: 60px;
      max-height: 75px;
      display: block;
      margin: auto;
  }
  .tool-title {
    text-align:center
  }
  `]
})

export class ToolComponent implements OnInit {
  @Input() id: string;
  @Input() icon: string;
  @Input() title: string;
  constructor() { }

  ngOnInit() { }


  createContainerForDraggable = () => {
    var body = d3.select("body");
    var div = body.append("div").attr("id", "draggingToolClone");
    div = D3Utils.decorate(div);
    return div;
  }
}
