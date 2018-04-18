import { ConfirmationService } from 'primeng/primeng';
import { SchemifyService } from '../../../services/schemify.service';
import { CanvasService } from '../../../services/canvas.service';
import { ContextMenuService } from 'ngx-contextmenu/lib';
import { TreeContainerComponent } from './treecontainer.component';
import { Component, OnInit, Input } from '@angular/core';
import * as d3 from "d3";
import { Operator } from '../../../models/operator';
@Component({
  selector: '[operator]',
  templateUrl: "operator.component.html",
})

export class OperatorComponent extends TreeContainerComponent implements OnInit {

  constructor(public contextMenuService: ContextMenuService, public confirmationService: ConfirmationService,
    public canvasService: CanvasService, public schemifyService: SchemifyService) {
    super(contextMenuService, confirmationService, canvasService, schemifyService);

  }

  ngOnInit() { }


}
