import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../shared/services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss',
})
export class AddEventComponent {
  event = {
    title: '',
    date: '',
    location: '',
    tickets: {
      vip: 0,
      general: 0,
      premium: 0
    },
    seats: 0,
    image: ''
  };

  constructor(private eventService: EventService, private router: Router) {}

  submit() {
    const eventToSubmit = {
    ...this.event,
    date: new Date(this.event.date)
  };
    this.eventService.createEvent(eventToSubmit).subscribe({
      next: () => this.router.navigateByUrl('/events'),
      error: (err) => console.error(err)
    });
  }
}
