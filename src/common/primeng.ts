import {
  ChartModule, CarouselModule, MegaMenuModule,
  BreadcrumbModule, EditorModule, RatingModule, SliderModule, SidebarModule, ColorPickerModule
} from 'primeng/primeng';
// input
import { AutoCompleteModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { ListboxModule } from 'primeng/primeng';
import { SpinnerModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TriStateCheckboxModule } from 'primeng/primeng';
import { InputMaskModule } from 'primeng/primeng';
// import {SelectItemModule} from 'primeng/primeng';
import { MultiSelectModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';
import { SelectButtonModule } from 'primeng/primeng';
// button
import { ButtonModule } from 'primeng/primeng';
import { ToggleButtonModule } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/primeng';
// data table
import { DataTableModule } from 'primeng/primeng';
import { Column } from 'primeng/primeng';
import { PickListModule } from 'primeng/primeng';
import { DataGridModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import { TreeModule } from 'primeng/primeng';
import { TreeTableModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
// panel
import { AccordionModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { FieldsetModule } from 'primeng/primeng';
import { ToolbarModule } from 'primeng/primeng';
// overlay
import { DialogModule } from 'primeng/primeng';
import { OverlayPanelModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
// menu
import { MenubarModule } from 'primeng/primeng';
import { MenuModule } from 'primeng/primeng';
// messages
import { MessagesModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
// drag drop
import { DragDropModule } from 'primeng/primeng';
// misc
import { ProgressBarModule } from 'primeng/progressbar';
import { SharedModule } from 'primeng/primeng';

import { CalendarModule, TabMenuModule, InplaceModule } from 'primeng/primeng';

import { DataListModule } from 'primeng/primeng';
import { FileUploadModule } from 'primeng/primeng';
import { ChipsModule } from 'primeng/primeng';

import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CardModule } from 'primeng/card';


// Environment Providers
const MODULES = [
  InputTextModule, CheckboxModule, ListboxModule, RadioButtonModule, DropdownModule, InputTextareaModule,
  SelectButtonModule, SpinnerModule, InputSwitchModule,
  ButtonModule, SplitButtonModule, ToggleButtonModule,
  DataTableModule, PickListModule, DataGridModule, PaginatorModule, TreeModule, TreeTableModule, TableModule,
  AccordionModule, PanelModule, TabViewModule, FieldsetModule, ToolbarModule,
  DialogModule, OverlayPanelModule, TooltipModule, ConfirmDialogModule,
  MenubarModule, MenuModule, InputMaskModule,
  MessagesModule, GrowlModule, TriStateCheckboxModule,
  DragDropModule, SharedModule, CardModule,
  ProgressBarModule, MultiSelectModule, CalendarModule, ChartModule, CarouselModule,
  MegaMenuModule, BreadcrumbModule, TabMenuModule, InplaceModule, DataListModule, FileUploadModule, ChipsModule,
  AutoCompleteModule, EditorModule, RatingModule, SliderModule, SidebarModule, ColorPickerModule, ScrollPanelModule
];


export const PRIMENG_MODULES = [
  ...MODULES
];
