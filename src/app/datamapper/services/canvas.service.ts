import { Diagram } from './../models/diagram';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CanvasService {

  constructor() { }
  public diagram: Diagram = new Diagram();
  public tool;
  public loadfileContainer:string;

  private displayLoadFiled = new Subject<boolean>();
  displayLoadFiled$ = this.displayLoadFiled.asObservable();
  displayLoadFile(display: boolean) {
    this.displayLoadFiled.next(display);
  }


  private loadFiled = new Subject<any>();
  loadFiled$ = this.loadFiled.asObservable();
  loadFile(file: any) {
    var reader = new FileReader();
    var f = file.files[0];
    reader.onload = (e) => {
      //parseJSON
      var text = e.target["result"];
      this.loadFiled.next({ fileType: f.type, name: f.name, text: text });
    };
    reader.readAsText(f);
    this.displayLoadFiled.next(false);
    return false;
  }
}
