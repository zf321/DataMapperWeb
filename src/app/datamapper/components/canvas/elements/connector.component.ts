import { CanvasService } from '../../../services/canvas.service';
import { Diagram } from '../../../models/diagram';
import { ContextMenuService, ContextMenuComponent } from 'ngx-contextmenu/lib';
import { Connector } from '../../../models/connector';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as d3 from "d3";
@Component({
  selector: '[connector]',
  templateUrl: "connector.component.html"
})

export class ConnectorComponent implements OnInit {
  @ViewChild('contextMenu') public contextMenu: ContextMenuComponent;
  @Input() connector: Connector;
  diagram: Diagram;
  constructor(private contextMenuService: ContextMenuService, private canvasService: CanvasService) {
    this.diagram = this.canvasService.diagram;
  }

  ngOnInit() { }

  public onContextMenu($event: MouseEvent, item: any): void {
    if ($event.toElement.nodeName === 'circle') {
      this.contextMenuService.show.next({
        // Optional - if unspecified, all context menu components will open
        contextMenu: this.contextMenu,
        event: $event,
        item: item,
      });
      $event.stopPropagation();
    }
    $event.preventDefault();
  }
  removeConnector = () => {
    if (this.connector.isDirectConnector()) {
      this.diagram.Operators.splice(
        this.diagram.Operators.indexOf(this.diagram.Operators.filter(c => c.id == this.connector.operatorId)[0]), 1);
    } else {
      // var tnode = this.connector.targetNode;
      // if (!tnode.isSchema) {
      //   tnode.updateText();
      // }
    }
    this.connector = null;
    this.diagram.Connectors.splice(this.diagram.Connectors.indexOf(this.connector), 1);
  }
  setPoints = () => {
    var margin = 20;
    var points = "";

    var p1 = this.connector.x1 + "," + this.connector.y1,
      p2 = (Number(this.connector.x1) + margin) + "," + this.connector.y1,
      p3 = (Number(this.connector.x2) - margin) + "," + this.connector.y2,
      p4 = this.connector.x2 + "," + this.connector.y2;
    points = p1 + " " + p2 + " " + p3 + " " + p4;
    return points;
  }
}
