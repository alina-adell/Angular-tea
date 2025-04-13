import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ProductsService} from '../../shared/services/products.service';

@Component({
  selector: 'order-component',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  private productTitle: string | null = '';
  public inputReadonly: boolean = false;
  public isVisibleForm: boolean = true;
  public responseError: boolean = false;
  public responseErrorText: string | null = '';

  private subscriptionsParams: Subscription | null = null;
  private subscriptionsOrder: Subscription | null = null;

  orderForms: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.pattern('^[А-ЯЁ][а-яё]+$')]],
    last_name: ['', [Validators.required, Validators.pattern('^[А-ЯЁ][а-яё]+$')]],
    phone: ['', [Validators.required, Validators.pattern(/^\+7\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/)]],
    country: ['', [Validators.required]],
    zip: ['', [Validators.required, Validators.pattern('^\\d{6}$')]],
    product: ['', [Validators.required]],
    address: ['', [Validators.required, Validators.pattern('^[а-яА-Я0-9,\\.\\s]+$')]],
    comment: ['']
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductsService
  ) {
  }

  ngOnInit(): void {
    this.subscriptionsParams = this.route.paramMap.subscribe(params => {
      this.productTitle = params.get('product');
      if (this.productTitle) {
        this.orderForms.patchValue({product: this.productTitle});
        this.inputReadonly = true;
      }
    });
  }

  public preventSpace(e: KeyboardEvent): void {
    if (e.key === ' ') {
      e.preventDefault();
    }
  }

  public onSubmit(): void {
    if (this.orderForms.valid) {
      const data = this.orderForms.value;

      this.subscriptionsOrder = this.productService.createOrder(data).subscribe({
        next: (response) => {
          if (response.success && !response.message) {
            this.inputReadonly = false;
            this.orderForms.reset();
            this.isVisibleForm = false;
          } else {
            this.responseError = true;
            this.responseErrorText = response.message || 'Произошла ошибка. Попробуйте еще раз.';
          }
        },
        error: (error) => {
          this.responseError = true;
          this.responseErrorText = error.message;
        }
      });
    } else {
      this.orderForms.markAllAsTouched();
      this.responseError = true;
      this.responseErrorText = 'Пожалуйста, заполните все обязательные поля!';
    }
  }

  ngOnDestroy(): void {
    this.subscriptionsParams?.unsubscribe();
    this.subscriptionsOrder?.unsubscribe();
  }
}

