import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../shared/services/event.service';
import { CartService } from '../shared/services/cart.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent {
  private route = inject(ActivatedRoute);
  private router= inject(Router);
  private eventService = inject(EventService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  event: any;
  editedEvent: any = {};
  availableSeats: string[] = [];
  vipSeats: string[] = [];
  premiumSeats: string[] = [];
  generalSeats: string[] = [];
  selectedSeat = '';
  ticketCategory: 'vip' | 'general' | 'premium' = 'general';

  isLoggedIn = false;
  isAdmin = false;
  editMode = false;

ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
  if (!id) return;
  this.authService.isLoggedIn$.subscribe(auth => {
    this.isLoggedIn = auth;
  });
  this.authService.checkPermission(permission => {
    this.isAdmin = permission === 'admin';
  });

  this.eventService.getEventById(id).subscribe(event => {
    this.event = event;
    this.editedEvent = { ...event };
    if (event._id && typeof event.seats === 'number') {
      this.loadAvailableSeats(event._id, event.seats);
    }
  });
}


loadAvailableSeats(eventId: string, totalSeats: number) {
  this.eventService.getBookedSeats(eventId).subscribe(bookedSeats => {
    const allSeats = Array.from({ length: totalSeats }, (_, i) => (i + 1).toString());
    const available = allSeats.filter(seat => !bookedSeats.includes(seat));

    const vipLimit = Math.floor(totalSeats * 0.1);
    const premiumLimit = vipLimit * 2;

    this.vipSeats = available.filter(seat => +seat <= vipLimit);
    this.premiumSeats = available.filter(seat => +seat > vipLimit && +seat <= premiumLimit);
    this.generalSeats = available.filter(seat => +seat > premiumLimit);
  });
}
get filteredSeats(): string[] {
  if (this.ticketCategory === 'vip') return this.vipSeats;
  if (this.ticketCategory === 'premium') return this.premiumSeats;
  return this.generalSeats;
}


  addToCart() {
    if (!this.selectedSeat || !this.event) return;

    const price = this.event.tickets[this.ticketCategory];

    const item = {
      event: this.event._id,
      ticketCategory: this.ticketCategory,
      price,
      seatNumber: this.selectedSeat
    };

    this.cartService.addToCart(item).subscribe(() => {
      alert('Kosárhoz adva!');
    });
  }

  updateEvent() {
    if (!this.event || !this.event._id) return;

    this.eventService.updateEvent(this.event._id, this.editedEvent).subscribe(updated => {
      this.event = updated;
      this.editMode = false;
      alert('Esemény frissítve!');
    });
  }

  deleteEvent() {
  if (!confirm('Biztosan törölni szeretnéd az eseményt? Ez a kosárban lévő tételeket is törli.')) return;

  this.eventService.deleteEvent(this.event._id).subscribe({
    next: () => {
      alert('Esemény sikeresen törölve.');
      this.router.navigate(['/events']);
    },
    error: err => {
      console.error(err);
      alert('Hiba történt a törlés során.');
    }
  });
}

}
