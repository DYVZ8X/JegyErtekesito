import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { EventService } from '../shared/services/event.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  isAdmin: boolean = false;
  events: any[] = [];

  private eventService = inject(EventService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.eventService.getAllEvents().subscribe((res) => {
      this.events = res;
    });

    this.authService.checkPermission((permission) => {
      this.isAdmin = permission === 'admin';
    });
  }

  viewDetails(eventId: string) {
    this.router.navigate(['/events', eventId]);
  }
  get dynamicHeaderMargin(): string {
    const extraMargin = 700+Math.ceil(Math.ceil(this.events.length / 2) * 130*Math.pow((1+((this.events.length/1.8)/this.events.length)),1.1));
    return `${extraMargin}px`;
  }
  navigateToAddEvent() {
    this.router.navigate(['/add-event']);
  }
}
