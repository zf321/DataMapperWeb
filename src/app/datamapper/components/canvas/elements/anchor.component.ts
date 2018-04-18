import { TreeContainer } from './../../../models/tree-container';
import { CanvasService } from '../../../services/canvas.service';
import { Diagram } from '../../../models/diagram';
import { Connector } from '../../../models/connector';
import { Anchor } from '../../../models/anchor';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as d3 from "d3";
import { Operator } from '../../../models/operator';
import { ViewNode } from '../../../models/node';

@Component({
  selector: '[anchor]',
  templateUrl: "anchor.component.html"
})

export class AnchorComponent implements OnInit, AfterViewInit {
  @Input() anchor: Anchor = new Anchor();
  tempConnector: Connector;
  diagram: Diagram;
  constructor(private canvasService: CanvasService) {
    this.diagram = this.canvasService.diagram;
  }

  ngOnInit() { }

  ngAfterViewInit(): void {
    var el = "#" + this.anchor.id;
    d3.select(el).call(this.dragAnchor());
  }

  dragAnchor = () => {
    var self = this;
    var dragHead2;
    return d3.drag()
      .on("start", function (d) {
        d3.event.sourceEvent.stopPropagation();
        var thisDragY = Number(d3.select(this).attr("cy"));
        var thisDragX = Number(d3.select(this).attr("cx"));
        var tempParent = d3.select(d3.select(this)["_groups"][0][0].parentNode);
        dragHead2 = self.drawDragArrow(tempParent, thisDragX, thisDragY);
        self.tempConnector = new Connector();
        self.tempConnector.x1 = thisDragX;
        self.tempConnector.x2 = thisDragX;
        self.tempConnector.y1 = thisDragY;
        self.tempConnector.y2 = thisDragY;
      })
      .on("drag", function (d) {
        var coordinates = d3.mouse(this);
        var xx = coordinates[0];
        var yy = coordinates[1];
        self.tempConnector.x2 = xx;
        self.tempConnector.y2 = yy;
        self.moveArrow(dragHead2, xx, yy);
      })
      .on("end", function (d) {
        var coordinates = d3.mouse(this);
        var xx = coordinates[0];
        var yy = coordinates[1];
        var sourceContainer:TreeContainer = self.getParentContainer(d3.select(this));
        var sourceNode = d3.select(d3.select(this)["_groups"][0][0].parentNode.parentNode);
        var target = self.detectDropNode(xx, yy, sourceNode.attr("type"), sourceContainer);
        //find backend nodes
        var backendSourceNode: ViewNode, backendTargetNode: ViewNode;
        if (target) {
          var findNodes = (function (sNode, tNode) {
            self.diagram.TreeContainers.concat(self.diagram.Operators).map(function (model) {
              if (!backendSourceNode) {
                backendSourceNode = model.nodeCollection.filter(c => c.id == sNode.node().id)[0];
              }
              if (!backendTargetNode) {
                backendTargetNode = model.nodeCollection.filter(c => c.id == tNode.node().id)[0];
              }
              if (backendSourceNode && backendTargetNode) {
                return [backendSourceNode, backendTargetNode];
              }
            });
          })(sourceNode, target);
        }

        if (target && backendSourceNode.textType.toLowerCase() === backendTargetNode.textType.toLowerCase()) {
          //limit the connections to one - in output targets
          // if (target.attr("type") === "output") {
          //   //loop through connectors to find targetNode=target and remove line
          //   var duplicate = self.diagram.Connectors.findFromTargetNode(target) || null;
          //   if (duplicate !== null) {

          //     duplicate.removeConnector();
          //   }
          // }

          var oppositeContainer = self.diagram.TreeContainers.concat(self.diagram.Operators).filter(c => c.id == backendTargetNode.parentContainerId)[0];
          sourceContainer = self.diagram.TreeContainers.concat(self.diagram.Operators).filter(c => c.id == backendSourceNode.parentContainerId)[0];
          var dotx = Number(target.select(".drag-head").attr("cx")) + oppositeContainer.x - sourceContainer.x;
          var doty = Number(target.select(".drag-head").attr("cy")) + oppositeContainer.y - sourceContainer.y;
          self.tempConnector.x2 = dotx;
          self.tempConnector.y2 = doty;
          // .attr("target-dmcontainer", oppositeContainer.attr("id"));
          self.tempConnector.targetContainerId = oppositeContainer.id;
          self.tempConnector.targetContainerType = oppositeContainer.viewType;

          self.tempConnector.targetNodeId = backendTargetNode.id;
          self.tempConnector.sourceContainerId = sourceContainer.id;
          self.tempConnector.sourceContainerType = sourceContainer.viewType;
          self.tempConnector.sourceNodeId = backendSourceNode.id;
          self.dropFunction(self.tempConnector, sourceContainer.x, sourceContainer.y);

        }
        dragHead2.remove();
        self.tempConnector = null;
      });
  }

  drawDragArrow = (parent, cx, cy) => {
    var newArrow = parent.append("polygon").attr("class", "drag-head-2");
    this.moveArrow(newArrow, cx, cy);
    return newArrow;
  }

  moveArrow = (arrow, cx, cy) => {
    arrow.attr("cx", cx)
      .attr("cy", cy);
    this.setPoints(arrow, cx, cy);
  }
  setPoints = (arrow, cx, cy) => {
    if (typeof arrow === "string") {
      arrow = d3.select("#" + arrow);
    }
    arrow.attr("points", function () {
      var p0 = [Number(cx) - 5, Number(cy) - 5],
        p1 = [Number(cx) + 5, Number(cy)],
        p2 = [Number(cx) - 5, Number(cy) + 5];
      return p0[0] + "," + p0[1] + " " + p1[0] + "," + p1[1] + " " + p2[0] + "," + p2[1];
    })
  }

  detectDropNode = (xx, yy, type, sourceContainer) => { //detect if a drop is near opposite type of drag-head
    var flag,
      self = this;
    d3.select("#canvas").selectAll(".leaf-node").each(function () { //assuming every leaf node has an anchor
      if (!flag && d3.select(this).attr("type") === "output") {
        var nodeElement = d3.select(this);
        if (nodeElement !== null) {
          var x = Number(nodeElement.attr("x")) + self.getTranslateX(self.getParentContainer(nodeElement)) - self.getTranslateX(sourceContainer);
          var y = Number(nodeElement.attr("y")) + self.getTranslateY(self.getParentContainer(nodeElement)) - self.getTranslateY(sourceContainer);
          var width = Number(nodeElement.attr("width"));
          var height = Number(nodeElement.attr("height"));
          // d3.select("#canvas").append("rect").attr("x", x).attr("y", y).attr("width", width).attr("height", height);
          if (self.pointInRect([xx, yy], x, x + width, y, y + height)) {
            flag = nodeElement;
          }
        }
      }
    });
    return flag;
  }

  pointInRect = function (point, x1, x2, y1, y2) { //determines if the point(array of coord) is bouded by the rectangle

    if (point[0] > x1 && point[0] < x2) {
      //horizontally inside
      if (point[1] > y1 && point[1] < y2) {
        //vertically in
        return true;
      }
    }
    return false;
  }

  getTranslation = function (transform) {
    // Create a dummy g for calculation purposes only. This will never
    // be appended to the DOM and will be discarded once this function
    // returns.
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    // Set the transform attribute to the provided string value.
    g.setAttributeNS(null, "transform", transform);
    // consolidate the SVGTransformList containing all transformations
    // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
    // its SVGMatrix.
    var matrix = g.transform.baseVal.consolidate().matrix;
    // As per definition values e and f are the ones for the translation.
    return [matrix.e, matrix.f];
  }

  getTranslateX = function (sourceContainer) {
    return Number(this.getTranslation(sourceContainer.attr("transform"))[0]);
  }

  getTranslateY = function (sourceContainer) {
    return Number(this.getTranslation(sourceContainer.attr("transform"))[1]);
  }

  getParentContainer = function (nodeElement) { //a recursive method to find g.container of an element
    if (nodeElement.classed("dmcontainer")) {
      return nodeElement;
    } else {
      return this.getParentContainer(d3.select(nodeElement["_groups"][0][0].parentNode));
    }
  }
  dropFunction = (temp, x1, y1) => {
    var connector = Object.assign({}, temp);
    connector.x1 += x1;
    connector.x2 += x1;
    connector.y1 += y1;
    connector.y2 += y1;

    this.diagram.Connectors.push(connector);
    //if the line is direct
    if (connector.isDirectConnector()) {
      var operator = new Operator(
        "direct",
        "directOperator", 0, 0, [], [],
        ["Direct"],
        ["Direct"]
      );
      var head = Object.assign({}, connector.sourceNode);
      var tail = Object.assign({}, connector.targetNode);
      connector.operator = operator;
      operator.nodeCollection = [head, tail];
      this.diagram.Operators.push(operator);
    } else {
      //            console.log(model.get('targetNode').get('isSchema'));
      if (!connector.targetNode.isSchema) {
        connector.targetNode.text = connector.sourceNode.text;
      }
    }
  }
}
