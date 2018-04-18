import { style } from '@angular/animations';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as d3 from "d3";

@Component({
  selector: 'datamappertest',
  templateUrl: "simple-mapper.component.html",
  styleUrls: ["simple-mapper.component.css"]
})

export class DataMapperTestComponent implements OnInit {
  constructor() { }

  inputs = [];
  outputs = [];
  inputleaves = [];
  outputleaves = [];
  connections = [];


  elementwidth = 120;
  elementheight = 30;
  inputstartx = 30;
  inputstarty = 50;
  outputstartx = this.inputstartx + 900;
  outputstarty = this.inputstarty;

  verticalmargin = 2;

  canvas;
  inputcontainer;
  outputcontainer;

  //update input output containers
  inputfo;
  inputtitle;
  inputtitleoutline;

  outputfo;
  outputtitle;
  outputtitleoutline;
  inputoutline;
  outputoutline;
  dragcontainer;

  ngOnInit() {

    //display or hide the load file options
    d3.select("#load-output-btn").on("click", function () {
      //$("#load-output").slideToggle();
    });
    d3.select("#load-input-btn").on("click", function () {
      //$("#load-input").slideToggle();
    });

    //clear the container
    d3.select("#clear-output-btn").on("click", function () {
      this.outputcontainer.selectAll(".node-element-rect").remove();
      this.outputcontainer.selectAll(".node-element-text").remove();
      this.outputcontainer.selectAll(".nodedot").remove();
      this.outputcontainer.selectAll(".dragdot").remove();
      this.canvas.selectAll(".dragline").remove();
    });
    d3.select("#clear-input-btn").on("click", function () {
      this.inputcontainer.selectAll(".node-element-rect").remove();
      this.inputcontainer.selectAll(".node-element-text").remove();
      this.inputcontainer.selectAll(".nodedot").remove();
      this.inputcontainer.selectAll(".dragdot").remove();
      this.canvas.selectAll(".dragline").remove();
    });




    this.canvas = d3.select(".canvas");
    this.inputcontainer = d3.select("#input-container");
    this.outputcontainer = d3.select("#output-container");



    //update input output containers
    this.inputfo = d3.select("#input-container-fo");
    this.inputtitle = this.inputfo.select("#input-container-title")
      .attr("x", this.inputstartx)
      .attr("y", this.inputstarty + 15)
      .attr("width", this.elementwidth + 100);
    this.inputtitleoutline = this.inputfo.select("#input-container-title-outline")
      .attr("x", this.inputstartx)
      .attr("y", this.inputstarty)
      .attr("width", this.elementwidth + 100);


    this.outputfo = d3.select("#output-container-fo");
    this.outputtitle = this.outputfo.select("#output-container-title")
      .attr("x", this.outputstartx)
      .attr("y", this.outputstarty + 15)
      .attr("width", this.elementwidth + 100);
    this.outputtitleoutline = this.outputfo.select("#output-container-title-outline")
      .attr("x", this.outputstartx)
      .attr("y", this.outputstarty)
      .attr("width", this.elementwidth + 100);


    this.inputoutline = this.inputcontainer.append("rect")
      .attr("x", this.inputstartx)
      .attr("y", this.inputstarty)
      .attr("width", this.elementwidth + 100)
      .attr("height", 200)
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("stroke-width", "1");

    this.outputoutline = this.outputcontainer.append("rect")
      .attr("x", this.outputstartx)
      .attr("y", this.outputstarty)
      .attr("width", this.elementwidth + 100)
      .attr("height", 200)
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("stroke-width", "1");


    //function to make the containers draggable
    this.dragcontainer = d3.drag()
      .on("start", function () { })
      .on("drag", function (d, i) {
        this.x = this.x || 0;
        this.y = this.y || 0;

        this.x += d3.event.dx;
        this.y += d3.event.dy;
        d3.select(this).attr("transform", "translate(" + this.x + "," + this.y + ")");

        this.updateConnections(d3.event.dx, d3.event.dy, d3.select(this));
      })
      .on("end", function () { });


    //make the containers draggable
    d3.select(d3.select("#input-container-fo").node().parentNode).call(this.dragcontainer);
    d3.select(d3.select("#output-container-fo").node().parentNode).call(this.dragcontainer);

    // if (window.File && window.FileList && window.FileReader) {
    //   init("input-file-select", "input-file-drag", inputcontainer);
    //   init("output-file-select", "output-file-drag", outputcontainer);
    // }
  }



  updateContainers = () => {
    var maxinlev = 0,
      maxoutlev = 0;
    for (var i = 0; i < this.inputs.length; i++) {
      if (maxinlev < this.inputs[i].level) {
        maxinlev = this.inputs[i].level;
      }
    }
    for (var i = 0; i < this.outputs.length; i++) {
      if (maxoutlev < this.outputs[i].level) {
        maxoutlev = this.outputs[i].level;
      }
    }

    if (this.inputs.length !== 0) {
      var instart = this.inputs[0].textnode.attr("x") - 5;
      var inw = this.elementwidth + 20 + (maxinlev * 20);
      var inh = 50 + ((this.elementheight + 2) * this.inputs.length); //plus two for the border
      this.inputtitleoutline
        .attr("width", inw)
        .attr("x", instart);
      this.inputoutline
        .attr("width", inw)
        .attr("height", inh)
        .attr("x", instart);
    }

    if (this.outputs.length !== 0) {
      var outstart = this.outputs[0].textnode.attr("x") - 5;
      var outw = this.elementwidth + 20 + (maxoutlev * 20);
      var outh = 50 + ((this.elementheight + 2) * this.outputs.length);
      this.outputtitleoutline
        .attr("width", outw)
        .attr("x", outstart);
      this.outputoutline
        .attr("width", outw)
        .attr("height", outh)
        .attr("x", outstart);
    }


    //update the canvas height
    var newh = (d3.max([this.inputs.length, this.outputs.length]) * this.elementheight) + 200 + (d3.max([this.inputTranslateY(), this.outputTranslateY()]));
    if (Number(this.canvas.attr("height")) < newh) {
      this.canvas.attr("height", newh);
    }
  }


  updateConnections(newx, newy, sourcecontainer) {

    if (sourcecontainer.attr("id") === this.inputcontainer.attr("id")) {

      this.canvas.selectAll(".dragline")
        .attr("x2", function () {

          return d3.select(this).attr("x2") - newx;
        })
        .attr("y2", function () {
          return d3.select(this).attr("y2") - newy;
        });
    } else if (sourcecontainer.attr("id") === this.outputcontainer.attr("id")) {
      this.canvas.selectAll(".dragline")
        .attr("x2", function () {
          //console.log(newx);
          return Number(d3.select(this).attr("x2")) + newx;
        })
        .attr("y2", function () {
          return Number(d3.select(this).attr("y2")) + newy;
        });

    }
  }


  //traverse XML tree
  traverseTree(rootNode, level, targetarray) {
    if (rootNode.nodeType !== Node.ELEMENT_NODE) {

      return;
    }
    var children = rootNode.childNodes;
    var isleaf = false;
    if (children.length === 1) {
      isleaf = true;
    }
    targetarray.push({
      "text": rootNode.nodeName,
      "level": level,
      "leaf": isleaf,
      "type": "",
      "width": this.elementwidth,
      "height": this.elementheight
    });


    for (var i = 0; i < children.length; i++) {

      var child = children[i];
      if (child.nodeType === Node.ELEMENT_NODE) {
        this.traverseTree(child, level + 1, targetarray);
      }

    }
  }


  //parse XML tree
  parseXMLTree(inputText, resultBox) {

    //remove elements of the inputs and outputs
    resultBox.selectAll(".node-element-rect").remove();
    resultBox.selectAll(".node-element-text").remove();
    resultBox.selectAll(".nodedot").remove();
    resultBox.selectAll(".dragdot").remove();
    this.canvas.selectAll(".dragline").remove();
    var parser = new DOMParser();


    var xmlDoc = parser.parseFromString(inputText, "text/xml");

    // documentElement always represents the root node
    var root = xmlDoc.documentElement;
    var targetarray = [];

    this.traverseTree(root, 0, targetarray);

    if (resultBox.attr("id").split("-")[0] === "input") {
      this.inputs = [];
      this.inputleaves = [];
      //define inputs array
      this.inputs = targetarray;
      //generate input leaves array
      for (var i = 0; i < this.inputs.length; i++) {
        this.inputs[i].id = i;
        if (this.inputs[i].leaf) {
          this.inputleaves.push(this.inputs[i]);
        }
      }
      this.drawNodeStack(this.inputcontainer, this.inputstartx, this.inputstarty, this.verticalmargin, this.inputs, this.inputleaves, "RIGHT", "input");

    } else if (resultBox.attr("id").split("-")[0] === "output") {
      this.outputs = [];
      this.outputleaves = [];
      this.outputs = targetarray;
      for (var i = 0; i < this.outputs.length; i++) {
        this.outputs[i].id = i;
        if (this.outputs[i].leaf) {
          this.outputleaves.push(this.outputs[i]);
        }
      }
      this.drawNodeStack(this.outputcontainer, this.outputstartx, this.outputstarty, this.verticalmargin, this.outputs, this.outputleaves, "LEFT", "output");
    }
  }



  detectDropNode(xx, yy, data) { //parameters = mouse pointer position and the source data array
    var target = [];
    if (data[0].type === "input") { //if root is from input target is outputs
      target = this.outputs;
    } else {
      target = this.inputs;
    }
    var i;
    for (i = 0; i < target.length; i++) {
      if (target[i].leaf) { //filter leaves

        var box = target[i].textnode;

        if (target[i].type === "output") {
          var x = Number(box.attr("x")) - this.inputTranslateX() + this.outputTranslateX(),
            y = Number(box.attr("y")) - this.inputTranslateY() + this.outputTranslateY();
        } else {
          var x = Number(box.attr("x")) + this.inputTranslateX() - this.outputTranslateX(),
            y = Number(box.attr("y")) + this.inputTranslateY() - this.outputTranslateY();
        }
        var width = this.elementwidth,
          height = this.elementheight;
        if (xx > x && xx < x + width) { //check whether horizontally in
          if (yy > (y - height / 2) && yy < (y + height / 2)) { //check whether vertically in
            return target[i];
          }
        }
      }
    }
    return "null";
  }


  drawNodeStack(container, startX, startY, verticalmargin, data, leafdata, dotposition, type) {

    startY += 30; // skip space for title

    var coordinates, dragdot2, dragline,
      childcontainer = d3.select("#" + (container.attr("id") + "-2")),
      leafcontainer = d3.select("#" + (container.attr("id") + "-1"));



    var dragme = d3.drag()
      .on("start", function (d) {
        d3.select("#inputnode").text(d.text);
        d3.select("#outputnode").text("");
        var thisdragY = d3.select(this).attr("cy");
        var thisdragX = d3.select(this).attr("cx");
        var thisdragR = d3.select(this).attr("r");
        coordinates = [0, 0];

        dragdot2 = container.append("circle").attr("class", "dragdot")
          .attr("cx", thisdragX)
          .attr("cy", thisdragY)
          .attr("r", thisdragR)
          .attr("fill", "red");
        dragline = this.inputcontainer.append("line").attr("class", "dragline")
          .style("stroke", "black")
          .style("stroke-width", "2");
        if (this.inputcontainer === container) {
          dragline.attr("x1", thisdragX)
            .attr("x2", thisdragX)
            .attr("y1", thisdragY)
            .attr("y2", thisdragY);
        } else {

          dragline.attr("x1", thisdragX - this.inputTranslateX() + this.outputTranslateX())
            .attr("x2", thisdragX - this.inputTranslateX() + this.outputTranslateX())
            .attr("y1", thisdragY - this.inputTranslateY() + this.outputTranslateY())
            .attr("y2", thisdragY - this.inputTranslateY() + this.outputTranslateY());
        }
      })
      .on("drag", function (d) {
        coordinates = d3.mouse(this);
        this.xx = coordinates[0];
        this.yy = coordinates[1];

        if (this.inputcontainer === container) {
          dragline.attr("x2", this.xx).attr("y2", this.yy);
        } else {

          dragline
            .attr("x1", this.xx - this.inputTranslateX() + this.outputTranslateX())
            .attr("y1", this.yy - this.inputTranslateY() + this.outputTranslateY());
        }
        dragdot2.attr("cx", this.xx).attr("cy", this.yy);
        //TODO if position is inside the outleafs - text color change
      })
      .on("end", function (d) {
        var target = this.detectDropNode(this.xx, this.yy, data);

        if (target !== "null") {
          d3.select("#outputnode").text(target.text);

          var dotx = Number(target.dot.attr("cx"));
          var doty = Number(target.dot.attr("cy"));

          if (this.inputcontainer === container) {
            dragline
              .attr("x2", dotx - this.inputTranslateX() + this.outputTranslateX())
              .attr("y2", doty - this.inputTranslateY() + this.outputTranslateY());
          } else {
            dragline
              .attr("x1", dotx)
              .attr("y1", doty);
          }
          dragdot2.remove();
          this.connections.push({
            "source": d,
            "target": target,
            "line": dragline
          }); //NOT USED
        } else {
          d3.select("#inputnode").text("");
          dragline.remove();
          dragdot2.remove();
        }
      });



    var inputtext = container.selectAll(".node-element-text")
      .data(data)
      .enter().append("text").attr("class", "node-element-text")
      .attr("x", function (d) {
        d.type = type; //set the type
        return startX + (d.level * 20);
      })
      .attr("y", function (d, i) {
        return startY + ((d.height + verticalmargin) * i) + (d.height) / 2;
      })
      .each(function (d) {
        d.textnode = d3.select(this);
      })
      .text(function (d) {
        return d.text;
      });




    var inputnodedot = container.selectAll(".nodedot")
      .data(leafdata)
      .enter().append("circle").attr("class", "nodedot")
      .attr("r", function (d) {
        return d.height / 4;
      })
      .attr("cx", function (d) {
        if (dotposition === "RIGHT") {
          return startX + (d.level * 20) + d.width;
        } else if (dotposition === "LEFT") {
          return startX + (d.level * 20);
        }
        return 0;

      })
      .attr("cy", function (d, i) {
        return startY + ((d.height + verticalmargin) * d.id) + (d.height) / 2;
      })
      .attr("r", function (d) {
        return (d.height) / 5;
      })
      .attr("fill", "black")
      .each(function (d) {
        d.dot = d3.select(this);
      })
      .call(dragme);


    this.updateContainers();

  }

  getTranslation(transform) {
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

  getParentTransform(elementobject) { //parameter is an element in an object - inputs or outputs array
    var transform = d3.select(elementobject["_groups"][0][0].parentNode).attr("transform");
    return transform;
  }

  inputTranslateX() {
    return Number(this.getTranslation(this.inputcontainer.attr("transform"))[0]);
  }

  inputTranslateY() {
    return Number(this.getTranslation(this.inputcontainer.attr("transform"))[1]);
  }

  outputTranslateX() {
    return Number(this.getTranslation(this.outputcontainer.attr("transform"))[0]);
  }

  outputTranslateY() {
    return Number(this.getTranslation(this.outputcontainer.attr("transform"))[1]);
  }




}

