
import { TreeStructure } from './../../../models/tree-structure';
import { Component, OnInit, Input } from '@angular/core';
import * as d3 from "d3";
import { ViewNode } from '../../../models/node';
@Component({
  selector: '[tree-structure]',
  templateUrl: "treestructure.component.html"
})

export class TreeStructureComponent implements OnInit {

  @Input() treeStructure: TreeStructure;
  constructor() { }

  ngOnInit() { }



}
