import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private baseUrl = 'https://e52609c5-b7b5-4f54-807c-91080699e355.mock.pstmn.io';

  constructor(private http: HttpClient) {}

  getOrdersByRestaurant(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pie/orders-by-restaurant`);
  }

  getOrdersByStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pie/orders-by-status`);
  }

  getPaymentMethods(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pie/payment-methods`);
  }

  getOrdersPerDay(): Observable<any> {
    return this.http.get(`${this.baseUrl}/bar/orders-per-day`);
  }

  getProductsMostSold(): Observable<any> {
    return this.http.get(`${this.baseUrl}/bar/products-most-sold`);
  }

  getDriversActivity(): Observable<any> {
    return this.http.get(`${this.baseUrl}/bar/drivers-activity`);
  }

  getDeliveriesPerMonth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/line/deliveries-per-month`);
  }

  getIncomePerMonth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/line/income-per-month`);
  }

  getAvgDeliveryTime(): Observable<any> {
    return this.http.get(`${this.baseUrl}/line/avg-delivery-time`);
  }
}

