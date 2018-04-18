import { Observable, Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ConfirmationService } from 'primeng/primeng';
import { TreeContainerComponent } from './elements/treecontainer.component';
import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { TreeContainer } from '../../models/tree-container';
import { CanvasService } from '../../services/canvas.service';
import { Diagram } from '../../models/diagram';
import * as d3 from "d3";
import { Operator } from '../../models/operator';

@Component({
  selector: '[canvas]',
  templateUrl: 'canvas-view.component.html'
})

export class CanvasComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('fileUpload') private fileUpload;
  constructor(private confirmationService: ConfirmationService, public canvasService: CanvasService) {

  }
  selectFileType = {
    name: "XML",
    id: "xml",
    extension: ".xml"
  };
  displayLoadFile;
  displayLoadFileSubscription: Subscription;
  @Input() diagram: Diagram;
  ngOnInit() {
    this.displayLoadFileSubscription = this.canvasService.displayLoadFiled$.subscribe(e => { this.displayLoadFile = e });


    //create zoom handler
    var zoom_handler = d3.zoom()
      .on("zoom", this.zoomed);


    //add zoom behaviour to the svg element backing our graph.
    //same thing as svg.call(zoom_handler);


    let svg = d3.select("svg");
    // svg.call(d3.zoom()
    //   .scaleExtent([1 / 2, 8])
    //   .on("zoom", this.zoomed));
      zoom_handler(svg);
  }
  ngAfterViewInit(): void {

  }
  ngOnDestroy() {
    this.displayLoadFileSubscription.unsubscribe();
  }
  dropTool = (evt) => {
    if (this.canvasService.tool) {
      var tool = this.canvasService.tool;
      var newPosX = evt.offsetX;
      var newPosY = evt.offsetY;
      if (tool.defaults.isContainer) {
        this.addExtraSchema(tool, newPosX, newPosY);
      } else {
        this.addOperator(tool, newPosX, newPosY);
      }
      this.canvasService.tool = null;
    }
  }



  addExtraSchema = (tool, xx, yy) => {
    var type = tool.defaults.type;

    var model = new TreeContainer(
      "container" + Math.round(Math.random() * 10000),
      type,
      tool.title,
      xx, //this.model.get('x'),
      yy //this.model.updateContainerHeight()
    );

    this.diagram.TreeContainers.push(model);
  }

  addOperator = (tool, x, y) => {

    var operator = new Operator(
      tool.id,
      tool.title,
      x = x,
      y = y,
      tool.defaults.inputTypes,
      tool.defaults.outputTypes,
      tool.defaults.inputLabels,
      tool.defaults.outputLabels,
      // arguments= tool.get('defaults').arguments
    );

    this.diagram.Operators.push(operator);
  }
  upload = (evt) => {
    this.canvasService.loadFile(evt);
    this.fileUpload.clear();
  }
  zoomed() {
    let g = d3.select("allG");
    g.attr("transform", d3.event.transform);
  }




  fileOptionList = [
    {
      name: "XML",
      id: "xml",
      extension: ".xml"
    },
    {
      name: "JSON",
      id: "json",
      extension: ".json"
    },
    {
      name: "CSV",
      id: "csv",
      extension: ".csv"
    }, {
      name: "XSD",
      id: "xsd",
      extension: ".xsd"
    },
    // {
    //   name: "JSON Schema",
    //   id: "jsonschema",
    //   extension: ".json"
    // },
    // {
    //   name: "Connector",
    //   id: "connector",
    //   extension: "*"
    // }
  ];
}
