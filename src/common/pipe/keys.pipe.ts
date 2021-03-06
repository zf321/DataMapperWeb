import { Pipe, PipeTransform } from '@angular/core';
/*
 # Description:

 Repackages an array subset as a new array.

 **Reasoning:**

 Angular2's change checker freaks out when you ngFor an array that's a subset
 of a larger data structure.

 # Usage:
 ``
 <div *ngFor="#entry of content | keys">
 Key: {{entry.key}}, value: {{entry.value}}
 </div>
 ``
 */
@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}
