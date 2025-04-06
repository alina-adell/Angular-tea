import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MainRoutingModule} from './main-routing.module';
import {MainComponent} from "./main.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {NgbAccordionModule, NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    NgbCarouselModule,
    NgbAccordionModule,
    MainRoutingModule,
  ]
})
export class MainModule { }
