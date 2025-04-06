import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductsInterface} from "../../interfaces/products.interface";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  //Метод запроса продуктов
  getProducts(): Observable<ProductsInterface[]> {
    return this.http.get<ProductsInterface[]>('https://testologia.ru/tea');
  }

  //Метод запроса продукта
  getProduct(id: number): Observable<ProductsInterface> {
    return this.http.get<ProductsInterface>(`https://testologia.ru/tea?id=${id}`);
  }

  //Метод запроса отправки формы заказа
  createOrder(data: {}): Observable<{ success: number; message?: string }> {
    return this.http.post<{success: number, message?: string}>(`https://testologia.ru/order-tea`, data);
  }
}
