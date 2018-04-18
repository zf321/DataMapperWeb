import { TreeContainer } from './../../../models/tree-container';
import { CanvasService } from '../../../services/canvas.service';
import { Diagram } from '../../../models/diagram';
import { ConfirmationService } from 'primeng/primeng';
import { Component, OnInit ,Input} from '@angular/core';
import * as d3 from "d3";
import { Operator } from '../../../models/operator';
@Component({
  selector: '[container]',
  template: `

  `
})

export class ContainerComponent implements OnInit {
  diagram: Diagram;
  constructor(public confirmationService: ConfirmationService, public canvasService: CanvasService) {
    this.diagram = this.canvasService.diagram;
  }
  @Input() model;
  ngOnInit() { }

  dragContainer = () => {
    var self = this;
    var selfModel = this.model;
    return d3.drag()
      .on("start", function () { })
      .on("drag", function (d, i) {
        selfModel.x += d3.event.dx;
        selfModel.y += d3.event.dy;
        d3.select(this).attr("transform", "translate(" + [selfModel.x, selfModel.y] + ")");
        self.updateConnections(d3.event.dx, d3.event.dy);
        //self.resizeCanvas(this.x, this.y);
      })
      .on("end", function () {
      });
  }
  confirmDeletion = function () {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.deleteContainer();
      },
      reject: () => {
      }
    });
  }

  deleteContainer =  ()=> {
    let self = this;
    self.diagram.Connectors.filter(c=>c.targetContainerId == self.model.id).map(function (connector) {
      self.diagram.Connectors.splice(self.diagram.Connectors.indexOf(connector), 1);
    });
    self.diagram.Connectors.filter(c=>c.sourceContainerId == self.model.id).map(function (connector) {
      self.diagram.Connectors.splice(self.diagram.Connectors.indexOf(connector), 1);
    });
    if(this.model instanceof Operator) {
      self.diagram.Operators.splice(self.diagram.Operators.indexOf(self.model), 1);
    } else {
      self.diagram.TreeContainers.splice(self.diagram.TreeContainers.indexOf(self.model), 1);
    }
    self.model = null;
  }

  updateConnections = (newX, newY) => {
    var sourceContainer = d3.select("#" + this.model.id);
    this.diagram.Connectors.filter(c=>c.sourceContainerId == this.model.id).map(function (connector) {
      connector.x1 = connector.x1 + newX;
      connector.y1 = connector.y1 + newY;
      // connector.setPoints(connector.get('x1'), connector.get('x2'), connector.get('y1'), connector.get('y2'));
    });

    this.diagram.Connectors.filter(c=>c.targetContainerId == this.model.id).map(function (connector) {
      connector.x2 = connector.x2 + newX;
      connector.y2 = connector.y2 + newY;
    // connector.setPoints(connector.get('x1'), connector.get('x2'), connector.get('y1'), connector.get('y2'));
    });
  }

  resizeCanvas = (x, y) => {
    // var tempY = Number(d3.select(this.el).select(".dmcontainer-outline").attr("height")) + y,
    // tempX = Number(d3.select(this.el).select(".dmcontainer-outline").attr("width")) + x;
    // var canvas = d3.select(Diagram.Canvas.el);
    // if(canvas.attr("width") < tempX) {
    //   canvas.attr("width", tempX);
    // }
    // if(canvas.attr("height") < tempY) {
    //   canvas.attr("height", tempY);
    // }

  }
}
