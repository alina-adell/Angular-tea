import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {ProductsService} from "../../shared/services/products.service";

@Component({
  selector: 'order-component',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  private productTitle: string | null = '';
  public inputReadonly: boolean = false; //Флаг для поля продукта
  public isVisibleForm: boolean = true; //Флаг отображения для формы
  public responseError: boolean = false; //Флаг отображения для ошибки при запросе
  public responseErrorText: string | null = '';

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
              private productService: ProductsService) {}

  //Переменные для хранения подписок
  private subscriptionsParams: Subscription | null = null;
  private subscriptionsOrder: Subscription | null = null;

  orderForms: FormGroup = this.formBuilder.group(
    {
      name: this.formBuilder.control<string>('', {
        validators: [Validators.required, Validators.pattern('^[А-ЯЁ][а-яё]+$')],
        updateOn: 'blur'
      }),
      last_name: this.formBuilder.control<string>('', {
        validators: [Validators.required, Validators.pattern('^[А-ЯЁ][а-яё]+$')],
        updateOn: 'blur'
      }),
      phone: this.formBuilder.control<string>('', {
        validators: [Validators.required, Validators.pattern('^\\+?\\d{11}$')],
        updateOn: 'blur'
      }),
      country: this.formBuilder.control<string>('', {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      zip: this.formBuilder.control<string>('', {
        validators: [Validators.required, Validators.pattern('^\\d{6}$')],
        updateOn: 'blur'
      }),
      product: this.formBuilder.control<string>(''),
      address: this.formBuilder.control<string>('', {
        validators: [Validators.required, Validators.pattern('^[а-яА-Я0-9,\\.\\s]+$')],
        updateOn: 'blur'
      }),
      comment: this.formBuilder.control<string>('')
    }
  );

  //Запрет ввода пробела
  public preventSpace(e: KeyboardEvent): void {
    if (e.key === ' ') {
      e.preventDefault();
    }
  }

  ngOnInit(): void {
    //Получение параметра из адресной строки и передача его в инпут
    this.subscriptionsParams = this.route.paramMap.subscribe(params => {
      this.productTitle = params.get('product');
      this.orderForms.patchValue({product: this.productTitle})
      this.inputReadonly = true;
    });
  }

  //Отправка формы на сервер
  public onSubmit(): void {
    if (this.orderForms.valid) {
      const data = this.orderForms.value
      this.subscriptionsOrder = this.productService.createOrder(data)
        .subscribe({
          next: (response => {
            if (response.success && !response.message) {
              this.inputReadonly = false;
              this.orderForms.reset();
              this.isVisibleForm = false;
            } else {
              this.responseError = true;
              this.responseErrorText = response.message || "Произошла ошибка. Попробуйте еще раз.";
            }
          }),
          error: (error) => {
            this.responseError = true;
            this.responseErrorText = error.message;
          }
        });
    } else {
      this.orderForms.markAllAsTouched();
      this.responseError = true;
      this.responseErrorText = "Пожалуйста, заполните все обязательные поля!"
      return;
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptionsParams) this.subscriptionsParams?.unsubscribe();
    if (this.subscriptionsOrder) this.subscriptionsOrder?.unsubscribe();
  }
}
