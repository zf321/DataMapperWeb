
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { CanvasService } from '../services/canvas.service';
import { Diagram } from '../models/diagram';
import { MenuItem } from 'primeng/primeng';

import { Component, ChangeDetectionStrategy, OnInit, Output, EventEmitter } from '@angular/core';

import * as d3 from "d3";
@Component({
  selector: 'datamapper-editor',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'datamapper-editor.component.html'
})

export class DataMapperEditorComponent implements OnInit {
  diagram: Diagram;
  displayInputName: boolean;
  displayList: boolean;
  constructor(public canvasService: CanvasService) {

    this.diagram = this.canvasService.diagram;

  }

  ngOnInit() {
  }
  showMappings = () => {
    console.log(this.diagram);
  }
  open() {
    this.displayList = true;
  }
  select() {
  }
  create() {
    if (this.diagram.Name) {
      var d = new Diagram();
      d.Name = this.diagram.Name;
      d.init();
      this.canvasService.diagram = d;
      this.diagram = this.canvasService.diagram;
      this.displayInputName = false;
    }
  }
  save() {
  }
}
