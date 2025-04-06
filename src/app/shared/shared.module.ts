import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TextHiddenPipe} from "./pipes/text-hidden.pipe";


@NgModule({
  declarations: [
    TextHiddenPipe
  ],
  exports: [
    TextHiddenPipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
