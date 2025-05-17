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
  selectedSeat = '';
  ticketCategory: 'vip' | 'general' | 'premium' = 'general';

  isAdmin = false;
  editMode = false;

ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
  if (!id) return;

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
      this.availableSeats = allSeats.filter(seat => !bookedSeats.includes(seat));
    });
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
