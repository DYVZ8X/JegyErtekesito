import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../shared/services/event.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);

  event: any;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getEventById(id).subscribe({
        next: (event) => {
          this.event = event;
        },
        error: (err) => {
          console.error('Hiba történt:', err);
        }
      });
    }
  }
}
