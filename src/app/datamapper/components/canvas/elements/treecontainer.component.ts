import { TreeStructure } from '../../../models/tree-structure';
import { SchemifyService } from '../../../services/schemify.service';
import { ConfirmationService, MenuItem } from 'primeng/primeng';
import { ContainerComponent } from './container.component';
import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import * as d3 from "d3";
import { TreeContainer } from '../../../models/tree-container';
import { ContextMenuService, ContextMenuComponent } from 'ngx-contextmenu';
import { Subscription } from 'rxjs';
import { CanvasService } from '../../../services/canvas.service';
@Component({
  selector: '[tree-container]',
  templateUrl: "treecontainer.component.html",
  // template: `<p-contextMenu [target]="tc" [model]="menus"></p-contextMenu>`
})

export class TreeContainerComponent extends ContainerComponent implements OnInit, AfterViewInit {

  @ViewChild('contextMenu') public contextMenu: ContextMenuComponent;
  el = "#canvas";
  color = "#AABDBF";
  loadFileSubscription: Subscription;

  constructor(public contextMenuService: ContextMenuService, public confirmationService: ConfirmationService,
    public canvasService: CanvasService, public schemifyService: SchemifyService) {
    super(confirmationService, canvasService);

  }

  ngOnInit() {
    this.loadFileSubscription = this.canvasService.loadFiled$.subscribe(e => {
      if (this.canvasService.loadfileContainer == this.model.id) {

        var data = this.getJSONschema(e);
        this.parseSchema(data);
      }
    });
  }
  ngAfterViewInit(): void {
    this.el = "#" + this.model.id;
    d3.select(this.el).call(this.dragContainer());
  }

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

  loadFile = () => {
    this.canvasService.loadfileContainer = this.model.id;
    this.canvasService.displayLoadFile(true);
  }
  getJSONschema = function (file) {
    var self = this;
    var type = file.fileType;
    var filename: string = file.name;
    if (type == "") {
      if (filename.indexOf(".xsd") > -1) {
        type = "xsd";
      }
    }
    var schemaOutput = {
      // jsonschema: function () {
      //   return JSON.parse(file.text);
      // },
      "application/json": function () {
        var m = self.schemifyService.JSONtoJSONSchema(JSON.parse(file.text));
        return m;
      },
      "text/csv": function () {
        var m = self.schemifyService.CSVParser.parse(file.text, true, ",", false, false, ".");
        var newSchema = {
          "title": "csv root",
          "type": "object",
          "properties": {}
        };
        m.headerNames.map(function (header, index) {
          newSchema.properties[header] = {
            "type": m.headerTypes[index]
          };
        });
        return newSchema;
      },
      "text/xml": function () {
        //                var jsonObj = xml2json(fileText);
        //                console.log(JSON.stringify(jsonObj, null, 4));


        var dd = self.schemifyService.XMLtoJSONSchema(file.text);

        //                var dd = Schemify.JSONtoJSONSchema(jsonObj);
        //                console.log(JSON.stringify(jsonObj, null, 4));
        return dd;
      },
      "xsd": function () {
        var sch = self.schemifyService.XSDtoJSONSchema(file.text);
        //                console.log(JSON.stringify(sch, null, 4));
        return sch;
      }
    };
    var schema = schemaOutput[type]();
    console.log(JSON.stringify(schema, null, 4));
    return schema;
  }

  parseSchema = function (data) {
    var count = this.drawTree(data);
    this.elementCount = count;
    //this.updateContainerHeight();
    //this.updateContainerWidth();
  }

  drawTree = (data) => {
    var title = (data.properties || data.items) ? data.title || "Root" : null;
    if (title === null) {
      return 0;
    }

    var tree = new TreeStructure(
      this.model.nodeCollection,
      this.model.nodeHeight,
      this.model.rankMargin, this.model.id,
      this.model.containerWidth,
      this.model.type,
      // this.model,
      data,
      title,
      0,
      0,
      null,
      null,
    );
    var level = tree.initTree(data, false);
    console.log(tree);
    this.model.tree = tree;
    // this.get('nodeCollection').setBranchIcons();
    // this.set('tree', tree);
    // this.set('elementCount', level);
    // //        console.log(tree.get('children'));
    return level;
  }
}
