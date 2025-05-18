import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../shared/services/event.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrl:'./order-list.component.scss'
})
export class OrderListComponent {
  private http = inject(HttpClient);
  private eventService = inject(EventService);

  events: any[] = [];
  selectedEventId = '';
  orders: any[] = [];

  ngOnInit() {
  this.eventService.getAllEvents().subscribe(events => {
      this.events = events;
    });
  }
  get totalOrderPrice(): number {
    return this.orders.reduce((sum, order) => sum + (order.price || 0), 0);
  }

loadOrdersForSelectedEvent() {
  if (!this.selectedEventId) {
    this.orders = [];
    return;
  }

  this.eventService.getOrdersForEvent(this.selectedEventId).subscribe({
    next: (orders) => this.orders = orders,
    error: (err) => {
      console.error('Hiba a rendelések lekérésekor:', err);
      this.orders = [];
    }
  });
}
}
