import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-hystory.component.html',
  styleUrls: ['./order-hystory.component.scss']
})
export class OrderHystoryComponent implements OnInit {
  private http = inject(HttpClient);
  orders: any[] = [];

  ngOnInit() {
    this.http.get<any[]>('http://localhost:5000/api/orders/mine', {
      withCredentials: true
    }).subscribe({
      next: data => this.orders = data,
      error: err => console.error('Hiba a rendelések lekérdezésekor:', err)
    });
  }
}
