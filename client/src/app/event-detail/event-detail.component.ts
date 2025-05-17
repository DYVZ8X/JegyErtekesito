import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../shared/services/event.service';
import { CartService, CartItem } from '../shared/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private cartService = inject(CartService);

  event: any;
  availableSeats: string[] = [];
  selectedSeat: string = '';
  ticketCategory: 'vip' | 'general' | 'premium' = 'general';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getEventById(id).subscribe({
        next: (event) => {
          this.event = event;
          if (event._id && typeof event.seats === 'number') {
            this.loadAvailableSeats(event._id, event.seats);
          }
        },
        error: (err) => {
          console.error('Hiba történt:', err);
        }
      });
    }
  }

  loadAvailableSeats(eventId: string, totalSeats: number) {
    this.eventService.getBookedSeats(eventId).subscribe({
      next: (bookedSeats) => {
        const allSeats = Array.from({ length: totalSeats }, (_, i) => (i + 1).toString());
        this.availableSeats = allSeats.filter(seat => !bookedSeats.includes(seat));
      },
      error: (err) => console.error('Nem sikerült betölteni a foglalt helyeket:', err)
    });
  }

  addToCart() {
    console.log('Kategória:', this.ticketCategory); 
    if (!this.selectedSeat || !this.event) return;

    const price = this.event.tickets[this.ticketCategory];

    const item: CartItem = {
      event: this.event._id,
      ticketCategory: this.ticketCategory,
      price,
      seatNumber: this.selectedSeat
    };

    this.cartService.addToCart(item).subscribe({
      next: () => alert('Kosárhoz adva!'),
      error: () => alert('Hiba történt a kosárba rakás során.')
    });
  }
}
