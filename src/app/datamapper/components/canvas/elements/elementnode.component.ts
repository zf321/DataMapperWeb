import { style } from '@angular/animations';
import { Anchor } from '../../../models/anchor';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as d3 from "d3";
import { ViewNode } from '../../../models/node';
@Component({
  selector: '[node-element]',
  templateUrl: "elementnode.component.html",
  styles: [`
    .node-element {
      display:inline;
    }
  `]
})

export class NodeComponent implements OnInit, AfterViewInit {
  @Input() node: ViewNode;
  Array = Array;
  constructor() { }

  ngOnInit() { }

  ngAfterViewInit(): void {
  }



  updateIcon = () => {
    var type = this.node.category;
    if (type === "object") {
      return this.node.objectIcon;
    } else if (type === "array") {
      return this.node.arrayIcon;
    } else if (type === "attribute") {
      return this.node.attributeIcon;
    }
    return this.node.leafIcon;
  }


}
