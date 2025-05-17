import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CartItem {
  _id?: string;
  event: any;
  ticketCategory: 'vip' | 'general' | 'premium';
  price: number;
  seatNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartUpdated = new BehaviorSubject<boolean>(false);
  private apiUrl = 'http://localhost:5000/api/cart';

  constructor(private http: HttpClient) {}

  get cartUpdated$(): Observable<boolean> {
    return this.cartUpdated.asObservable();
  }

finalizeCart(): Observable<any> {
  return this.http.post('http://localhost:5000/api/orders/checkout', {});
}

getCart(): Observable<CartItem[]> {
  return this.http.get<{ items?: CartItem[] } | null>(this.apiUrl, { withCredentials: true }).pipe(
    map(res => (res?.items ?? [])) 
  );
}

  addToCart(item: CartItem): Observable<CartItem> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<CartItem>(this.apiUrl, item, {
      headers,
      withCredentials: true
    }).pipe(tap(() => this.cartUpdated.next(true)));
  }

  removeFromCart(itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${itemId}`, {
      withCredentials: true
    }).pipe(tap(() => this.cartUpdated.next(true)));
  }

  checkout(): Observable<any> {
    return this.http.post(`http://localhost:5000/api/orders/checkout`, {}, {
      withCredentials: true
    }).pipe(tap(() => this.cartUpdated.next(true)));
  }
}
