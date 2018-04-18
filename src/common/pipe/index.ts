import { TruncatePipe } from './limit-to.pipe';
import { NgModule } from '@angular/core';

import { KeysPipe } from './keys.pipe';

export const PIPES = [
  TruncatePipe, KeysPipe
];

@NgModule({
  declarations: PIPES,
  exports: PIPES
})
export class PipesModule { }
