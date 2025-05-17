import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface Event {
  _id?: string;
  title: string;
  date: Date;
  location: string;
  tickets: {
    vip: number;
    general: number;
    premium: number;
  };
  seats: number;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventsUpdated = new BehaviorSubject<boolean>(false);
  private apiUrl = 'http://localhost:5000/api/events';

  constructor(private http: HttpClient) {}

  get eventsUpdated$(): Observable<boolean> {
    return this.eventsUpdated.asObservable();
  }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl, { withCredentials: true });
  }

getEventById(id: string): Observable<Event> {
  return this.http.get<Event>(`${this.apiUrl}/${id}`, { withCredentials: true });
}

  createEvent(event: Event): Observable<Event> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Event>(this.apiUrl, event, {
      headers,
      withCredentials: true
    }).pipe(
      tap(() => this.eventsUpdated.next(true))
    );
  }

  updateEvent(id: string, event: Event): Observable<Event> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event, {
      headers,
      withCredentials: true
    }).pipe(
      tap(() => this.eventsUpdated.next(true))
    );
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete('${this.apiUrl}/${id}', {
      withCredentials: true
    }).pipe(
      tap(() => this.eventsUpdated.next(true))
    );
  }
  getBookedSeats(eventId: string): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/${eventId}/booked-seats`, { withCredentials: true });
}

}
