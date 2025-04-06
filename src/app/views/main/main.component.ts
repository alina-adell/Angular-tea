import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'main-component',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  @ViewChild('secondDialog', { static: true }) secondDialog: TemplateRef<HTMLElement> | undefined;
  private readonly observable: Observable<void>
  private subscription: Subscription | undefined;

  constructor(private dialog: MatDialog) {
    //Observable для отображения модального окна
    this.observable = new Observable((observer) => {
      setTimeout(() => {
        observer.next();
        observer.complete();
      }, 10000);
    })
  }

  ngOnInit() {
    //Подписка на открытие модального окна
    this.subscription = this.observable.subscribe(() =>{
      this.openDialogWithTemplateRef(this.secondDialog)
    })
  }

  //Метод открытия модального окна
  openDialogWithTemplateRef(templateRef: TemplateRef<HTMLElement> | undefined) {
    if (templateRef) {
      this.dialog.open(templateRef);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
