import { ContainerComponent } from './components/canvas/elements/container.component';

import { OperatorComponent } from './components/canvas/elements/operator.component';
import { ConnectorComponent } from './components/canvas/elements/connector.component';
import { AnchorComponent } from './components/canvas/elements/anchor.component';
import { SchemifyService } from './services/schemify.service';
import { ConfirmationService } from 'primeng/primeng';

import { CanvasComponent } from './components/canvas/canvas-view.component';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, Component } from '@angular/core';
import { DataMapperTestComponent } from './containers/simple-mapper.component';
import { DataMapperIndexComponent } from './containers/index';
import { DataMapperEditorComponent } from './containers/datamapper-editor.component';
import { ToolPaletteComponent } from './components/tool-palette/toolpalette.component';
import { ToolComponent } from './components/tool-palette/tool.component';
import { TreeContainerComponent } from './components/canvas/elements/treecontainer.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { CanvasService } from './services/canvas.service';
import { TreeStructureComponent } from './components/canvas/elements/treestructure.component';
import { NodeComponent } from './components/canvas/elements/elementnode.component';
import { PRIMENG_MODULES } from '../../common/primeng';
import { PipesModule } from '../../common/pipe';


// async components must be named routes for WebpackAsyncRoute
export const routes = [
  {
    path: 'datamapper',
    component: DataMapperIndexComponent,
    data: {
      "title": "datamapper",
      "menu": true
    }
    , children: [{
      path: "datamappereditor",
      component: DataMapperEditorComponent,
      data: {
        "title": "datamappereditor"
      }
    }, {
      path: "datamappertest",
      component: DataMapperTestComponent,
      data: {
        "title": "datamappertest"
      },
    }]
  }
];
export const COMPONENTS = [DataMapperIndexComponent, DataMapperEditorComponent, DataMapperTestComponent,
  ToolPaletteComponent, ToolComponent, CanvasComponent, TreeContainerComponent, TreeStructureComponent, NodeComponent
  , AnchorComponent, ConnectorComponent, OperatorComponent, ContainerComponent
];
@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    COMPONENTS,
  ],
  providers: [ConfirmationService, CanvasService, SchemifyService
  ],
  imports: [
    CommonModule,
    FormsModule, PRIMENG_MODULES,
    ContextMenuModule.forRoot(),
    RouterModule.forChild(routes),
    PipesModule


  ]
})
export class DataMapperModule {
  static routes = routes;
}
