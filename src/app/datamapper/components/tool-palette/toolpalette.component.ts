import { CanvasService } from './../../services/canvas.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tool-palette',
  template: `
  <p-accordion >
    <p-accordionTab *ngFor="let g of  toolGroupDefs" [header]="g.toolGroupName">
        <tool *ngFor="let t of g.tools" [title]="t.title" [icon]="t.icon" pDraggable="tool" (onDragStart)="dragStart($event,t)"></tool>
    </p-accordionTab>
  </p-accordion>
`
})

export class ToolPaletteComponent implements OnInit {
  constructor(public canvasService: CanvasService) {

  }

  ngOnInit() { }
  dragStart =  (evt, tool) =>{
    this.canvasService.tool = tool;
  }

  toolGroupDefs = [{
    toolGroupName: "Tree containers",
    toolGroupID: "tree-containers",
    tools: [{
      id: "Input",
      title: "Input",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        isContainer: true,
        type: "input"
      }
    }]
  }, {
    toolGroupName: "Common",
    toolGroupID: "common-tool-group",
    tools: [{
      id: "Constant",
      title: "Constant",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: [],
        outputTypes: ["String"],
        inputLabels: [],
        outputLabels: ["Const"]
      }
    }, {
      id: "CustomFunction",
      title: "CustomFunction",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["String", "String"],
        outputTypes: ["String"],
        inputLabels: ["In", "In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "Properties",
      title: "Properties",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: [],
        outputTypes: ["String"],
        inputLabels: [],
        outputLabels: ["Value"]
      }
    }, {
      id: "Compare",
      title: "Compare",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["String", "String"],
        outputTypes: ["Boolean"],
        inputLabels: ["In", "In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "GlobalVariable",
      title: "GlobalVariable",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: [],
        outputTypes: ["String"],
        inputLabels: [],
        outputLabels: ["Value"]
      }
    }]
  }, {
    toolGroupName: "Arithmetic",
    toolGroupID: "arithmetic-tool-group",
    tools: [{
      id: "Add",
      title: "Add",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["Number", "Number"],
        outputTypes: ["Number"],
        inputLabels: ["In", "In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "Subtract",
      title: "Subtract",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["Number", "Number"],
        outputTypes: ["Number"],
        inputLabels: ["Number", "Subtrahend"],
        outputLabels: ["Result"]
      }
    }, {
      id: "Multiply",
      title: "Multiply",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["Number", "Number"],
        outputTypes: ["Number"],
        inputLabels: ["In", "In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "Divide",
      title: "Divide",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["Number", "Number"],
        outputTypes: ["Number"],
        inputLabels: ["Number", "Divisor"],
        outputLabels: ["Result"]
      }
    }, {
      id: "Ceiling",
      title: "Ceiling",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["Number"],
        outputTypes: ["Number"],
        inputLabels: ["In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "Floor",
      title: "Floor",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["Number"],
        outputTypes: ["Number"],
        inputLabels: ["In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "Round",
      title: "Round",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["Number"],
        outputTypes: ["Number"],
        inputLabels: ["In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "SetPrecision",
      title: "SetPrecision",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["Number", "Number"],
        outputTypes: ["Number"],
        inputLabels: ["In", "DecimalCount"],
        outputLabels: ["Result"]
      }
    }, {
      id: "AbsoluteValue",
      title: "AbsoluteValue",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["Number"],
        outputTypes: ["Number"],
        inputLabels: ["In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "Min",
      title: "Min",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["Number", "Number"],
        outputTypes: ["Number"],
        inputLabels: ["In", "In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "Max",
      title: "Max",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["Number", "Number"],
        outputTypes: ["Number"],
        inputLabels: ["In", "In"],
        outputLabels: ["Result"]
      }
    }]
  }, {
    toolGroupName: "Conditional",
    toolGroupID: "conditional-tool-group",
    tools: [{
      id: "IfElse",
      title: "IfElse",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["Boolean", "String", "String"],
        outputTypes: ["String"],
        inputLabels: ["Condition", "Then", "Else"],
        outputLabels: ["Result"]
      }
    }]
  }, {
    toolGroupName: "Boolean",
    toolGroupID: "boolean-tool-group",
    tools: [{
      id: "AND",
      title: "AND",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["Boolean", "Boolean"],
        outputTypes: ["Boolean"],
        inputLabels: ["In", "In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "OR",
      title: "OR",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["Boolean", "Boolean"],
        outputTypes: ["Boolean"],
        inputLabels: ["In", "In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "NOT",
      title: "NOT",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["Boolean"],
        outputTypes: ["Boolean"],
        inputLabels: ["In"],
        outputLabels: ["Result"]
      }
    }]
  }, {
    toolGroupName: "Type Conversion",
    toolGroupID: "typeConversion-tool-group",
    tools: [{
      id: "StringToNumber",
      title: "StringToNumber",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["String"],
        outputTypes: ["Number"],
        inputLabels: ["In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "StringToBoolean",
      title: "StringToBoolean",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["String"],
        outputTypes: ["Boolean"],
        inputLabels: ["In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "ToString",
      title: "ToString",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["Number"],
        outputTypes: ["String"],
        inputLabels: ["In"],
        outputLabels: ["Result"]
      }
    }]
  }, {
    toolGroupName: "String",
    toolGroupID: "string-tool-group",
    tools: [{
      id: "Concat",
      title: "Concat",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["String", "String"],
        outputTypes: ["String"],
        inputLabels: ["In", "In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "Split",
      title: "Split",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["String"],
        outputTypes: ["String", "String"],
        inputLabels: ["In"],
        outputLabels: ["Result", "Result"]
      }
    }, {
      id: "LowerCase",
      title: "LowerCase",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["String"],
        outputTypes: ["String"],
        inputLabels: ["In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "UpperCase",
      title: "UpperCase",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["String"],
        outputTypes: ["String"],
        inputLabels: ["In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "StringLength",
      title: "StringLength",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["String"],
        outputTypes: ["Number"],
        inputLabels: ["In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "StartsWith",
      title: "StartsWith",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["String", "String"],
        outputTypes: ["Boolean"],
        inputLabels: ["Value", "Pattern"],
        outputLabels: ["Result"]
      }
    }, {
      id: "EndsWith",
      title: "EndsWith",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["String", "String"],
        outputTypes: ["Boolean"],
        inputLabels: ["Value", "Pattern"],
        outputLabels: ["Result"]
      }
    }, {
      id: "Substring",
      title: "Substring",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["String", "Number", "Number"],
        outputTypes: ["String"],
        inputLabels: ["Value", "StartIndex", "Length"],
        outputLabels: ["Result"]
      }
    }, {
      id: "Trim",
      title: "Trim",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["String"],
        outputTypes: ["String"],
        inputLabels: ["In"],
        outputLabels: ["Result"]
      }
    }, {
      id: "Replace",
      title: "Replace",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["String", "String", "String"],
        outputTypes: ["String"],
        inputLabels: ["In", "Target", "ReplaceWith"],
        outputLabels: ["Result"]
      }
    }, {
      id: "Match",
      title: "Match",
      icon: "assets/images/datamapper/tool-icons/sample-tool-icon.svg",
      defaults: {
        arguments: [],
        inputTypes: ["String", "String"],
        outputTypes: ["Boolean"],
        inputLabels: ["In", "Pattern"],
        outputLabels: ["Result"]
      }
    }]
  }];
}
